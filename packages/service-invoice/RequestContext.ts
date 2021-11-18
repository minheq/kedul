import { enhanceContext, RequestContext } from '@kedul/common-server';
import DataLoader from 'dataloader';

import { InvoiceRepository, makeInvoiceRepository } from './InvoiceRepository';
import { Invoice } from './InvoiceTypes';

export interface InvoiceServiceDataLoaders {
  invoicesLoader: DataLoader<string, Invoice | null>;
}

export const makeInvoiceServiceDataLoaders = (
  repositories: InvoiceServiceRepositories,
): InvoiceServiceDataLoaders => {
  const { invoiceRepository } = repositories;

  return {
    invoicesLoader: new DataLoader(ids => invoiceRepository.findManyByIds(ids)),
  };
};

export interface InvoiceServiceRepositories {
  invoiceRepository: InvoiceRepository;
}

export const makeInvoiceServiceRepositories = (
  context: RequestContext,
): InvoiceServiceRepositories => {
  return {
    invoiceRepository: makeInvoiceRepository(context),
  };
};

export interface InvoiceServiceRequestContext extends RequestContext {
  loaders: InvoiceServiceDataLoaders;
  repositories: InvoiceServiceRepositories;
}

export const enhance = (
  context: RequestContext | InvoiceServiceRequestContext,
): InvoiceServiceRequestContext => {
  const repositories = makeInvoiceServiceRepositories(context);
  const loaders = makeInvoiceServiceDataLoaders(repositories);

  return enhanceContext(context, repositories, loaders);
};
