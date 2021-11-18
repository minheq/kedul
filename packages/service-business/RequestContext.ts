import { RequestContext } from '@kedul/common-server';
import DataLoader from 'dataloader';

import {
  BusinessMemberRepository,
  makeBusinessMemberRepository,
} from './BusinessMemberRepository';
import {
  BusinessMemberRoleRepository,
  makeBusinessMemberRoleRepository,
} from './BusinessMemberRoleRepository';
import { BusinessMember } from './BusinessMemberTypes';
import {
  BusinessRepository,
  makeBusinessRepository,
} from './BusinessRepository';
import { Business } from './BusinessTypes';
import { BusinessMemberRole } from './BusinessMemberRoleTypes';

export interface BusinessServiceRepositories {
  businessRepository: BusinessRepository;
  businessMemberRepository: BusinessMemberRepository;
  businessMemberRoleRepository: BusinessMemberRoleRepository;
}

export const makeBusinessServiceRepositories = (
  context: RequestContext,
): BusinessServiceRepositories => {
  return {
    businessRepository: makeBusinessRepository(context),
    businessMemberRepository: makeBusinessMemberRepository(context),
    businessMemberRoleRepository: makeBusinessMemberRoleRepository(context),
  };
};

export interface BusinessServiceDataLoaders {
  businessesLoader: DataLoader<string, Business | null>;
  businessMembersLoader: DataLoader<string, BusinessMember | null>;
  businessMemberRolesLoader: DataLoader<string, BusinessMemberRole | null>;
}

export const makeBusinessServiceDataLoaders = (
  repositories: BusinessServiceRepositories,
): BusinessServiceDataLoaders => {
  const {
    businessRepository,
    businessMemberRepository,
    businessMemberRoleRepository,
  } = repositories;

  return {
    businessesLoader: new DataLoader(ids =>
      businessRepository.findManyByIds(ids),
    ),
    businessMembersLoader: new DataLoader(ids =>
      businessMemberRepository.findManyByIds(ids),
    ),
    businessMemberRolesLoader: new DataLoader(ids =>
      businessMemberRoleRepository.findManyByIds(ids),
    ),
  };
};

export interface BusinessServiceRequestContext extends RequestContext {
  loaders: BusinessServiceDataLoaders;
  repositories: BusinessServiceRepositories;
}

export const enhance = (
  context: RequestContext,
): BusinessServiceRequestContext => {
  const repositories = makeBusinessServiceRepositories(context);
  const loaders = makeBusinessServiceDataLoaders(repositories);

  return { ...context, loaders, repositories };
};
