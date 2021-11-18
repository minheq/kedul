import { extractBusinessId, RequestContext } from '@kedul/common-server';

import { Location } from './LocationTypes';
import { enhance } from './RequestContext';

export interface QueryFindLocationByIdArgs {
  id: string;
}

export const findLocationById = async (
  input: QueryFindLocationByIdArgs,
  context: RequestContext,
) => {
  const { locationsLoader } = enhance(context).loaders;

  return locationsLoader.load(input.id);
};

export const findLocations = async (input: {}, context: RequestContext) => {
  const { locationRepository } = enhance(context).repositories;

  const businessId = extractBusinessId(context);

  return locationRepository.findManyByBusinessId(businessId);
};

export const findLocationsByIds = async (
  input: { locationIds: string[] },
  context: RequestContext,
): Promise<Location[]> => {
  const { locationsLoader } = enhance(context).loaders;

  const locations = await locationsLoader.loadMany(input.locationIds);

  return locations.filter(Boolean) as Location[];
};
