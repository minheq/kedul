import { RequestContext } from '@kedul/common-server';

import { enhance } from './RequestContext';

export interface QueryFindServiceByIdArgs {
  id: string;
}

export const findServiceById = async (
  input: QueryFindServiceByIdArgs,
  context: RequestContext,
) => {
  const { servicesLoader } = enhance(context).loaders;

  return servicesLoader.load(input.id);
};
