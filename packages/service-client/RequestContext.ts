import { enhanceContext, RequestContext } from '@kedul/common-server';
import DataLoader from 'dataloader';

import { ClientRepository, makeClientRepository } from './ClientRepository';
import { Client } from './ClientTypes';

export interface ClientServiceDataLoaders {
  clientsLoader: DataLoader<string, Client | null>;
}

export const makeClientServiceDataLoaders = (
  repositories: ClientServiceRepositories,
): ClientServiceDataLoaders => {
  const { clientRepository } = repositories;

  return {
    clientsLoader: new DataLoader(ids => clientRepository.findManyByIds(ids)),
  };
};

export interface ClientServiceRepositories {
  clientRepository: ClientRepository;
}

export const makeClientServiceRepositories = (
  context: RequestContext,
): ClientServiceRepositories => {
  return {
    clientRepository: makeClientRepository(context),
  };
};

export interface ClientServiceRequestContext extends RequestContext {
  loaders: ClientServiceDataLoaders;
  repositories: ClientServiceRepositories;
}

export const enhance = (
  context: RequestContext | ClientServiceRequestContext,
): ClientServiceRequestContext => {
  const repositories = makeClientServiceRepositories(context);
  const loaders = makeClientServiceDataLoaders(repositories);

  return enhanceContext(context, repositories, loaders);
};
