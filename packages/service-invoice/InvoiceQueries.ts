import { RequestContext } from '@kedul/common-server';

import { enhance } from './RequestContext';

export interface QueryFindInvoiceByIdArgs {
  id: string;
}

export const findInvoiceById = async (
  input: QueryFindInvoiceByIdArgs,
  context: RequestContext,
) => {
  const { invoicesLoader } = enhance(context).loaders;

  return invoicesLoader.load(input.id);
};
