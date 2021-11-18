import {
  extractBusinessId,
  parseJsonColumn,
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';
import { RepositoryBase } from '@kedul/common-utils';

import { ServiceDbObject, Table } from './Database';
import { Service } from './ServiceTypes';

export interface ServiceRepository extends RepositoryBase<Service> {
  findManyByIds(ids: string[]): Promise<(null | Service)[]>;
}

const toEntity = (service: ServiceDbObject): Service => {
  return {
    ...service,
    imageIds: parseJsonColumn(service.imageIds),
    paddingTime: service.paddingTime
      ? parseJsonColumn(service.paddingTime)
      : null,
    pricingOptions: parseJsonColumn(service.pricingOptions),
    processingTimeDuringService: service.processingTimeDuringService
      ? parseJsonColumn(service.processingTimeDuringService)
      : null,
    questionsForClient: parseJsonColumn(service.questionsForClient),
  };
};

const fromEntity = (context: RequestContext) => (
  service: Service,
): ServiceDbObject => {
  const businessId = extractBusinessId(context);

  return {
    businessId,
    locationId: service.locationId,
    createdAt: service.createdAt,
    id: service.id,
    name: service.name,

    description: service.description || null,
    intervalTime: service.intervalTime || null,
    noteToClient: service.noteToClient || null,
    parallelClientsCount: service.parallelClientsCount || null,
    primaryImageId: service.primaryImageId || null,
    processingTimeAfterServiceEnd:
      service.processingTimeAfterServiceEnd || null,
    serviceCategoryId: service.serviceCategoryId || null,
    updatedAt: service.updatedAt,

    imageIds: JSON.stringify(service.imageIds),
    paddingTime: JSON.stringify(service.paddingTime) || null,
    pricingOptions: JSON.stringify(service.pricingOptions),
    processingTimeDuringService:
      JSON.stringify(service.processingTimeDuringService) || null,
    questionsForClient: JSON.stringify(service.questionsForClient),
  };
};

const findById = (context: RequestContext) => async (id: string) => {
  const { knex } = context.dependencies;

  const businessId = extractBusinessId(context);

  const service = (await knex
    .select()
    .where({ id, businessId })
    .from(Table.SERVICE)
    .first()) as ServiceDbObject | null;

  return service ? toEntity(service) : null;
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const businessId = extractBusinessId(context);

  const services = (await knex
    .select()
    .whereIn('id', ids)
    .andWhere({ businessId })
    .from(Table.SERVICE)) as ServiceDbObject[];

  return upholdDataLoaderConstraints(services.map(toEntity), ids);
};

const getById = (context: RequestContext) => async (id: string) => {
  const service = await findById(context)(id);
  if (!service) throw new Error(`${id} in ${Table.SERVICE}`);

  return service;
};

const save = (context: RequestContext) => async (service: Service) => {
  const { knex } = context.dependencies;

  await knex.insert(fromEntity(context)(service)).into(Table.SERVICE);
};

const update = (context: RequestContext) => async (service: Service) => {
  const { knex } = context.dependencies;

  await knex(Table.SERVICE)
    .update({
      ...fromEntity(context)(service),
      updatedAt: new Date(),
    })
    .where({ id: service.id });
};

const remove = (context: RequestContext) => async (service: Service) => {
  const { knex } = context.dependencies;

  await knex(Table.SERVICE)
    .del()
    .where({ id: service.id });
};

export const makeServiceRepository = (
  context: RequestContext,
): ServiceRepository => ({
  findManyByIds: findManyByIds(context),
  findById: findById(context),
  getById: getById(context),
  remove: remove(context),
  save: save(context),
  update: update(context),
});
