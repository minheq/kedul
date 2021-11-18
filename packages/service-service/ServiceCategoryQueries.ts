import { RequestContext } from '@kedul/common-server';

import { enhance } from './RequestContext';

export interface QueryFindServiceCategoryByIdArgs {
  id: string;
}

export const findServiceCategoryById = async (
  input: QueryFindServiceCategoryByIdArgs,
  context: RequestContext,
) => {
  const { serviceCategoriesLoader } = enhance(context).loaders;

  return serviceCategoriesLoader.load(input.id);
};
