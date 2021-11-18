import { enhanceContext, RequestContext } from '@kedul/common-server';
import DataLoader from 'dataloader';

import {
  makeServiceCategoryRepository,
  ServiceCategoryRepository,
} from './ServiceCategoryRepository';
import { ServiceCategory } from './ServiceCategoryTypes';
import { makeServiceRepository, ServiceRepository } from './ServiceRepository';
import { Service } from './ServiceTypes';

export interface ServiceServiceDataLoaders {
  serviceCategoriesLoader: DataLoader<string, ServiceCategory | null>;
  servicesLoader: DataLoader<string, Service | null>;
}

export const makeServiceServiceDataLoaders = (
  repositories: ServiceServiceRepositories,
): ServiceServiceDataLoaders => {
  const { serviceRepository, serviceCategoryRepository } = repositories;

  return {
    serviceCategoriesLoader: new DataLoader(ids =>
      serviceCategoryRepository.findManyByIds(ids),
    ),
    servicesLoader: new DataLoader(ids => serviceRepository.findManyByIds(ids)),
  };
};

export interface ServiceServiceRepositories {
  serviceRepository: ServiceRepository;
  serviceCategoryRepository: ServiceCategoryRepository;
}

export const makeServiceServiceRepositories = (
  context: RequestContext,
): ServiceServiceRepositories => {
  const serviceRepository = makeServiceRepository(context);
  const serviceCategoryRepository = makeServiceCategoryRepository(context);

  return {
    serviceCategoryRepository,
    serviceRepository,
  };
};

export interface ServiceServiceRequestContext extends RequestContext {
  loaders: ServiceServiceDataLoaders;
  repositories: ServiceServiceRepositories;
}

export const enhance = (
  context: RequestContext | ServiceServiceRequestContext,
): ServiceServiceRequestContext => {
  const repositories = makeServiceServiceRepositories(context);
  const loaders = makeServiceServiceDataLoaders(repositories);

  return enhanceContext(context, repositories, loaders);
};
