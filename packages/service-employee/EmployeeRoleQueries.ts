import { RequestContext } from '@kedul/common-server';
import { sortByArray } from '@kedul/common-utils';
import { findPolicyById, PolicyAction } from '@kedul/service-permission';

import { enhance } from './RequestContext';
import { EmployeeRole } from './EmployeeRoleTypes';
import { PredefinedEmployeeRoleName } from './EmployeeRoleMutations';

export interface QueryFindEmployeeRolesArgs {
  locationId: string;
}

export const getEmployeeRolePermissions = async (
  employeeRole: EmployeeRole,
  context: RequestContext,
): Promise<PolicyAction[]> => {
  const policy = await findPolicyById({ id: employeeRole.policyId }, context);
  if (!policy) throw new Error('Could not find policy');

  return policy.statements[0].actions;
};

export const findEmployeeRoles = async (
  input: QueryFindEmployeeRolesArgs,
  context: RequestContext,
): Promise<EmployeeRole[]> => {
  const { employeeRoleRepository } = enhance(context).repositories;

  const employeeRoles = await employeeRoleRepository.findManyEmployeeRolesByLocationId(
    input.locationId,
  );

  return sortByArray(
    employeeRoles,
    Object.values(PredefinedEmployeeRoleName),
    role => role.name,
  );
};

export const findEmployeeRoleById = async (
  input: { id: string },
  context: RequestContext,
): Promise<EmployeeRole | null> => {
  const { employeeRoleLoader } = enhance(context).loaders;

  return employeeRoleLoader.load(input.id);
};
