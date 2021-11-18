import { RequestContext } from '@kedul/common-server';
import { findUserById } from '@kedul/service-user';

import { Employee, EmployeeInvitation } from './EmployeeTypes';
import { enhance } from './RequestContext';

export interface EmployeesFilter {
  locationId?: string | null;
}

export interface QueryFindEmployeeByIdArgs {
  id: string;
}

export const findEmployeeById = async (
  input: QueryFindEmployeeByIdArgs,
  context: RequestContext,
): Promise<Employee | null> => {
  const { employeesLoader } = enhance(context).loaders;

  return employeesLoader.load(input.id);
};

export interface QueryFindEmployeesArgs {
  locationId: string;
}

export const findEmployees = async (
  input: QueryFindEmployeesArgs,
  context: RequestContext,
): Promise<Employee[]> => {
  const { employeeRepository } = enhance(context).repositories;

  return employeeRepository.findManyByLocationId(input.locationId);
};

export const findEmployeesByUserId = async (
  input: { userId: string },
  context: RequestContext,
): Promise<Employee[]> => {
  const { employeeRepository } = enhance(context).repositories;

  return employeeRepository.findManyByUserId(input.userId);
};

export const findEmployeeInvitationsByUserId = async (
  input: { userId: string },
  context: RequestContext,
): Promise<EmployeeInvitation[]> => {
  const { employeeRepository } = enhance(context).repositories;

  const user = await findUserById({ id: input.userId }, context);

  if (!user) throw new Error('Expected user');
  if (!user.account.phoneNumber) throw new Error('Expected user phoneNumber');
  if (!user.account.countryCode) throw new Error('Expected user countryCode');

  return employeeRepository.findEmployeeInvitationsByPhoneNumber(
    user.account.phoneNumber,
    user.account.countryCode,
  );
};
