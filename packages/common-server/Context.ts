import { I18n } from '@kedul/common-config';
import { Logger } from '@kedul/common-utils';
import Knex from 'knex';
import { difference } from 'lodash';

export enum ActorType {
  USER = 'USER',
  API_KEY = 'API_KEY',
  SERVICE = 'SERVICE',
}

export enum SourceContext {
  DEVELOPMENT_SITE = 'DEVELOPMENT_SITE',
  DEVELOPER_API = 'DEVELOPER_API',
  BUSINESS_SITE = 'BUSINESS_SITE',
  BOOKING_SITE = 'BOOKING_SITE',
  THIRD_PARTY_APP = 'THIRD_PARTY_APP',
  INTERNAL_SERVICE = 'INTERNAL_SERVICE',
}

export interface BusinessContext {
  id: string;
}

export interface UserContext {
  userId: string;
  type: ActorType.USER;
}

export interface ApiKeyContext {
  apiKeyId: string;
  key: string;
  type: ActorType.API_KEY;
}

export interface ServiceContext {
  serviceName: string;
  type: ActorType.SERVICE;
}

/**
 * We want to put dependencies within context because the need of universal exports
 * as well as context-based dependencies
 */
export interface ContextDependencies {
  knex: Knex;
  i18n: I18n;
  logger: Logger;
}

export type RequestContextActor = UserContext | ApiKeyContext | ServiceContext;

export interface RequestContext {
  locale: string;
  traceId: string;
  actor: RequestContextActor | null;
  business: BusinessContext | null;
  source: SourceContext;
  dependencies: ContextDependencies;
}

/**
 * Enhances the context with Repositories and DataLoaders if they do not yet exist.
 * This is to ensure that they are instantiated only once per request, to enable caching
 * @param context Given RequestContext
 * @param repositories Repositories to be added to the context, if they don't yet exist
 * @param loaders DataLoaders to be added to the context, if they don't yet exist
 */
export const enhanceContext = <
  TEnhancedContext extends RequestContext = any,
  TRepositories = object,
  TLoaders = object
>(
  context: RequestContext | TEnhancedContext,
  repositories: TRepositories,
  loaders: TLoaders,
): TEnhancedContext & {
  repositories: TRepositories;
  loaders: TLoaders;
} => {
  // @ts-ignore
  const contextRepositories = context.repositories;
  const repositoryNames = Object.keys(repositories);
  const contextRepositoryNames = contextRepositories
    ? Object.keys(contextRepositories)
    : [];

  const isEnhanced =
    difference(repositoryNames, contextRepositoryNames).length === 0;

  if (!isEnhanced) {
    // @ts-ignore
    context.repositories = {
      ...contextRepositories,
      ...repositories,
    };

    // @ts-ignore
    context.loaders = {
      // @ts-ignore
      ...context.loaders,
      ...loaders,
    };
  }

  // @ts-ignore
  return context;
};

export const extractBusinessId = (context: RequestContext): string => {
  if (!context.business) throw new Error('Business context required');

  return context.business.id;
};

export const extractUserId = (context: RequestContext): string => {
  if (!context.actor) throw new Error('User context required');

  if (context.actor.type !== ActorType.USER) {
    throw new Error('User context required');
  }

  return context.actor.userId;
};

export const isRequestFromClient = (context: RequestContext): boolean => {
  return context.source === SourceContext.BOOKING_SITE;
};
