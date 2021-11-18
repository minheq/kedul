import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import faker from 'faker';

import {
  createLocation,
  CreateLocationInput,
  deleteLocation,
  updateLocation,
  UpdateLocationInput,
} from './LocationMutations';
import { findLocationById } from './LocationQueries';

const knex = makeKnex();

jest.mock('@kedul/service-permission');

const makeCreateInput = (
  input?: Partial<CreateLocationInput>,
): CreateLocationInput => ({
  name: faker.company.companyName(),

  contactDetails: {
    countryCode: 'VN',
    phoneNumber: '909111222',
    email: faker.internet.email(),
  },

  address: {
    city: faker.address.city(),
    country: faker.address.country(),
    district: faker.address.streetAddress(),
    postalCode: faker.address.zipCode(),
    streetAddressOne: faker.address.streetAddress(),
    streetAddressTwo: faker.address.secondaryAddress(),
  },

  businessHours: [
    {
      endDate: new Date(),
      recurrence: null,
      startDate: new Date(),
    },
  ],
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

    const result = await createLocation(input, makeContext());

    expect(result.location!).toMatchObject(input);
  });
});

describe('update', () => {
  test('should update location all fields except businessHours, and still retains it', async () => {
    const context = makeContext();
    const { location } = await createLocation(makeCreateInput(), context);

    const input: UpdateLocationInput = {
      // @ts-ignore
      id: location!.id,
      ...makeCreateInput(),
    };

    const result = await updateLocation(input, context);

    expect(result.location).toMatchObject(input);
  });

  test('should update location businessHours', async () => {
    const context = makeContext();
    const { location } = await createLocation(makeCreateInput(), context);

    const input: UpdateLocationInput = {
      ...makeCreateInput(),
      businessHours: [
        {
          endDate: new Date(),
          recurrence: null,
          startDate: new Date(),
        },
      ],
      id: location!.id,
    };

    const result = await updateLocation(input, context);
    expect(result.location!.businessHours).toEqual(input.businessHours);
  });
});

describe('delete', () => {
  test('should delete location happy path', async () => {
    const context = makeContext();
    const { location } = await createLocation(makeCreateInput(), context);

    await deleteLocation({ id: location!.id }, context);

    const result = await findLocationById({ id: location!.id }, context);

    expect(result).toBeFalsy();
  });
});
