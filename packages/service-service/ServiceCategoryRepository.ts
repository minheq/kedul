import {
  extractBusinessId,
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';
import { RepositoryBase } from '@kedul/common-utils';

import { ServiceCategoryDbObject, Table } from './Database';
import { ServiceCategory } from './ServiceCategoryTypes';

export interface ServiceCategoryRepository
  extends RepositoryBase<ServiceCategory> {
  findByName(name: string): Promise<ServiceCategory | null>;
  findManyByIds(ids: string[]): Promise<(ServiceCategory | null)[]>;
}

const toEntity = (
  serviceCategory: ServiceCategoryDbObject,
): ServiceCategory => {
  return serviceCategory;
};

const fromEntity = (businessId: string) => (
  serviceCategory: ServiceCategory,
): ServiceCategoryDbObject => {
  return {
    ...serviceCategory,
    businessId,
  };
};

const findByName = (context: RequestContext) => async (name: string) => {
  const { knex } = context.dependencies;

  const businessId = extractBusinessId(context);

  const serviceCategory = await knex
    .select()
    .where({ name, businessId })
    .from(Table.SERVICE_CATEGORY)
    .first();

  return serviceCategory ? toEntity(serviceCategory) : null;
};

const findById = (context: RequestContext) => async (id: string) => {
  const { knex } = context.dependencies;

  const businessId = extractBusinessId(context);

  const serviceCategory = (await knex
    .select()
    .where({ id, businessId })
    .from(Table.SERVICE_CATEGORY)
    .first()) as ServiceCategoryDbObject | null;

  return serviceCategory ? toEntity(serviceCategory) : null;
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const businessId = extractBusinessId(context);

  const serviceCategories = (await knex
    .select()
    .whereIn('id', ids)
    .andWhere({ businessId })
    .from(Table.SERVICE_CATEGORY)) as ServiceCategoryDbObject[];

  return upholdDataLoaderConstraints(serviceCategories.map(toEntity), ids);
};

const getById = (context: RequestContext) => async (id: string) => {
  const serviceCategory = await findById(context)(id);
  if (!serviceCategory) {
    throw new Error(`${id} in ${Table.SERVICE_CATEGORY}`);
  }

  return serviceCategory;
};

const save = (context: RequestContext) => async (
  serviceCategory: ServiceCategory,
) => {
  const { knex } = context.dependencies;

  const businessId = extractBusinessId(context);

  await knex
    .insert(fromEntity(businessId)(serviceCategory))
    .into(Table.SERVICE_CATEGORY);
};

const update = (context: RequestContext) => async (
  serviceCategory: ServiceCategory,
) => {
  const { knex } = context.dependencies;

  const businessId = extractBusinessId(context);

  await knex(Table.SERVICE_CATEGORY)
    .update({
      ...fromEntity(businessId)(serviceCategory),
      updatedAt: new Date(),
    })
    .where({ id: serviceCategory.id });
};

const remove = (context: RequestContext) => async (
  serviceCategory: ServiceCategory,
) => {
  const { knex } = context.dependencies;

  await knex(Table.SERVICE_CATEGORY)
    .del()
    .where({ id: serviceCategory.id });
  await knex(Table.SERVICE)
    .update({ serviceCategoryId: null })
    .where({ serviceCategoryId: serviceCategory.id });
};

export const makeServiceCategoryRepository = (
  context: RequestContext,
): ServiceCategoryRepository => ({
  findById: findById(context),
  findManyByIds: findManyByIds(context),
  findByName: findByName(context),
  getById: getById(context),
  remove: remove(context),
  save: save(context),
  update: update(context),
});
