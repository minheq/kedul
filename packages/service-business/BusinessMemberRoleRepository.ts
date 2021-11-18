import {
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';

import { BusinessMemberRoleDbObject, Table } from './Database';
import { BusinessMemberRole } from './BusinessMemberRoleTypes';

export interface BusinessMemberRoleRepository {
  save: (businessMemberRole: BusinessMemberRole) => Promise<void>;
  findById: (id: string) => Promise<BusinessMemberRole | null>;
  getById: (id: string) => Promise<BusinessMemberRole>;
  findManyByIds: (ids: string[]) => Promise<(BusinessMemberRole | null)[]>;
  findBusinessMemberRoles: (
    businessId: string,
  ) => Promise<BusinessMemberRole[]>;
  getByRole: (name: string) => Promise<BusinessMemberRole>;
}

const toEntity = (
  businessMemberRole: BusinessMemberRoleDbObject,
): BusinessMemberRole => {
  return businessMemberRole;
};

const fromEntity = (context: RequestContext) => (
  businessMemberRole: BusinessMemberRole,
): BusinessMemberRoleDbObject => {
  return businessMemberRole;
};

const findById = (context: RequestContext) => async (id: string) => {
  const { knex } = context.dependencies;

  return (await knex
    .select()
    .where({ id })
    .from(Table.BUSINESS_MEMBER_ROLE)
    .first()) as BusinessMemberRoleDbObject | null;
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const businessMemberRoles = (await knex
    .select()
    .whereIn('id', ids)
    .from(Table.BUSINESS_MEMBER_ROLE)) as BusinessMemberRoleDbObject[];

  return upholdDataLoaderConstraints(businessMemberRoles.map(toEntity), ids);
};

const getById = (context: RequestContext) => async (id: string) => {
  const businessMemberRole = await findById(context)(id);

  if (!businessMemberRole) {
    throw new Error(`Expected businessMemberRole with id ${id}`);
  }

  return businessMemberRole;
};

const getByRole = (context: RequestContext) => async (name: string) => {
  const { knex } = context.dependencies;

  const businessMemberRole = await knex
    .select()
    .where({ name })
    .from(Table.BUSINESS_MEMBER_ROLE)
    .first();

  if (!businessMemberRole) {
    throw new Error(`Expected businessMemberRole ${name}`);
  }

  return businessMemberRole;
};

const findBusinessMemberRoles = (context: RequestContext) => async (
  businessId: string,
) => {
  const { knex } = context.dependencies;

  const roles = await knex
    .select()
    .where({ businessId })
    .from(Table.BUSINESS_MEMBER_ROLE);

  return roles.map(toEntity);
};

const save = (context: RequestContext) => async (
  businessMemberRole: BusinessMemberRole,
) => {
  const { knex } = context.dependencies;

  await knex
    .insert(fromEntity(context)(businessMemberRole))
    .into(Table.BUSINESS_MEMBER_ROLE);
};

export const makeBusinessMemberRoleRepository = (
  context: RequestContext,
): BusinessMemberRoleRepository => ({
  findBusinessMemberRoles: findBusinessMemberRoles(context),
  findById: findById(context),
  findManyByIds: findManyByIds(context),
  getById: getById(context),
  getByRole: getByRole(context),
  save: save(context),
});
