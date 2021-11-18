import {
  extractBusinessId,
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';

import { EmployeeRoleDbObject, Table } from './Database';
import { EmployeeRole } from './EmployeeRoleTypes';

export interface EmployeeRoleRepository {
  save: (employeeRole: EmployeeRole) => Promise<void>;
  findById: (id: string) => Promise<EmployeeRole | null>;
  findManyByIds: (ids: string[]) => Promise<(EmployeeRole | null)[]>;
  findManyEmployeeRolesByLocationId: (
    locationId: string,
  ) => Promise<EmployeeRole[]>;
}

const toEntity = (employeeRole: EmployeeRoleDbObject): EmployeeRole => {
  return employeeRole;
};

const fromEntity = (context: RequestContext) => (
  employeeRole: EmployeeRole,
): EmployeeRoleDbObject => {
  const businessId = extractBusinessId(context);

  return {
    ...employeeRole,
    businessId,
  };
};

const save = (context: RequestContext) => async (
  employeeRole: EmployeeRole,
) => {
  const { knex } = context.dependencies;

  await knex
    .insert(fromEntity(context)(employeeRole))
    .into(Table.EMPLOYEE_ROLE);
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const employeeRoles = (await knex
    .select()
    .whereIn('id', ids)
    .from(Table.EMPLOYEE_ROLE)) as EmployeeRoleDbObject[];

  return upholdDataLoaderConstraints(employeeRoles.map(toEntity), ids);
};

const findById = (context: RequestContext) => async (id: string) => {
  const { knex } = context.dependencies;

  const employeeRole = (await knex
    .select()
    .where('id', id)
    .from(Table.EMPLOYEE_ROLE)
    .first()) as EmployeeRoleDbObject;

  return employeeRole ? toEntity(employeeRole) : null;
};

const findManyEmployeeRolesByLocationId = (context: RequestContext) => async (
  locationId: string,
) => {
  const { knex } = context.dependencies;

  const employeeRoles = (await knex
    .select()
    .where({ locationId })
    .from(Table.EMPLOYEE_ROLE)) as EmployeeRoleDbObject[];

  return employeeRoles.map(toEntity);
};

export const makeEmployeeRoleRepository = (
  context: RequestContext,
): EmployeeRoleRepository => ({
  save: save(context),
  findById: findById(context),
  findManyByIds: findManyByIds(context),
  findManyEmployeeRolesByLocationId: findManyEmployeeRolesByLocationId(context),
});
