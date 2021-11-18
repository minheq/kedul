import {
  PolicyAction,
  PolicyEntity,
  createPolicy,
  toPolicyStatement,
  EMPLOYEE_ACTIONS_WHITELIST,
  updatePolicy,
  DISABLED_ACTIONS,
  authorizeMember,
} from '@kedul/service-permission';
import { RequestContext, publish } from '@kedul/common-server';
import uuidv4 from 'uuid/v4';
import { Location } from '@kedul/service-location';
import { UserError, makeUserError } from '@kedul/common-utils';

import { enhance } from './RequestContext';
import { EmployeeRole } from './EmployeeRoleTypes';
import { Event } from './EmployeeRoleConstants';
import { UserErrorCode } from './EmployeeConstants';

const makeSuccessPayload = async (employeeRole: EmployeeRole) => ({
  isSuccessful: true,
  employeeRole,
  userError: null,
});

const makeErrorPayload = async (userError: UserError) => ({
  isSuccessful: false,
  employeeRole: null,
  userError,
});

const publishEvent = (
  event: string,
  employeeRole: EmployeeRole,
  context: RequestContext,
) =>
  publish(event, {
    aggregateId: employeeRole.id,
    aggregateType: 'EMPLOYEE_ROLE',
    data: employeeRole,
    context,
  });

export enum PredefinedEmployeeRoleName {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  RECEPTIONIST = 'RECEPTIONIST',
  STAFF = 'STAFF',
}

export const createEmployeeRoles = async (
  location: Location,
  context: RequestContext,
) => {
  const ownerRole = await createEmployeeRole(
    {
      locationId: location.id,
      id: uuidv4(),
      name: PredefinedEmployeeRoleName.OWNER,
      permissions: predefinedPermissionsMap.OWNER,
    },
    context,
  );
  const adminRole = await createEmployeeRole(
    {
      locationId: location.id,
      id: uuidv4(),
      name: PredefinedEmployeeRoleName.ADMIN,
      permissions: predefinedPermissionsMap.ADMIN,
    },
    context,
  );
  const managerRole = await createEmployeeRole(
    {
      locationId: location.id,
      id: uuidv4(),
      name: PredefinedEmployeeRoleName.MANAGER,
      permissions: predefinedPermissionsMap.MANAGER,
    },
    context,
  );
  const receptionistRole = await createEmployeeRole(
    {
      locationId: location.id,
      id: uuidv4(),
      name: PredefinedEmployeeRoleName.RECEPTIONIST,
      permissions: predefinedPermissionsMap.RECEPTIONIST,
    },
    context,
  );
  const staffRole = await createEmployeeRole(
    {
      locationId: location.id,
      id: uuidv4(),
      name: PredefinedEmployeeRoleName.STAFF,
      permissions: predefinedPermissionsMap.STAFF,
    },
    context,
  );

  return {
    ownerRole,
    adminRole,
    managerRole,
    receptionistRole,
    staffRole,
  };
};

export interface CreateEmployeeRoleInput {
  id?: string | null;
  locationId: string;
  name: string;
  permissions: PolicyAction[];
}

const createEmployeeRole = async (
  input: CreateEmployeeRoleInput,
  context: RequestContext,
) => {
  const { locationId, id, name, permissions } = input;
  const { employeeRoleRepository } = enhance(context).repositories;

  const policy = await createPolicy(
    {
      name: `${locationId}-${name}`,
      statements: [toPolicyStatement(permissions)],
      version: '1.0.0',
    },
    context,
  );

  const employeeRole: EmployeeRole = {
    locationId,
    id: id || uuidv4(),
    name,
    policyId: policy.id,
  };

  await employeeRoleRepository.save(employeeRole);

  publishEvent(Event.EMPLOYEE_ROLE_CREATED, employeeRole, context);

  return employeeRole;
};

export interface UpdateEmployeeRolePermissionsInput {
  id: string;
  permissions: PolicyAction[];
}

const arePermissionsValid = (permissions: PolicyAction[]) => {
  let isValid = false;

  isValid = permissions.every(permission =>
    Object.values(PolicyAction).includes(permission),
  );

  isValid = permissions.every(
    permission => !DISABLED_ACTIONS.includes(permission),
  );

  return isValid;
};

export const updateEmployeeRolePermissions = async (
  input: UpdateEmployeeRolePermissionsInput,
  context: RequestContext,
) => {
  const { id, permissions } = input;
  const { employeeRoleRepository } = enhance(context).repositories;

  const employeeRole = await employeeRoleRepository.findById(id);
  if (!employeeRole) throw new Error('Role not found');

  if (employeeRole.name === PredefinedEmployeeRoleName.OWNER) {
    return makeErrorPayload(
      makeUserError(UserErrorCode.CANNOT_ASSIGN_OWNER_ROLE),
    );
  }

  if (!arePermissionsValid(permissions)) {
    return makeErrorPayload(makeUserError(UserErrorCode.INVALID_PERMISSIONS));
  }

  const action = PolicyAction.UPDATE_ROLE_PERMISSIONS;
  await authorizeMember(
    action,
    { entity: PolicyEntity.EMPLOYEE, entityId: '*' },
    context,
  );

  await updatePolicy(
    { id: employeeRole.policyId, statements: [toPolicyStatement(permissions)] },
    context,
  );

  publishEvent(Event.EMPLOYEE_ROLE_UPDATED, employeeRole, context);

  return makeSuccessPayload(employeeRole);
};

const predefinedPermissionsMap: {
  [role in PredefinedEmployeeRoleName]: PolicyAction[]
} = {
  [PredefinedEmployeeRoleName.OWNER]: EMPLOYEE_ACTIONS_WHITELIST,
  [PredefinedEmployeeRoleName.ADMIN]: EMPLOYEE_ACTIONS_WHITELIST,
  [PredefinedEmployeeRoleName.MANAGER]: [
    PolicyAction.VIEW_EMPLOYEES,
    PolicyAction.CREATE_EMPLOYEE,
    PolicyAction.UPDATE_EMPLOYEE,
    PolicyAction.DELETE_EMPLOYEE,
    PolicyAction.INVITE_EMPLOYEE,

    PolicyAction.VIEW_SHIFTS,
    PolicyAction.CREATE_SHIFT,
    PolicyAction.UPDATE_SHIFT,

    PolicyAction.VIEW_LOCATIONS,

    PolicyAction.VIEW_CLIENTS,
    PolicyAction.CREATE_CLIENT,
    PolicyAction.UPDATE_CLIENT,
    PolicyAction.DELETE_CLIENT,

    PolicyAction.VIEW_INVOICES,
    PolicyAction.CREATE_INVOICE,
    PolicyAction.UPDATE_INVOICE,

    PolicyAction.VIEW_SERVICES,
    PolicyAction.CREATE_SERVICE,
    PolicyAction.UPDATE_SERVICE,
    PolicyAction.DELETE_SERVICE,

    PolicyAction.VIEW_APPOINTMENTS,
    PolicyAction.CREATE_APPOINTMENT,
    PolicyAction.UPDATE_APPOINTMENT,
  ],
  [PredefinedEmployeeRoleName.RECEPTIONIST]: [
    PolicyAction.VIEW_EMPLOYEES,
    PolicyAction.VIEW_SHIFTS,
    PolicyAction.VIEW_LOCATIONS,

    PolicyAction.VIEW_CLIENTS,
    PolicyAction.CREATE_CLIENT,
    PolicyAction.UPDATE_CLIENT,

    PolicyAction.VIEW_INVOICES,
    PolicyAction.CREATE_INVOICE,
    PolicyAction.UPDATE_INVOICE,

    PolicyAction.VIEW_SERVICES,
    PolicyAction.CREATE_SERVICE,
    PolicyAction.UPDATE_SERVICE,
    PolicyAction.DELETE_SERVICE,

    PolicyAction.VIEW_APPOINTMENTS,
    PolicyAction.CREATE_APPOINTMENT,
    PolicyAction.UPDATE_APPOINTMENT,
  ],
  [PredefinedEmployeeRoleName.STAFF]: [
    PolicyAction.VIEW_EMPLOYEES,
    PolicyAction.VIEW_SHIFTS,
    PolicyAction.VIEW_LOCATIONS,
    PolicyAction.VIEW_APPOINTMENTS,
    PolicyAction.VIEW_CLIENTS,
    PolicyAction.VIEW_SERVICES,
  ],
};
