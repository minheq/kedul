import { publish, RequestContext } from '@kedul/common-server';
import { UserError, UserValidationError } from '@kedul/common-utils';
import {
  authorizeMember,
  PolicyAction,
  PolicyEntity,
  PolicyResource,
} from '@kedul/service-permission';
import uuidv4 from 'uuid/v4';

import { Event, userErrors } from './InvoiceConstants';
import {
  Discount,
  Invoice,
  InvoiceLineItem,
  InvoiceLineItemType,
  InvoiceStatus,
  Payment,
  Tip,
} from './InvoiceTypes';
import { enhance } from './RequestContext';

const makeSuccessPayload = async (invoice: Invoice) => ({
  invoice,
  isSuccessful: true,
  userError: null,
});

const makeErrorPayload = async (userError: UserError) => ({
  invoice: null,
  isSuccessful: false,
  userError,
});

const publishEvent = (
  event: string,
  invoice: Invoice,
  context: RequestContext,
) =>
  publish(event, {
    aggregateId: invoice.id,
    aggregateType: 'INVOICE',
    data: invoice,
    context,
  });

const getResource = (invoice: Invoice): PolicyResource => ({
  entity: PolicyEntity.INVOICE,
  entityId: invoice.id,
  locationId: invoice.locationId,
});

const makeLineItem = (invoiceId: string) => (
  input: InvoiceLineItemInput,
): InvoiceLineItem => {
  return {
    ...input,
    discount: input.discount || null,
    id: uuidv4(),
    invoiceId,
  };
};

const make = async (input: CreateInvoiceInput): Promise<Invoice> => {
  const invoiceId = uuidv4();

  return {
    ...input,
    clientId: input.clientId || null,
    createdAt: new Date(),
    discount: input.discount || null,
    id: invoiceId,
    lineItems: input.lineItems.map(makeLineItem(invoiceId)),
    note: input.note || null,
    originalInvoiceId: null,
    payment: { ...input.payment, method: input.payment.method || null },
    refundInvoiceId: null,
    refundedAt: null,
    status: InvoiceStatus.COMPLETED,
    tip: input.tip || null,
    updatedAt: new Date(),
    voidAt: null,
  };
};

const getCorrespondingInvoiceLineItems = (
  invoice: Invoice,
  input: RefundInvoiceLineItemInput[],
) => {
  const refundedLineItemIds = input.map(li => li.id);

  return invoice.lineItems.filter(lineItem =>
    refundedLineItemIds.includes(lineItem.id),
  );
};

const validateRefund = async (invoice: Invoice, input: RefundInvoiceInput) => {
  const lineItems = getCorrespondingInvoiceLineItems(invoice, input.lineItems);
  const validationErrors: UserValidationError[] = [];

  if (invoice.refundInvoiceId) return userErrors.invoiceAlreadyRefunded();
  if (invoice.status === InvoiceStatus.VOID) return userErrors.invoiceFrozen();

  const areQuantitiesValid = lineItems.every(li => {
    const refundInput = input.lineItems.find(rli => rli.id === li.id);

    if (!refundInput) {
      validationErrors.push({
        field: 'id',
        message: 'Line item does not exist for the invoice',
      });

      return false;
    }

    if (refundInput.quantity > li.quantity) {
      validationErrors.push({
        field: 'quantity',
        message: `Given ${refundInput.quantity} got ${li.quantity}`,
      });

      return false;
    }

    return true;
  });

  if (!areQuantitiesValid) {
    return userErrors.invalidRefund(validationErrors);
  }

  return null;
};

export interface CreateInvoiceInput {
  id?: string | null;
  note?: string | null;
  lineItems: InvoiceLineItemInput[];
  discount?: Discount | null;
  tip?: Tip | null;
  payment: Payment;
  clientId?: string | null;
  locationId: string;
}

export interface InvoiceLineItemInput {
  id?: string | null;
  quantity: number;
  typeId: string;
  type: InvoiceLineItemType;
  price: number;
  discount?: Discount | null;
  employeeId: string;
}

export const createInvoice = async (
  input: CreateInvoiceInput,
  context: RequestContext,
) => {
  const { invoiceRepository } = enhance(context).repositories;

  const invoice = await make(input);

  const action = PolicyAction.CREATE_INVOICE;
  await authorizeMember(action, getResource(invoice), context);

  await invoiceRepository.save(invoice);

  publishEvent(Event.INVOICE_CREATED, invoice, context);

  return makeSuccessPayload(invoice);
};

const refundChangeset = async (
  originalInvoice: Invoice,
  refundedInvoice: Invoice,
): Promise<Invoice> => {
  return {
    ...originalInvoice,
    refundInvoiceId: refundedInvoice.id,
    refundedAt: new Date(),
  };
};

const makeRefund = async (
  oldInvoice: Invoice,
  input: RefundInvoiceInput,
): Promise<Invoice> => {
  const invoiceId = uuidv4();
  const lineItems = getCorrespondingInvoiceLineItems(
    oldInvoice,
    input.lineItems,
  );

  return {
    ...oldInvoice,
    id: invoiceId,
    lineItems: input.lineItems.map(refundedLineItem => {
      const invoiceLineItem = lineItems.find(
        li => li.id === refundedLineItem.id,
      );

      if (!invoiceLineItem) {
        throw new Error(`Expected invoiceLineItem id=${refundedLineItem.id}`);
      }

      return {
        ...invoiceLineItem,
        id: uuidv4(),
        quantity: refundedLineItem.quantity,
      };
    }),
    originalInvoiceId: input.id,
    payment: {
      ...input.payment,
      method: input.payment.method || null,
    },
    status: InvoiceStatus.REFUNDED,
  };
};

export interface RefundInvoiceInput {
  id: string;
  lineItems: RefundInvoiceLineItemInput[];
  payment: Payment;
}

export interface RefundInvoiceLineItemInput {
  id?: string | null;
  quantity: number;
}

export const refundInvoice = async (
  input: RefundInvoiceInput,
  context: RequestContext,
) => {
  const { invoiceRepository } = enhance(context).repositories;

  const oldInvoice = await invoiceRepository.getById(input.id);
  const userError = await validateRefund(oldInvoice, input);

  if (userError) return makeErrorPayload(userError);

  const refundedInvoice = await makeRefund(oldInvoice, input);
  await invoiceRepository.save(refundedInvoice);

  const invoice = await refundChangeset(oldInvoice, refundedInvoice);

  const action = PolicyAction.UPDATE_INVOICE;
  await authorizeMember(action, getResource(invoice), context);

  await invoiceRepository.update(invoice);

  publishEvent(Event.INVOICE_REFUNDED, invoice, context);

  return makeSuccessPayload(refundedInvoice);
};

const voidChangeset = async (
  originalInvoice: Invoice,
  input: VoidInvoiceInput,
): Promise<Invoice> => {
  return {
    ...originalInvoice,
    status: InvoiceStatus.VOID,
    voidAt: new Date(),
  };
};

const validateVoid = async (invoice: Invoice, input: VoidInvoiceInput) => {
  if (invoice.refundInvoiceId) return userErrors.invoiceFrozen();
  if (invoice.status === InvoiceStatus.VOID) return userErrors.invoiceFrozen();

  return null;
};

export interface VoidInvoiceInput {
  id: string;
}

export const voidInvoice = async (
  input: VoidInvoiceInput,
  context: RequestContext,
) => {
  const { invoiceRepository } = enhance(context).repositories;

  const oldInvoice = await invoiceRepository.getById(input.id);
  const userError = await validateVoid(oldInvoice, input);
  if (userError) return makeErrorPayload(userError);

  const invoice = await voidChangeset(oldInvoice, input);

  const action = PolicyAction.UPDATE_INVOICE;
  await authorizeMember(action, getResource(invoice), context);

  await invoiceRepository.update(invoice);

  publishEvent(Event.INVOICE_VOIDED, invoice, context);

  return makeSuccessPayload(invoice);
};
