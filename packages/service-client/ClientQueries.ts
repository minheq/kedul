import { RequestContext } from '@kedul/common-server';

import { Client } from './ClientTypes';
import { enhance } from './RequestContext';

export interface QueryFindClientByIdArgs {
  id: string;
}

export const findClientById = async (
  input: QueryFindClientByIdArgs,
  context: RequestContext,
) => {
  const { clientsLoader } = enhance(context).loaders;

  return clientsLoader.load(input.id);
};

export interface QueryFindClientsArgs {
  businessId: string;
}

export const findClients = async (
  input: QueryFindClientsArgs,
  context: RequestContext,
): Promise<Client[]> => {
  const { clientRepository } = enhance(context).repositories;

  return clientRepository.findManyByBusinessId(input.businessId);
};
