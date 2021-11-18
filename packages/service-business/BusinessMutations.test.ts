import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import * as UserService from '@kedul/service-user';
import * as PermissionService from '@kedul/service-permission';
import faker from 'faker';
import uuidv4 from 'uuid/v4';
import uuid from 'uuid';

import { UserErrorCode } from './BusinessConstants';
import {
  createBusiness,
  CreateBusinessInput,
  deleteBusiness,
  updateBusiness,
  UpdateBusinessInput,
} from './BusinessMutations';
import { findBusinessById } from './BusinessQueries';

jest.mock('@kedul/service-permission');
jest.mock('@kedul/service-user');

jest.spyOn(UserService, 'findUserById').mockResolvedValue({
  createdAt: new Date(),
  id: uuidv4(),
  isActive: true,

  account: {
    phoneNumber: faker.phone.phoneNumber(),
    countryCode: 'VN',
    email: faker.internet.email(),
    isEmailVerified: false,
    isPhoneVerified: false,
    logins: [],
    socialIdentities: [],
  },
  profile: {
    fullName: faker.name.firstName(),
  },
  updatedAt: new Date(),
});

jest
  .spyOn(PermissionService, 'createPolicy')
  .mockImplementation(async input => {
    return {
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      statements: [],
      businessId: uuid(),
    };
  });
const context = makeContext();

const makeCreateInput = (
  input?: Partial<CreateBusinessInput>,
): CreateBusinessInput => ({
  countryCode: 'VN',
  email: faker.internet.email(),
  facebookUrl: faker.random.word(),
  logoImageId: uuidv4(),
  name: uuidv4(),
  phoneNumber: '909111228',
  ...input,
});

const knex = makeKnex();

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
  test('happy path', async () => {
    const input = makeCreateInput();

    const result = await createBusiness(input, context);

    expect(result.business!).toMatchObject(input);
  });

  test('should fail duplicated name error', async () => {
    const input = makeCreateInput();
    await createBusiness(input, context);

    const result = await createBusiness(
      {
        ...makeCreateInput(),
        name: input.name,
      },
      context,
    );
    expect(result.userError!.code).toBe(
      UserErrorCode.BUSINESS_NAME_ALREADY_USED,
    );
  });
});

describe('update', () => {
  test('should update happy path', async () => {
    const { business } = await createBusiness(makeCreateInput(), context);

    const input: UpdateBusinessInput = {
      // @ts-ignore
      id: business!.id,
      ...makeCreateInput(),
    };

    const result = await updateBusiness(input, context);

    expect(result.business!).toMatchObject(input);
  });

  test('should fail duplicated name error', async () => {
    const otherBusinessInput = makeCreateInput();
    // Other business
    await createBusiness(otherBusinessInput, context);

    const { business } = await createBusiness(makeCreateInput(), context);

    const result = await updateBusiness(
      {
        ...makeCreateInput(),
        id: business!.id,
        name: otherBusinessInput.name,
      },
      context,
    );

    expect(result.isSuccessful).toBeFalsy();
    expect(result.userError!.code).toBe(
      UserErrorCode.BUSINESS_NAME_ALREADY_USED,
    );
  });
});

describe('delete', () => {
  test('should delete happy path', async () => {
    const { business } = await createBusiness(makeCreateInput(), context);

    await deleteBusiness({ id: business!.id }, context);

    const result = await findBusinessById({ id: business!.id }, context);

    expect(result).toBeFalsy();
  });
});
