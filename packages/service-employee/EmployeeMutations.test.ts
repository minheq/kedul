import path from 'path';

import { extractUserId } from '@kedul/common-server';
import { makeContext, makeKnex } from '@kedul/common-test-utils';
import { normalizePhoneNumber } from '@kedul/common-utils';
import * as BusinessService from '@kedul/service-business';
import * as LocationService from '@kedul/service-location';
import * as PhoneService from '@kedul/service-phone';
import * as UserService from '@kedul/service-user';
import * as PermissionService from '@kedul/service-permission';
import uuid from 'uuid';
import faker from 'faker';

import { userErrors } from './EmployeeConstants';
import {
  acceptEmployeeInvitation,
  cancelEmployeeInvitation,
  createEmployee,
  CreateEmployeeInput,
  deleteEmployee,
  inviteEmployee,
  unlinkEmployee,
  updateEmployee,
  updateEmployeeRole,
} from './EmployeeMutations';
import { Employee } from './EmployeeTypes';
import { enhance } from './RequestContext';
import { createEmployeeRoles } from './EmployeeRoleMutations';
import { EmployeeRole } from './EmployeeRoleTypes';

jest.mock('@kedul/service-permission');

const knex = makeKnex();

const makeCreateInput = (
  input?: Partial<CreateEmployeeInput>,
): CreateEmployeeInput => ({
  locationId: faker.random.uuid(),
  notes: faker.random.word(),

  profile: {
    fullName: faker.random.word(),
    profileImageId: faker.random.word(),
  },

  shiftSettings: {
    appointmentColor: faker.random.word(),
    canHaveAppointments: faker.random.boolean(),
  },
  salarySettings: {
    productCommission: faker.random.number({ precision: 2 }),
    serviceCommission: faker.random.number({ precision: 2 }),
    voucherCommission: faker.random.number({ precision: 2 }),
  },
  employment: {
    employmentEndDate: new Date(),
    employmentStartDate: new Date(),
    title: faker.random.word(),
  },
  serviceIds: [faker.random.uuid()],
  ...input,
});

jest.spyOn(BusinessService, 'findBusinessById').mockImplementation(async id => {
  return {
    id: faker.random.uuid(),
    name: faker.company.companyName(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: faker.random.uuid(),
  };
});

const mockLocation: LocationService.Location = {
  id: faker.random.uuid(),
  businessHours: [],
  name: faker.company.companyName(),
  createdAt: new Date(),
  updatedAt: new Date(),
  businessId: faker.random.uuid(),
};

jest
  .spyOn(LocationService, 'findLocationById')
  .mockImplementation(async id => mockLocation);

jest.spyOn(UserService, 'findUserById').mockResolvedValue({
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

const sendEmployeeInvitationMock = jest.spyOn(
  PhoneService,
  'sendEmployeeInvitation',
);

const mockUser = {
  createdAt: new Date(),
  id: '1',
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
};

jest.spyOn(UserService, 'findUserByPhoneNumber').mockResolvedValue(mockUser);

let employeeRoles: {
  ownerRole: EmployeeRole;
  adminRole: EmployeeRole;
  managerRole: EmployeeRole;
  receptionistRole: EmployeeRole;
  staffRole: EmployeeRole;
};

beforeAll(async () => {
  await knex.migrate.latest({
    directory: path.resolve(__dirname, './migrations'),
  });

  employeeRoles = await createEmployeeRoles(mockLocation, makeContext());
});

afterAll(async () => {
  await knex.destroy();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('employee management', () => {
  let employee: Employee;
  const context = makeContext();

  test('should create employee', async () => {
    const input = makeCreateInput();

    const result = await createEmployee(input, context);

    expect(result.employee!).toMatchObject(input);

    employee = result.employee!;
  });

  test('should update employee', async () => {
    const input = {
      id: employee!.id,
      ...makeCreateInput(),
    };

    const result = await updateEmployee(input, context);
    expect(result.employee).toMatchObject(input);
  });

  test('should delete employee', async () => {
    const result = await deleteEmployee({ id: employee!.id }, context);

    expect(result.isSuccessful).toBeTruthy();
  });
});

describe('employee with real user management', () => {
  let employee: Employee;
  let invitationToken = '';
  const ownerContext = makeContext();
  const phoneNumber = normalizePhoneNumber('909111230');
  const differentPhoneNumber = normalizePhoneNumber('909111231');

  test('should create a employee', async () => {
    const result = await createEmployee(makeCreateInput(), ownerContext);
    employee = result.employee!;
  });

  test('should send an invite', async () => {
    const result = await inviteEmployee(
      {
        phoneNumber,
        countryCode: 'VN',
        employeeRoleId: employeeRoles.staffRole.id,
        employeeId: employee.id,
      },
      ownerContext,
    );

    expect(result.isSuccessful).toBeTruthy();
    expect(sendEmployeeInvitationMock).toHaveBeenCalled();
    expect(result.employee!.invitation!.token).toBe(
      sendEmployeeInvitationMock.mock.calls[0][1].token,
    );

    invitationToken = result.employee!.invitation!.token;
  });

  test('when resending invitation with the same phone number should update expiration date and generate new token', async () => {
    const result = await inviteEmployee(
      {
        phoneNumber,
        countryCode: 'VN',
        employeeRoleId: employeeRoles.staffRole.id,
        employeeId: employee.id,
      },
      ownerContext,
    );

    expect(result.isSuccessful).toBeTruthy();
    expect(sendEmployeeInvitationMock).toHaveBeenCalled();
    expect(result.employee!.invitation!.token).not.toBe(invitationToken);

    invitationToken = result.employee!.invitation!.token;
  });

  test('when resending invitation with different phone number should update invitation', async () => {
    const result = await inviteEmployee(
      {
        phoneNumber: differentPhoneNumber,
        countryCode: 'VN',
        employeeRoleId: employeeRoles.staffRole.id,
        employeeId: employee.id,
      },
      ownerContext,
    );

    expect(result.isSuccessful).toBeTruthy();
    expect(sendEmployeeInvitationMock).toHaveBeenCalled();
    expect(result.employee!.invitation!.token).not.toBe(invitationToken);
    expect(result.employee!.invitation!.phoneNumber).not.toBe(phoneNumber);
    expect(result.employee!.invitation!.phoneNumber).toBe(differentPhoneNumber);

    invitationToken = result.employee!.invitation!.token;
  });

  test('should be able to accept the invitation', async () => {
    jest.spyOn(UserService, 'findUserById').mockResolvedValue({
      createdAt: new Date(),
      id: faker.random.uuid(),
      isActive: true,

      account: {
        phoneNumber: differentPhoneNumber,
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

    const invitedUserContext = makeContext({
      business: null,
    });

    const result = await acceptEmployeeInvitation(
      { invitationToken },
      invitedUserContext,
    );

    expect(result.isSuccessful).toBeTruthy();
    expect(result.employee!.userId).toBe(extractUserId(invitedUserContext));
    expect(result.employee!.invitation).toBeFalsy();
  });

  test('owner should be able to update role', async () => {
    const result = await updateEmployeeRole(
      { id: employee.id, employeeRoleId: employeeRoles.managerRole.id },
      ownerContext,
    );

    expect(result.isSuccessful).toBeTruthy();
    expect(result.employee!.employeeRoleId).toBe(employeeRoles.managerRole.id);
  });

  test('owner should be able to unlink user from employee profile', async () => {
    const result = await unlinkEmployee(
      { employeeId: employee.id },
      ownerContext,
    );

    expect(result.isSuccessful).toBeTruthy();
    expect(result.employee!.userId).toBeFalsy();
  });
});

describe('employee invalid invitations', () => {
  let employee: Employee;
  const ownerContext = makeContext();

  test('should create a employee', async () => {
    const employeeServiceRequestContext = enhance(ownerContext);
    const employeeRepository =
      employeeServiceRequestContext.repositories.employeeRepository;
    const result = await createEmployee(makeCreateInput(), ownerContext);

    employee = result.employee!;

    await employeeRepository.update({
      ...employee,
      userId: mockUser.id,
    });
  });

  test('when sending invitation to a user who already joined as employee, it should return error', async () => {
    const result = await inviteEmployee(
      {
        phoneNumber: normalizePhoneNumber('909111233'),
        countryCode: 'VN',
        employeeRoleId: employeeRoles.staffRole.id,
        employeeId: employee.id,
      },
      ownerContext,
    );

    expect(result.isSuccessful).toBeFalsy();
  });
});

describe('employee user invitation cancellation', () => {
  let employee: Employee;
  let invitationToken = '';
  const ownerContext = makeContext();

  test('should create a employee', async () => {
    const result = await createEmployee(makeCreateInput(), ownerContext);
    employee = result.employee!;
  });

  test('should send an invite', async () => {
    const result = await inviteEmployee(
      {
        phoneNumber: normalizePhoneNumber('909111235'),
        countryCode: 'VN',
        employeeRoleId: employeeRoles.staffRole.id,
        employeeId: employee.id,
      },
      ownerContext,
    );

    expect(result.isSuccessful).toBeTruthy();
    expect(sendEmployeeInvitationMock).toHaveBeenCalled();

    invitationToken = sendEmployeeInvitationMock.mock.calls[0][1].token;
  });

  test('should cancel invitation', async () => {
    const result = await cancelEmployeeInvitation(
      { employeeId: employee.id },
      ownerContext,
    );

    expect(result.isSuccessful).toBeTruthy();
  });

  test('a user trying to accept canceled invitation should not encounter not found error', async () => {
    const invitedUserContext = makeContext();

    const result = await acceptEmployeeInvitation(
      { invitationToken },
      invitedUserContext,
    );

    expect(result.isSuccessful).toBeFalsy();
    expect(result.userError!.code).toBe(
      userErrors.employeeInvitationNotFound().code,
    );
  });
});
