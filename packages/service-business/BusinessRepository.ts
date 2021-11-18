import {
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';
import { RepositoryBase } from '@kedul/common-utils';

import { Business } from './BusinessTypes';
import { BusinessDbObject, Table } from './Database';

export interface BusinessRepository extends RepositoryBase<Business> {
  findByName: (name: string) => Promise<Business | null>;
  findManyByUserId: (userId: string) => Promise<Business[]>;
  findManyByIds: (ids: string[]) => Promise<(Business | null)[]>;
}

const toEntity = (business: BusinessDbObject): Business => {
  return business;
};

const fromEntity = (business: Business): BusinessDbObject => {
  return {
    id: business.id,
    name: business.name,
    userId: business.userId,

    countryCode: business.countryCode || null,
    createdAt: business.createdAt,
    email: business.email || null,
    facebookUrl: business.facebookUrl || null,
    logoImageId: business.logoImageId || null,
    phoneNumber: business.phoneNumber || null,
    updatedAt: business.updatedAt,
  };
};

const findByName = (context: RequestContext) => async (name: string) => {
  const { knex } = context.dependencies;

  const business = await knex
    .select()
    .where({ name })
    .from(Table.BUSINESS)
    .first();

  return toEntity(business);
};

const findManyByUserId = (context: RequestContext) => async (
  userId: string,
) => {
  const { knex } = context.dependencies;

  const businesses = (await knex
    .select()
    .where({ userId })
    .from(Table.BUSINESS)) as BusinessDbObject[];

  return businesses.map(toEntity);
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const businesses = (await knex
    .select()
    .whereIn('id', ids)
    .from(Table.BUSINESS)) as BusinessDbObject[];

  return upholdDataLoaderConstraints(businesses.map(toEntity), ids);
};

const findById = (context: RequestContext) => async (id: string) => {
  const { knex } = context.dependencies;

  const business = (await knex
    .select()
    .where({ id })
    .andWhere({ deletedAt: null })
    .from(Table.BUSINESS)
    .first()) as BusinessDbObject | null;

  return business ? toEntity(business) : null;
};

const getById = (context: RequestContext) => async (id: string) => {
  const business = await findById(context)(id);
  if (!business) throw new Error(`${id} in ${Table.BUSINESS}`);

  return business;
};

const save = (context: RequestContext) => async (business: Business) => {
  const { knex } = context.dependencies;

  await knex.insert(fromEntity(business)).into(Table.BUSINESS);
};

const update = (context: RequestContext) => async (business: Business) => {
  const { knex } = context.dependencies;

  await knex(Table.BUSINESS)
    .update({
      ...fromEntity(business),
      updatedAt: new Date(),
    })
    .where({ id: business.id });
};

const remove = (context: RequestContext) => async (business: Business) => {
  const { knex } = context.dependencies;

  await knex(Table.BUSINESS)
    .del()
    .where({ id: business.id });
};

export const makeBusinessRepository = (
  context: RequestContext,
): BusinessRepository => ({
  findById: findById(context),
  findByName: findByName(context),
  findManyByIds: findManyByIds(context),
  findManyByUserId: findManyByUserId(context),
  getById: getById(context),
  remove: remove(context),
  save: save(context),
  update: update(context),
});
