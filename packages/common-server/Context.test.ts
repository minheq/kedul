import { makeLogger } from '@kedul/common-utils';
import faker from 'faker';
import Knex from 'knex';

import {
  ActorType,
  enhanceContext,
  RequestContext,
  SourceContext,
} from './Context';

const knex = Knex({
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
});

const traceId = faker.random.uuid();

interface EnhancedContext extends RequestContext {
  repositories: { [repository: string]: string };
  loaders: { [loader: string]: string };
}

const makeContext = (): RequestContext | EnhancedContext => ({
  actor: {
    type: ActorType.USER,
    userId: faker.random.uuid(),
  },
  business: {
    id: faker.random.uuid(),
  },
  dependencies: {
    i18n: {
      t: (text: string) => text,
    },
    knex,
    logger: makeLogger({ level: 'silent' }),
  },
  locale: 'en-US',
  source: SourceContext.BUSINESS_SITE,
  traceId,
});

afterAll(async () => {
  knex.destroy();
});

describe('enhanceContext', () => {
  test('should inject repositories and loaders if RequestContext is bare', async () => {
    const repositories = { repoOne: 'new' };
    const loaders = { loaderOne: 'new' };

    const enhancedContext = enhanceContext(
      makeContext(),
      repositories,
      loaders,
    );

    expect(enhancedContext.locale).toBe(enhancedContext.locale);
    expect(enhancedContext.repositories.repoOne).toBe('new');
    expect(enhancedContext.loaders.loaderOne).toBe('new');
  });

  test('should use existing repositories and loaders if they already exist', async () => {
    const repositories = { repoOne: 'new' };
    const loaders = { loaderOne: 'new' };

    const context = {
      ...makeContext(),
      repositories: {
        repoOne: 'existing',
      },
      loaders: {
        loaderOne: 'existing',
      },
    };

    const enhancedContext = enhanceContext(context, repositories, loaders);

    expect(enhancedContext.locale).toBe(enhancedContext.locale);
    expect(enhancedContext.repositories.repoOne).toBe('existing');
    expect(enhancedContext.loaders.loaderOne).toBe('existing');
  });

  test('should inject repositories and loaders if RequestContext contains repositories and loaders other than given', async () => {
    const repositories = { repoOne: 'new' };
    const loaders = { loaderOne: 'new' };

    const context = {
      ...makeContext(),
      repositories: {
        repoTwo: 'existing',
      },
      loaders: {
        loaderTwo: 'existing',
      },
    };

    const enhancedContext = enhanceContext(context, repositories, loaders);

    expect(enhancedContext.locale).toBe(enhancedContext.locale);
    expect(enhancedContext.repositories.repoTwo).toBe('existing');
    expect(enhancedContext.loaders.loaderTwo).toBe('existing');
    expect(enhancedContext.repositories.repoOne).toBe('new');
    expect(enhancedContext.loaders.loaderOne).toBe('new');
  });
});
