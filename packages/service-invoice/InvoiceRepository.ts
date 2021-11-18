import {
  extractBusinessId,
  parseJsonColumn,
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';

import { InvoiceDbObject, InvoiceLineItemDbObject, Table } from './Database';
import { Invoice, InvoiceLineItem } from './InvoiceTypes';

export interface InvoiceRepository {
  findById: (id: string) => Promise<Invoice | null>;
  findManyByIds: (ids: string[]) => Promise<(Invoice | null)[]>;
  getById: (id: string) => Promise<Invoice>;
  save: (entity: Invoice) => Promise<void>;
  update: (entity: Invoice) => Promise<void>;
}

const toInvoiceLineItemEntity = (
  invoiceLineItem: InvoiceLineItemDbObject,
): InvoiceLineItem => {
  return {
    ...invoiceLineItem,
    discount: invoiceLineItem.discount
      ? parseJsonColumn(invoiceLineItem.discount)
      : null,
  };
};

const fromInvoiceLineItemEntity = (context: RequestContext) => (
  invoiceLineItem: InvoiceLineItem,
): InvoiceLineItemDbObject => {
  const businessId = extractBusinessId(context);

  return {
    ...invoiceLineItem,
    businessId,
    discount: invoiceLineItem.discount
      ? JSON.stringify(invoiceLineItem.discount)
      : null,
  };
};

const toEntity = (
  invoice: InvoiceDbObject,
  invoiceLineItems: InvoiceLineItemDbObject[],
): Invoice => {
  return {
    ...invoice,
    discount: invoice.discount ? parseJsonColumn(invoice.discount) : null,
    lineItems: invoiceLineItems.map(toInvoiceLineItemEntity),
    payment: parseJsonColumn(invoice.payment),
    tip: invoice.tip ? parseJsonColumn(invoice.tip) : null,
  };
};

const fromInvoiceEntity = (context: RequestContext) => (
  invoice: Invoice,
): InvoiceDbObject => {
  const businessId = extractBusinessId(context);

  return {
    businessId,
    locationId: invoice.locationId,
    createdAt: invoice.createdAt,
    id: invoice.id,

    clientId: invoice.clientId || null,
    discount: invoice.discount ? JSON.stringify(invoice.discount) : null,
    note: invoice.note || null,
    originalInvoiceId: invoice.originalInvoiceId || null,
    payment: JSON.stringify(invoice.payment),
    refundInvoiceId: invoice.refundInvoiceId || null,
    refundedAt: invoice.refundedAt || null,
    status: invoice.status,
    tip: invoice.tip ? JSON.stringify(invoice.tip) : null,
    updatedAt: invoice.updatedAt,
    voidAt: invoice.voidAt || null,
  };
};

const fromEntity = (context: RequestContext) => (
  invoice: Invoice,
): {
  dbInvoice: InvoiceDbObject;
  dbInvoiceLineItems: InvoiceLineItemDbObject[];
} => {
  return {
    dbInvoice: fromInvoiceEntity(context)(invoice),
    dbInvoiceLineItems: invoice.lineItems.map(
      fromInvoiceLineItemEntity(context),
    ),
  };
};

export const findById = (context: RequestContext) => async (
  id: string,
): Promise<Invoice | null> => {
  const { knex } = context.dependencies;

  const businessId = extractBusinessId(context);

  const invoice = (await knex
    .select()
    .where({ id, businessId })
    .from(Table.INVOICE)
    .first()) as InvoiceDbObject | null;

  if (invoice) {
    const invoiceLineItems = await knex
      .select()
      .from(Table.INVOICE_LINE_ITEM)
      .where({ invoiceId: invoice.id, businessId });

    return toEntity(invoice, invoiceLineItems);
  }

  return null;
};

export const findManyByIds = (context: RequestContext) => async (
  ids: string[],
) => {
  const { knex } = context.dependencies;

  const businessId = extractBusinessId(context);

  const invoices = (await knex
    .select()
    .whereIn('id', ids)
    .andWhere({ businessId })
    .from(Table.INVOICE)) as InvoiceDbObject[];

  const loadedInvoices = await Promise.all(
    invoices.map(async invoice => {
      const invoiceLineItems = await knex
        .select()
        .from(Table.INVOICE_LINE_ITEM)
        .where({ invoiceId: invoice.id, businessId });

      return toEntity(invoice, invoiceLineItems);
    }),
  );

  return upholdDataLoaderConstraints(loadedInvoices, ids);
};

export const getById = (context: RequestContext) => async (id: string) => {
  const invoice = await findById(context)(id);
  if (!invoice) throw new Error(`${id} in ${Table.INVOICE}`);

  return invoice;
};

export const save = (context: RequestContext) => async (invoice: Invoice) => {
  const { knex } = context.dependencies;

  const { dbInvoice, dbInvoiceLineItems } = fromEntity(context)(invoice);

  await knex.insert(dbInvoice).into(Table.INVOICE);
  await knex.batchInsert(Table.INVOICE_LINE_ITEM, dbInvoiceLineItems);
};

export const update = (context: RequestContext) => async (invoice: Invoice) => {
  const { knex } = context.dependencies;

  await knex(Table.INVOICE)
    .update({
      ...fromEntity(context)(invoice).dbInvoice,
      updatedAt: new Date(),
    })
    .where({ id: invoice.id });
};

export const makeInvoiceRepository = (
  context: RequestContext,
): InvoiceRepository => ({
  findById: findById(context),
  findManyByIds: findManyByIds(context),
  getById: getById(context),
  save: save(context),
  update: update(context),
});
