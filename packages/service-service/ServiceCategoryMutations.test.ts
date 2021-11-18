import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import faker from 'faker';

import {
  createServiceCategory,
  CreateServiceCategoryInput,
  deleteServiceCategory,
  updateServiceCategory,
  UpdateServiceCategoryInput,
} from './ServiceCategoryMutations';
import { findServiceCategoryById } from './ServiceCategoryQueries';
import { createService, CreateServiceInput } from './ServiceMutations';

jest.mock('@kedul/service-permission');

const knex = makeKnex();

export const makeCreateServiceInput = (
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

  paddingTime: null,
  pricingOptions: [
    {
      duration: faker.random.number(),
      name: faker.random.word(),
      price: faker.random.number({ precision: 2 }),
      type: faker.random.word(),
    },
  ],
  processingTimeDuringService: null,
  ...input,
});

export const makeCreateInput = (
  input?: Partial<CreateServiceCategoryInput>,
): CreateServiceCategoryInput => ({
  name: faker.random.word(),
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

    const result = await createServiceCategory(input, makeContext());

    expect(result.serviceCategory!).toMatchObject(input);
  });
});

describe('update', () => {
  test('should update happy path', async () => {
    const context = makeContext();
    const { serviceCategory } = await createServiceCategory(
      makeCreateInput(),
      context,
    );

    const input: UpdateServiceCategoryInput = {
      id: serviceCategory!.id,
      ...makeCreateInput(),
    };

    const result = await updateServiceCategory(input, context);

    expect(result.serviceCategory!).toMatchObject(input);
  });
});

describe('delete', () => {
  test('should delete happy path and dereference all services from the service category', async () => {
    const context = makeContext();

    const { serviceCategory } = await createServiceCategory(
      makeCreateInput(),
      context,
    );

    await createService(
      makeCreateServiceInput({
        serviceCategoryId: serviceCategory!.id,
      }),
      context,
    );

    await deleteServiceCategory({ id: serviceCategory!.id }, context);

    const result = await findServiceCategoryById(
      { id: serviceCategory!.id },
      context,
    );

    expect(result).toBeFalsy();
  });
});
