import { RequestContext } from '@kedul/common-server';

import { Business } from './BusinessTypes';
import { enhance } from './RequestContext';

export const findBusinessById = async (
  input: { id: string },
  context: RequestContext,
) => {
  const { businessesLoader } = enhance(context).loaders;

  return businessesLoader.load(input.id);
};

export const findBusinessesByIds = async (
  input: { ids: string[] },
  context: RequestContext,
): Promise<Business[]> => {
  const { businessesLoader } = enhance(context).loaders;

  const businesses = await businessesLoader.loadMany(input.ids);

  return businesses.filter(Boolean) as Business[];
};

export const findBusinessesByUserId = async (
  input: { userId: string },
  context: RequestContext,
) => {
  const { businessRepository } = enhance(context).repositories;

  return businessRepository.findManyByUserId(input.userId);
};
