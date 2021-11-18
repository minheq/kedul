import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import faker from 'faker';

import {
  createServiceCategory,
  CreateServiceCategoryInput,
} from './ServiceCategoryMutations';
import {
  createService,
  CreateServiceInput,
  deleteService,
  updateService,
  UpdateServiceInput,
} from './ServiceMutations';
import { findServiceById } from './ServiceQueries';
import { ServicePaddingTimeType } from './ServiceTypes';

jest.mock('@kedul/service-permission');

const knex = makeKnex();

export const makeCreateServiceCategoryInput = (
  input?: Partial<CreateServiceCategoryInput>,
): CreateServiceCategoryInput => ({
  name: faker.random.word(),
  ...input,
});

export const makeCreateInput = (
  input?: Partial<CreateServiceInput>,
): CreateServiceInput => ({
  locationId: faker.random.uuid(),
  description: faker.random.word(),
  imageIds: [faker.random.uuid(), faker.random.uuid()],
  intervalTime: faker.random.number(),
  name: faker.name.firstName(),
  noteToClient: faker.random.words(),
  parallelClientsCount: faker.random.number(),
  primaryImageId: faker.random.uuid(),
  processingTimeAfterServiceEnd: faker.random.number(),
  questionsForClient: [faker.random.words(), faker.random.words()],
  serviceCategoryId: null,

  paddingTime: {
    duration: faker.random.number(),
    type: ServicePaddingTimeType.AFTER,
  },
  pricingOptions: [
    {
      duration: faker.random.number(),
      name: faker.random.word(),
      price: faker.random.number({ precision: 2 }),
      type: faker.random.word(),
    },
  ],
  processingTimeDuringService: {
    after: faker.random.number(),
    duration: faker.random.number(),
  },
  ...input,
});

beforeAll(async () => {
  await knex.migrate.latest({
    directory: path.resolve(__dirname, './migrations'),
  });
});

afterAll(async () => {
  await knex.destroy();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('create', () => {
  test('should create happy path', async () => {
    const input = makeCreateInput();

    const result = await createService(input, makeContext());

    expect(result.service).toMatchObject(input);
  });
});

describe('update', () => {
  test('should updates happy path', async () => {
    const context = makeContext();
    const { serviceCategory } = await createServiceCategory(
      makeCreateServiceCategoryInput(),
      context,
    );

    const { service } = await createService(makeCreateInput(), context);

    const input: UpdateServiceInput = {
      ...makeCreateInput(),
      id: service!.id,
      serviceCategoryId: serviceCategory!.id,
    };

    const result = await updateService(input, context);

    expect(result.service!).toMatchObject(input);
  });
});

describe('delete', () => {
  test('should delete service happy path', async () => {
    const context = makeContext();
    const { service } = await createService(makeCreateInput(), context);

    await deleteService({ id: service!.id }, context);

    const result = await findServiceById({ id: service!.id }, context);

    expect(result).toBeFalsy();
  });
});
