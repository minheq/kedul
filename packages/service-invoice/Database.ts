import { InvoiceLineItemType, InvoiceStatus } from './InvoiceTypes';

export interface InvoiceDbObject {
  id: string;
  note: string | null;
  locationId: string;
  discount: string | null;
  tip: string | null;
  payment: string;
  clientId: string | null;
  status: InvoiceStatus;
  refundInvoiceId: string | null;
  originalInvoiceId: string | null;
  createdAt: Date;
  updatedAt: Date;
  refundedAt: Date | null;
  voidAt: Date | null;
  businessId: string;
}

export interface InvoiceLineItemDbObject {
  id: string;
  invoiceId: string;
  quantity: number;
  typeId: string;
  type: InvoiceLineItemType;
  price: number;
  discount: string | null;
  employeeId: string;
  businessId: string;
}

export enum Table {
  INVOICE_LINE_ITEM = 'INVOICE_LINE_ITEM',
  INVOICE = 'INVOICE',
}
