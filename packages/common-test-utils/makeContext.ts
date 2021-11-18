import { ActorType, RequestContext, SourceContext } from '@kedul/common-server';
import { makeLogger } from '@kedul/common-utils';
import faker from 'faker';
import { DeepPartial } from 'ts-essentials';

import { makeKnex } from './makeKnex';

const locale = 'en-US';

export const makeContext = (
  partialRequestContext: DeepPartial<RequestContext> = {},
): RequestContext => {
  const dependencies = {
    i18n: {
      t: (text: string) => text,
    },
    // TODO: Pass knex into context instead so that knex instance is the same in tests migrations and this context
    knex: makeKnex(),
    logger: makeLogger({ level: 'silent' }),
  };

  const traceId = faker.random.uuid();

  return {
    // @ts-ignore
    actor: {
      type: ActorType.USER,
      userId: faker.random.uuid(),
      ...partialRequestContext.actor,
    },
    business: {
      id: faker.random.uuid(),
      ...partialRequestContext.business,
    },
    dependencies,
    locale,
    source: SourceContext.BUSINESS_SITE,
    traceId,
  };
};
