import { enhanceContext, RequestContext } from '@kedul/common-server';
import DataLoader from 'dataloader';

import { makePolicyRepository, PolicyRepository } from './PolicyRepository';
import { Policy } from './PolicyTypes';

export interface PermissionServiceDataLoaders {
  policiesLoader: DataLoader<string, Policy | null>;
}

export const makePermissionServiceDataLoaders = (
  repositories: PermissionServiceRepositories,
): PermissionServiceDataLoaders => {
  const { policyRepository } = repositories;

  return {
    policiesLoader: new DataLoader(ids => policyRepository.findManyByIds(ids)),
  };
};

export interface PermissionServiceRepositories {
  policyRepository: PolicyRepository;
}

export const makePermissionServiceRepositories = (
  context: RequestContext,
): PermissionServiceRepositories => {
  const policyRepository = makePolicyRepository(context);

  return {
    policyRepository,
  };
};

export interface PermissionServiceRequestContext extends RequestContext {
  loaders: PermissionServiceDataLoaders;
  repositories: PermissionServiceRepositories;
}

export const enhance = (
  context: RequestContext | PermissionServiceRequestContext,
): PermissionServiceRequestContext => {
  const repositories = makePermissionServiceRepositories(context);
  const loaders = makePermissionServiceDataLoaders(repositories);

  return enhanceContext(context, repositories, loaders);
};
