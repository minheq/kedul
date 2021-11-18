import {
  extractBusinessId,
  extractUserId,
  publish,
  RequestContext,
} from '@kedul/common-server';
import {
  changeset,
  ContactDetails,
  normalizeInputWithPhoneNumber,
  randomString,
  UserError,
  makeUserError,
  validateInputWithPhoneNumber,
} from '@kedul/common-utils';
import { findBusinessById } from '@kedul/service-business';
import { findLocationById } from '@kedul/service-location';
import {
  authorizeMember,
  PolicyAction,
  PolicyEntity,
  PolicyResource,
} from '@kedul/service-permission';
import { sendEmployeeInvitation } from '@kedul/service-phone';
import {
  findUserById,
  findUserByPhoneNumber,
  UserProfile,
} from '@kedul/service-user';
import { addDays, isAfter } from 'date-fns';
import uuidv4 from 'uuid/v4';

import { Event, userErrors, UserErrorCode } from './EmployeeConstants';
import {
  Employee,
  EmployeeEmployment,
  EmployeeInvitation,
  EmployeeSalarySettings,
  EmployeeShiftSettings,
} from './EmployeeTypes';
import { enhance } from './RequestContext';
import { PredefinedEmployeeRoleName } from './EmployeeRoleMutations';

const makeSuccessPayload = async (employee: Employee) => ({
  isSuccessful: true,
  employee,
  userError: null,
});

const makeErrorPayload = async (userError: UserError) => ({
  isSuccessful: false,
  employee: null,
  userError,
});

const publishEvent = (
  event: string,
  employee: Employee,
  context: RequestContext,
) =>
  publish(event, {
    aggregateId: employee.id,
    aggregateType: 'EMPLOYEE',
    data: employee,
    context,
  });

const getResource = (employee: Employee): PolicyResource => ({
  entity: PolicyEntity.EMPLOYEE,
  entityId: employee.id,
  locationId: employee.locationId,
});

export const make = async (
  input: CreateEmployeeInput,
  context: RequestContext,
): Promise<Employee> => {
  const employeeId = uuidv4();
  const businessId = extractBusinessId(context);

  return {
    ...input,
    businessId,
    locationId: input.locationId,
    createdAt: new Date(),
    deletedAt: null,
    id: employeeId,
    notes: input.notes || null,
    updatedAt: new Date(),

    profile: {
      ...input.profile,
      profileImageId: input.profile.profileImageId || null,
    },

    serviceIds: input.serviceIds || [],
  };
};

export interface CreateEmployeeInput {
  notes?: string | null;
  locationId: string;
  contactDetails?: ContactDetails | null;
  profile: UserProfile;
  serviceIds?: string[] | null;
  salarySettings?: EmployeeSalarySettings | null;
  shiftSettings?: EmployeeShiftSettings | null;
  employment?: EmployeeEmployment | null;
}

export const createEmployee = async (
  input: CreateEmployeeInput,
  context: RequestContext,
) => {
  const { employeeRepository } = enhance(context).repositories;

  const employee = await make(input, context);

  // TODO: check if authorized to create employee with owner role
  const action = PolicyAction.CREATE_EMPLOYEE;
  await authorizeMember(action, getResource(employee), context);

  await employeeRepository.save(employee);

  publishEvent(Event.EMPLOYEE_CREATED, employee, context);

  return makeSuccessPayload(employee);
};

export interface UpdateEmployeeInput {
  id: string;
  notes?: string | null;
  contactDetails?: ContactDetails | null;
  profile?: UserProfile | null;
  serviceIds?: string[] | null;
  salarySettings?: EmployeeSalarySettings | null;
  shiftSettings?: EmployeeShiftSettings | null;
  employment?: EmployeeEmployment | null;
}

export const updateEmployee = async (
  input: UpdateEmployeeInput,
  context: RequestContext,
) => {
  const { employeeRepository } = enhance(context).repositories;

  const prevEmployee = await employeeRepository.getById(input.id);
  const employee = await changeset(prevEmployee, input);

  const action = PolicyAction.UPDATE_EMPLOYEE;
  await authorizeMember(action, getResource(employee), context);

  await employeeRepository.update(employee);

  publishEvent(Event.EMPLOYEE_UPDATED, employee, context);

  return makeSuccessPayload(employee);
};

export interface UpdateEmployeeRoleInput {
  id: string;
  employeeRoleId: string;
}

export const updateEmployeeRole = async (
  input: UpdateEmployeeRoleInput,
  context: RequestContext,
) => {
  const { employeeRepository, employeeRoleRepository } = enhance(
    context,
  ).repositories;

  const employeeRole = await employeeRoleRepository.findById(
    input.employeeRoleId,
  );
  if (!employeeRole) throw new Error('Role not found');

  if (employeeRole.name === PredefinedEmployeeRoleName.OWNER) {
    return makeErrorPayload(
      makeUserError(UserErrorCode.CANNOT_ASSIGN_OWNER_ROLE),
    );
  }

  const prevEmployee = await employeeRepository.getById(input.id);
  const employee = await changeset(prevEmployee, input);

  const action = PolicyAction.UPDATE_EMPLOYEE_ROLE;
  await authorizeMember(action, getResource(employee), context);

  await employeeRepository.update(employee);

  publishEvent(Event.EMPLOYEE_UPDATED, employee, context);

  return makeSuccessPayload(employee);
};

export interface DeleteEmployeeInput {
  id: string;
}

export const deleteEmployee = async (
  input: DeleteEmployeeInput,
  context: RequestContext,
) => {
  const { employeeRepository } = enhance(context).repositories;

  const employee = await employeeRepository.getById(input.id);

  const action = PolicyAction.DELETE_EMPLOYEE;
  await authorizeMember(action, getResource(employee), context);

  await employeeRepository.remove(employee);

  publishEvent(Event.EMPLOYEE_DELETED, employee, context);

  return makeSuccessPayload(employee);
};

interface EmployeeWithInvitation extends Employee {
  invitation: EmployeeInvitation;
}

const invitationChangeset = (
  employee: Employee,
  input: InviteEmployeeInput,
  context: RequestContext,
): EmployeeWithInvitation => {
  const businessId = extractBusinessId(context);

  return {
    ...employee,
    employeeRoleId: input.employeeRoleId,
    invitation: {
      id: uuidv4(),
      businessId,
      employeeId: employee.id,
      phoneNumber: input.phoneNumber,
      invitedByUserId: extractUserId(context),
      countryCode: input.countryCode,
      expirationDate: addDays(new Date(), 7),
      token: randomString(45),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
};

const getEmployeeInvitationSmsData = async (
  employee: EmployeeWithInvitation,
  context: RequestContext,
) => {
  const businessId = extractBusinessId(context);
  const business = await findBusinessById({ id: businessId }, context);

  if (!business) {
    throw new Error(`Expected business id=${businessId}`);
  }

  const location = await findLocationById({ id: employee.locationId }, context);

  if (!location) {
    throw new Error(`Expected location id=${employee.locationId}`);
  }

  return {
    locationName: location.name,
    businessName: business.name,
    token: employee.invitation.token,
  };
};

export interface InviteEmployeeInput {
  phoneNumber: string;
  countryCode: string;
  employeeRoleId: string;
  employeeId: string;
}

export const inviteEmployee = async (
  input: InviteEmployeeInput,
  context: RequestContext,
) => {
  const enhancedContext = enhance(context);
  const {
    employeeRepository,
    employeeRoleRepository,
  } = enhancedContext.repositories;

  const normalizedInput = normalizeInputWithPhoneNumber(input);

  const employeeRole = await employeeRoleRepository.findById(
    input.employeeRoleId,
  );
  if (!employeeRole) throw new Error('Role not found');

  const prevEmployee = await employeeRepository.getById(
    normalizedInput.employeeId,
  );

  const error = await validateInputWithPhoneNumber(input);
  if (error) return makeErrorPayload(error);

  const user = await findUserByPhoneNumber(
    { phoneNumber: input.phoneNumber, countryCode: input.countryCode },
    context,
  );

  if (user) {
    const employeeFound = !!(await employeeRepository.findByUserIdAndLocationId(
      user.id,
      prevEmployee.locationId,
    ));

    if (employeeFound) {
      return makeErrorPayload(userErrors.employeeAlreadyJoined());
    }
  }

  const employee = invitationChangeset(prevEmployee, normalizedInput, context);

  const smsData = await getEmployeeInvitationSmsData(employee, context);

  // const action = PolicyAction.INVITE_BUSINESS_MEMBER_VIA_PHONE;
  // await authorizeMember(action, getResource(employee), context);

  await sendEmployeeInvitation(
    employee.invitation.phoneNumber,
    smsData,
    context,
  );

  await employeeRepository.update(employee);

  publishEvent(Event.EMPLOYEE_INVITED, employee, context);

  return makeSuccessPayload(employee);
};

interface EmployeeWithUserId extends Employee {
  userId: string;
}

const acceptInvitationChangeset = (
  employee: EmployeeWithInvitation,
  context: RequestContext,
): EmployeeWithUserId => {
  const userId = extractUserId(context);

  return {
    ...employee,
    acceptedInvitationAt: new Date(),
    invitation: null,
    userId,
  };
};

export interface AcceptEmployeeInvitationInput {
  invitationToken: string;
}

export const acceptEmployeeInvitation = async (
  input: AcceptEmployeeInvitationInput,
  context: RequestContext,
) => {
  const enhancedContext = enhance(context);
  const { employeeRepository } = enhancedContext.repositories;

  const prevEmployee = (await employeeRepository.findByToken(
    input.invitationToken,
  )) as EmployeeWithInvitation | null;

  if (!prevEmployee) {
    return makeErrorPayload(userErrors.employeeInvitationNotFound());
  }

  if (isAfter(new Date(), prevEmployee.invitation.expirationDate)) {
    return makeErrorPayload(userErrors.employeeInvitationExpired());
  }

  if (input.invitationToken !== prevEmployee.invitation.token) {
    return makeErrorPayload(userErrors.employeeInvitationInvalid());
  }

  const userId = extractUserId(context);

  // REVIEW: Decide whether checking context user phone number matches the invited or not
  const user = await findUserById({ id: userId }, context);

  if (!user) {
    throw new Error(`Expected user id=${userId}`);
  }

  if (prevEmployee.invitation.phoneNumber !== user.account.phoneNumber) {
    return makeErrorPayload(userErrors.employeeInvitationInvalid());
  }

  const employee = acceptInvitationChangeset(prevEmployee, context);
  await employeeRepository.update(employee);

  publishEvent(Event.EMPLOYEE_INVITATION_ACCEPTED, employee, context);

  return makeSuccessPayload(employee);
};

export interface DeclineEmployeeInvitationInput {
  employeeId: string;
}

export const declineEmployeeInvitation = async (
  input: DeclineEmployeeInvitationInput,
  context: RequestContext,
) => {
  const { employeeRepository } = enhance(context).repositories;

  const prevEmployee = await employeeRepository.getById(input.employeeId);

  const employee = cancelInvitationChangeset(prevEmployee);

  await employeeRepository.update(employee);

  publishEvent(Event.EMPLOYEE_INVITATION_DECLINED, employee, context);

  return makeSuccessPayload(employee);
};

const cancelInvitationChangeset = (employee: Employee): Employee => ({
  ...employee,
  invitation: null,
  userId: null,
});

export interface CancelEmployeeInvitationInput {
  employeeId: string;
}

export const cancelEmployeeInvitation = async (
  input: CancelEmployeeInvitationInput,
  context: RequestContext,
) => {
  const { employeeRepository } = enhance(context).repositories;

  const prevEmployee = await employeeRepository.getById(input.employeeId);

  const employee = cancelInvitationChangeset(prevEmployee);

  await employeeRepository.update(employee);

  publishEvent(Event.EMPLOYEE_INVITATION_CANCELED, employee, context);

  return makeSuccessPayload(employee);
};

const unlinkEmployeeChangeset = cancelInvitationChangeset;

export interface UnlinkEmployeeInput {
  employeeId: string;
}

export const unlinkEmployee = async (
  input: UnlinkEmployeeInput,
  context: RequestContext,
) => {
  const { employeeRepository } = enhance(context).repositories;

  const prevEmployee = await employeeRepository.getById(input.employeeId);

  if (!prevEmployee.userId) {
    throw new Error('Expected employee with user id');
  }

  const user = await findUserById({ id: prevEmployee.userId }, context);
  if (!user) {
    throw new Error(`Expected user id=${prevEmployee.userId}`);
  }

  const employee = unlinkEmployeeChangeset(prevEmployee);

  await employeeRepository.update(employee);

  publishEvent(Event.EMPLOYEE_UNLINKED, employee, context);

  return makeSuccessPayload(employee);
};
