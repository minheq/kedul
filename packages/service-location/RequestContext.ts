import { enhanceContext, RequestContext } from '@kedul/common-server';
import DataLoader from 'dataloader';

import {
  LocationRepository,
  makeLocationRepository,
} from './LocationRepository';
import { Location } from './LocationTypes';

export interface LocationServiceDataLoaders {
  locationsLoader: DataLoader<string, Location | null>;
}

export const makeLocationServiceDataLoaders = (
  repositories: LocationServiceRepositories,
): LocationServiceDataLoaders => {
  const { locationRepository } = repositories;

  return {
    locationsLoader: new DataLoader(ids =>
      locationRepository.findManyByIds(ids),
    ),
  };
};

export interface LocationServiceRepositories {
  locationRepository: LocationRepository;
}

export const makeLocationServiceRepositories = (
  context: RequestContext,
): LocationServiceRepositories => {
  return {
    locationRepository: makeLocationRepository(context),
  };
};

export interface LocationServiceRequestContext extends RequestContext {
  loaders: LocationServiceDataLoaders;
  repositories: LocationServiceRepositories;
}

export const enhance = (
  context: RequestContext | LocationServiceRequestContext,
): LocationServiceRequestContext => {
  const repositories = makeLocationServiceRepositories(context);
  const loaders = makeLocationServiceDataLoaders(repositories);

  return enhanceContext(context, repositories, loaders);
};
