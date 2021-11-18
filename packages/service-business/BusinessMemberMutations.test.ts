import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import { normalizePhoneNumber } from '@kedul/common-utils';
import * as Mail from '@kedul/service-mail';
import * as Phone from '@kedul/service-phone';
import * as UserService from '@kedul/service-user';
import * as PermissionService from '@kedul/service-permission';
import faker from 'faker';
import uuid from 'uuid';

import {
  acceptInvitationToBusiness,
  cancelBusinessMemberInvitation,
  changeBusinessMemberRole,
  inviteToBusiness,
  removeBusinessMember,
} from './BusinessMemberMutations';
import { findBusinessMemberById } from './BusinessMemberQueries';
import { createBusiness } from './BusinessMutations';
import { PredefinedBusinessMemberRoleName } from './BusinessMemberRoleMutations';

jest.mock('@kedul/service-mail');
jest.mock('@kedul/service-phone');
jest.mock('@kedul/service-permission');
jest.mock('@kedul/service-user');

const makeMockUser = () => ({
  createdAt: new Date(),
  id: faker.random.uuid(),
  isActive: true,

  account: {
    phoneNumber: faker.phone.phoneNumber(),
    countryCode: 'VN',
    email: faker.internet.email(),
    isEmailVerified: false,
    isPhoneVerified: false,
    logins: [],
    socialIdentities: [],
    userId: faker.random.uuid(),
  },
  profile: {
    fullName: faker.name.firstName(),
  },
  updatedAt: new Date(),
});

jest
  .spyOn(UserService, 'createNewEmailUser')
  .mockImplementation(async input => {
    const user = makeMockUser();

    return {
      ...user,
      account: {
        ...user.account,
        ...input,
      },
    };
  });

jest
  .spyOn(UserService, 'createNewPhoneUser')
  .mockImplementation(async input => {
    const user = makeMockUser();

    return {
      ...user,
      account: {
        ...user.account,
        ...input,
      },
    };
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

const businessName = faker.random.word();
const sendEmailInviteMock = jest.spyOn(Mail, 'sendBusinessMemberInvitation');
const sendPhoneInviteMock = jest.spyOn(Phone, 'sendBusinessMemberInvitation');

const knex = makeKnex();
const ownerContext = makeContext();
// @ts-ignore
const businessId = ownerContext.business.id;

beforeAll(async () => {
  await knex.migrate.latest({
    directory: path.resolve(__dirname, './migrations'),
  });

  await createBusiness(
    {
      id: businessId,
      name: businessName,
    },
    ownerContext,
  );
});

afterAll(async () => {
  await knex.destroy();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('invite via phone flow', () => {
  let invitationToken: string;

  test('should send invitation phone', async () => {
    const input = {
      businessId,
      businessMemberRoleId: faker.random.uuid(),
      countryCode: 'VN',
      phoneNumber: normalizePhoneNumber('909111242'),
    };

    const result = await inviteToBusiness(input, ownerContext);

    expect(result.businessMember!).toBeTruthy();
    expect(sendPhoneInviteMock).toBeCalled();

    const phoneNumber = sendPhoneInviteMock.mock.calls[0][0];
    expect(phoneNumber).toBe(input.phoneNumber);

    const data = sendPhoneInviteMock.mock.calls[0][1];
    expect(data.businessName).toBe(businessName);

    invitationToken = data.token;
  });

  test('should join business when accepted invitation', async () => {
    const invitedMemberContext = await makeContext({
      business: { id: businessId },
    });

    const input = {
      invitationToken,
      // @ts-ignore
      userId: invitedMemberContext.actor!.userId,
    };

    const { businessMember } = await acceptInvitationToBusiness(
      input,
      invitedMemberContext,
    );

    expect(businessMember).toBeTruthy();
    expect(businessMember!.businessId).toBe(businessId);
    expect(businessMember!.acceptedAt).toBeTruthy();
  });
});

describe('invite resend phone flow', () => {
  let invitationToken: string;
  const phoneNumber = normalizePhoneNumber('909111230');

  test('should send invitation phone first', async () => {
    const input = {
      businessId,
      businessMemberRoleId: faker.random.uuid(),
      countryCode: 'VN',
      phoneNumber,
    };

    await inviteToBusiness(input, ownerContext);
    expect(sendPhoneInviteMock).toBeCalled();
  });

  test('should resend with new token', async () => {
    const input = {
      businessId,
      businessMemberRoleId: faker.random.uuid(),
      countryCode: 'VN',
      phoneNumber,
    };

    await inviteToBusiness(input, ownerContext);
    expect(sendPhoneInviteMock).toBeCalled();

    const data = sendPhoneInviteMock.mock.calls[0][1];
    expect(invitationToken).not.toBe(data.token);
    invitationToken = data.token;
  });
});

describe('cancel invitation', () => {
  test('happy path', async () => {
    const input = {
      businessId,
      businessMemberRoleId: faker.random.uuid(),
      countryCode: 'VN',
      phoneNumber: normalizePhoneNumber('909111238'),
    };

    const { businessMember } = await inviteToBusiness(input, ownerContext);
    expect(sendPhoneInviteMock).toBeCalled();

    await cancelBusinessMemberInvitation(
      { id: businessMember!.id },
      ownerContext,
    );
    const existingBusinessMember = await findBusinessMemberById(
      { id: businessMember!.id },
      ownerContext,
    );

    expect(existingBusinessMember).toBeFalsy();
  });
});

describe('change business member role', () => {
  test('happy path', async () => {
    const input = {
      businessId,
      businessMemberRoleId: faker.random.uuid(),
      countryCode: 'VN',
      phoneNumber: normalizePhoneNumber('909111240'),
    };

    const { businessMember: previousBusinessMember } = await inviteToBusiness(
      input,
      ownerContext,
    );

    const { businessMember } = await changeBusinessMemberRole(
      {
        id: previousBusinessMember!.id,
        role: PredefinedBusinessMemberRoleName.ADMIN,
      },
      ownerContext,
    );

    expect(businessMember!.businessMemberRoleId).not.toBe(
      previousBusinessMember!.businessMemberRoleId,
    );
  });
});

describe('remove business member', () => {
  test('should work', async () => {
    const input = {
      businessId,
      businessMemberRoleId: faker.random.uuid(),
      countryCode: 'VN',
      phoneNumber: normalizePhoneNumber('909111239'),
    };

    const { businessMember: previousBusinessMember } = await inviteToBusiness(
      input,
      ownerContext,
    );

    const { businessMember } = await removeBusinessMember(
      {
        id: previousBusinessMember!.id,
      },
      ownerContext,
    );

    const existingBusinessMember = await findBusinessMemberById(
      { id: businessMember!.id },
      ownerContext,
    );

    expect(existingBusinessMember).toBeFalsy();
  });
});
