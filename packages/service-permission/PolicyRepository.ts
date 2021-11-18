import {
  parseJsonColumn,
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';
import { RepositoryBase } from '@kedul/common-utils';

import { PolicyDbObject, Table } from './Database';
import { Policy } from './PolicyTypes';

export interface PolicyRepository extends RepositoryBase<Policy> {
  findManyByUserId(organizationUserId: string): Promise<Policy[]>;
  findManyByIds(ids: string[]): Promise<(Policy | null)[]>;
}

export const toEntity = (policy: PolicyDbObject): Policy => {
  return {
    ...policy,
    statements: parseJsonColumn(policy.statements),
  };
};

export const fromEntity = (context: RequestContext) => (
  policy: Policy,
): PolicyDbObject => {
  return {
    createdAt: policy.createdAt,
    businessId: policy.businessId,
    id: policy.id,
    name: policy.name || null,
    statements: JSON.stringify(policy.statements),
    updatedAt: policy.updatedAt,
    version: policy.version || null,
  };
};

const findById = (context: RequestContext) => async (
  id: string,
): Promise<Policy | null> => {
  const { knex } = context.dependencies;

  const policy = (await knex
    .select()
    .where({ id })
    .from(Table.POLICY)
    .first()) as PolicyDbObject;

  return policy ? toEntity(policy) : null;
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const policies = (await knex
    .select()
    .whereIn('id', ids)
    .from(Table.POLICY)) as PolicyDbObject[];

  return upholdDataLoaderConstraints(policies.map(toEntity), ids);
};

const getById = (context: RequestContext) => async (id: string) => {
  const entity = await findById(context)(id);
  if (!entity) throw new Error(`${id} in ${Table.POLICY}`);

  return entity;
};

const save = (context: RequestContext) => async (policy: Policy) => {
  const { knex } = context.dependencies;

  await knex.insert(fromEntity(context)(policy)).into(Table.POLICY);
};

const update = (context: RequestContext) => async (policy: Policy) => {
  const { knex } = context.dependencies;

  await knex(Table.POLICY)
    .update({
      ...fromEntity(context)(policy),
      updatedAt: new Date(),
    })
    .where({ id: policy.id });
};

const remove = (context: RequestContext) => async (policy: Policy) => {
  const { knex } = context.dependencies;

  await knex(Table.POLICY)
    .del()
    .where({ id: policy.id });
};

const findManyByUserId = (context: RequestContext) => async (
  userId: string,
): Promise<Policy[]> => {
  const { knex } = context.dependencies;

  const policies = await knex.raw(
    `
    SELECT p.*
    FROM "BUSINESS_MEMBER" AS businessMember
    INNER JOIN "BUSINESS_MEMBER_ROLE" AS businessMemberRole ON businessMember."businessMemberRoleId" = businessMemberRole."id"
    INNER JOIN "${Table.POLICY}" AS p ON p."id" = businessMemberRole."policyId"
    WHERE businessMember."userId" = :userId

    UNION ALL

    SELECT p.*
    FROM "EMPLOYEE" AS employee
    INNER JOIN "EMPLOYEE_ROLE" AS employeeRole ON employee."employeeRoleId" = employeeRole."id"
    INNER JOIN "${Table.POLICY}" AS p ON p."id" = employeeRole."policyId"
    WHERE employee."userId" = :userId
    `,
    { userId },
  );

  // underlying postgres library returns Result object
  if (policies.rows) {
    return policies.rows.map((policy: PolicyDbObject) => toEntity(policy));
  }

  // underlying sqlite library returns rows
  return policies.map((policy: PolicyDbObject) => toEntity(policy));
};

export const makePolicyRepository = (
  context: RequestContext,
): PolicyRepository => ({
  findById: findById(context),
  findManyByUserId: findManyByUserId(context),
  findManyByIds: findManyByIds(context),
  getById: getById(context),
  remove: remove(context),
  save: save(context),
  update: update(context),
});
