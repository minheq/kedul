import { enhanceContext, RequestContext } from '@kedul/common-server';
import DataLoader from 'dataloader';

import {
  ActivityRepository,
  makeActivityRepository,
} from './ActivityRepository';
import { Activity } from './ActivityTypes';

export interface ActivityServiceRepositories {
  activityRepository: ActivityRepository;
}

export const makeActivityServiceRepositories = (
  context: RequestContext,
): ActivityServiceRepositories => {
  return {
    activityRepository: makeActivityRepository(context),
  };
};

export interface ActivityServiceDataLoaders {
  activitiesLoader: DataLoader<string, Activity | null>;
}

export const makeActivityServiceDataLoaders = (
  repositories: ActivityServiceRepositories,
): ActivityServiceDataLoaders => {
  const { activityRepository } = repositories;

  return {
    activitiesLoader: new DataLoader(ids =>
      activityRepository.findManyByIds(ids),
    ),
  };
};

export interface ActivityServiceRequestContext extends RequestContext {
  loaders: ActivityServiceDataLoaders;
  repositories: ActivityServiceRepositories;
}

export const enhance = (
  context: RequestContext | ActivityServiceRequestContext,
): ActivityServiceRequestContext => {
  const repositories = makeActivityServiceRepositories(context);
  const loaders = makeActivityServiceDataLoaders(repositories);

  return enhanceContext(context, repositories, loaders);
};
