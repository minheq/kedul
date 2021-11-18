import {
  extractBusinessId,
  parseJsonColumn,
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';
import { RepositoryBase } from '@kedul/common-utils';

import { LocationDbObject, Table } from './Database';
import { Location } from './LocationTypes';

export interface LocationRepository extends RepositoryBase<Location> {
  findManyByBusinessId: (businessId: string) => Promise<Location[]>;
  findManyByIds: (ids: string[]) => Promise<(Location | null)[]>;
}

const toEntity = (location: LocationDbObject): Location => {
  return {
    ...location,
    address: location.address ? parseJsonColumn(location.address) : null,
    contactDetails: location.contactDetails
      ? parseJsonColumn(location.contactDetails)
      : null,
    businessHours: parseJsonColumn(location.businessHours),
  };
};

const fromEntity = (context: RequestContext) => (
  location: Location,
): LocationDbObject => {
  const businessId = extractBusinessId(context);

  return {
    businessId,
    id: location.id,
    name: location.name,

    contactDetails: location.contactDetails
      ? JSON.stringify(location.contactDetails)
      : null,

    address: location.address ? JSON.stringify(location.address) : null,
    businessHours: JSON.stringify(location.businessHours),

    createdAt: location.createdAt,
    deletedAt: location.deletedAt || null,
    updatedAt: location.updatedAt,
  };
};

const findManyByBusinessId = (context: RequestContext) => async (
  businessId: string,
): Promise<Location[]> => {
  const { knex } = context.dependencies;

  const locations = (await knex
    .select()
    .from(Table.LOCATION)
    .where({ businessId })) as LocationDbObject[];

  return locations.map(toEntity);
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const locations = (await knex
    .select()
    .from(Table.LOCATION)
    .whereIn('id', ids)
    .andWhere({ deletedAt: null })) as LocationDbObject[];

  return upholdDataLoaderConstraints(locations.map(toEntity), ids);
};

const findById = (context: RequestContext) => async (id: string) => {
  const { knex } = context.dependencies;

  const location = await knex
    .select()
    .where({ id })
    .from(Table.LOCATION)
    .first();

  return location ? toEntity(location) : null;
};

const getById = (context: RequestContext) => async (id: string) => {
  const location = await findById(context)(id);
  if (!location) {
    throw new Error(`${id} in ${Table.LOCATION}`);
  }

  return location;
};

const save = (context: RequestContext) => async (location: Location) => {
  const { knex } = context.dependencies;

  await knex.insert(fromEntity(context)(location)).into(Table.LOCATION);
};

const update = (context: RequestContext) => async (location: Location) => {
  const { knex } = context.dependencies;

  await knex(Table.LOCATION)
    .update({
      ...fromEntity(context)(location),
      updatedAt: new Date(),
    })
    .where({ id: location.id });
};

const remove = (context: RequestContext) => async (location: Location) => {
  const { knex } = context.dependencies;

  await knex(Table.LOCATION)
    .del()
    .where({ id: location.id });
};

export const makeLocationRepository = (
  context: RequestContext,
): LocationRepository => ({
  findById: findById(context),
  findManyByBusinessId: findManyByBusinessId(context),
  findManyByIds: findManyByIds(context),
  getById: getById(context),
  remove: remove(context),
  save: save(context),
  update: update(context),
});
