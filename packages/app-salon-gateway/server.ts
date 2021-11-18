import { GraphQLError } from 'graphql';
import { i18n, Locale } from '@kedul/common-config';
import { ApolloServer, ServerInfo } from 'apollo-server';
import * as Express from 'express';
import {
  ActorType,
  BusinessContext,
  RequestContext,
  RequestContextActor,
  SourceContext,
} from '@kedul/common-server';
import { isProduction, makeLogger, getOsEnv } from '@kedul/common-utils';
import { verifyAccessToken } from '@kedul/service-user';
import uuidv4 from 'uuid/v4';
import Knex from 'knex';

import { schema } from './schema';

const env = {
  database: {
    config: {
      client: getOsEnv('DATABASE_CLIENT'),
      connection: getOsEnv('DATABASE_CONNECTION'),
      name: getOsEnv('DATABASE_NAME'),
    },
  },
  logger: {
    config: {
      level: getOsEnv('LOGGER_LEVEL'),
    },
  },
  nodeEnv: getOsEnv('NODE_ENV'),
};

export const knex = Knex({
  client: env.database.config.client,
  connection: `${env.database.config.connection}/${env.database.config.name}`,
});

export const logger = makeLogger();

export const extractJwt = (headerAuthorizationField?: string) => {
  if (!headerAuthorizationField) {
    return null;
  }

  const parts = headerAuthorizationField.split(' ');

  if (parts.length === 2) {
    const scheme = parts[0];
    const token = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return token;
    }
  }

  return null;
};

const makeSource = (req: Express.Request) => {
  return SourceContext.BUSINESS_SITE;
};

const makeBusiness = (req: Express.Request): BusinessContext | null => {
  const businessId = req.headers['x-business-id'];

  if (typeof businessId !== 'string') {
    return null;
  }

  return {
    id: businessId,
  };
};

const makeLocale = (req: Express.Request): string => {
  const headerLocale = req.headers['accept-language'];

  if (headerLocale && Array.isArray(headerLocale)) {
    return headerLocale[0] || Locale.VI_VN;
  } else if (headerLocale) {
    return headerLocale;
  }

  return Locale.VI_VN;
};

const makeActor = async (
  req: Express.Request,
): Promise<RequestContextActor | null> => {
  const token = extractJwt(req.headers.authorization);
  if (!token) return null;

  const { tokenPayload, error } = await verifyAccessToken(token);

  if (!tokenPayload) {
    logger.warn('Access token verification failed', {
      data: error,
    });
    return null;
  }

  return {
    type: ActorType.USER,
    userId: tokenPayload.userId,
  };
};

export const makeRequestContext = async (
  req: Express.Request,
): Promise<RequestContext> => {
  const traceId = uuidv4();
  const actor = await makeActor(req);
  const business = makeBusiness(req);
  const locale = makeLocale(req);
  const source = makeSource(req);

  const dependencies = {
    knex,
    logger: isProduction
      ? logger.child({
          traceId,
          actor,
          business,
          locale,
          source,
        })
      : logger,
    i18n,
  };

  return {
    actor,
    business,
    dependencies,
    locale,
    source,
    traceId,
  };
};

const makeGraphQLServer = async () => {
  return new ApolloServer({
    context: async ({ req }: { req: Express.Request }) =>
      makeRequestContext(req),
    schema,
    formatError: error => {
      logger.error(error);

      // Don't give the specific errors to the client.
      return new GraphQLError('Internal server error');
    },
  });
};

export const main = async () => {
  await knex.raw('select 1+1 as result');
  await i18n.init();

  const server = await makeGraphQLServer();

  server
    .listen({ port: process.env.PORT || 4000 })
    .then(({ url }: ServerInfo) => {
      logger.info(`Gateway ready at ${url}`);
    });

  return server;
};

main();
