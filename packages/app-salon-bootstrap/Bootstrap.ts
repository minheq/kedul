import { i18n } from '@kedul/common-config';
import { ActorType, RequestContext, SourceContext } from '@kedul/common-server';
import { makeLogger, randomDigits } from '@kedul/common-utils';
import { createBusiness } from '@kedul/service-business';
import { createLocation } from '@kedul/service-location';
import {
  createAccessToken,
  createNewPhoneUser,
  User,
} from '@kedul/service-user';
import Knex from 'knex';
import uuidv4 from 'uuid/v4';

import { env } from './env';

const knex = Knex({
  client: env.database.config.client,
  connection: `${env.database.config.connection}/${env.database.config.name}`,
});

const logger = makeLogger();

const dependencies = {
  knex,
  logger,
  i18n,
};

const createUser = async (context: RequestContext) => {
  let user: User | null = null;

  while (!user) {
    try {
      user = await createNewPhoneUser(
        { phoneNumber: `9999${randomDigits(5)}`, countryCode: 'VN' },
        context,
      );
    } catch (error) {}
  }

  return user;
};

export const bootstrap = async () => {
  let context: RequestContext = {
    locale: 'vi-vn',
    actor: null,
    business: null,
    traceId: uuidv4(),
    source: SourceContext.BUSINESS_SITE,
    dependencies,
  };

  const user = await createUser(context);
  const accessToken = createAccessToken(user);

  context = {
    ...context,
    actor: { type: ActorType.USER, userId: user.id },
  };

  const businessPayload = await createBusiness({ name: uuidv4() }, context);

  if (!businessPayload.business) throw new Error('Error creating business');

  context = {
    ...context,
    business: { id: businessPayload.business.id },
  };

  const locationPayload = await createLocation(
    {
      name: uuidv4(),
    },
    context,
  );

  if (!locationPayload.location) {
    throw new Error('Error creating location');
  }

  await knex.destroy();

  return {
    user,
    business: businessPayload.business,
    location: locationPayload.location,
    accessToken,
  };
};
