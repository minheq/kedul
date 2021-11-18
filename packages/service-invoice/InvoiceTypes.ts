export interface Invoice {
  id: string;
  note?: string | null;
  locationId: string;
  lineItems: InvoiceLineItem[];
  discount?: Discount | null;
  tip?: Tip | null;
  payment: Payment;
  clientId?: string | null;
  status: InvoiceStatus;
  refundInvoiceId?: string | null;
  originalInvoiceId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  refundedAt?: Date | null;
  voidAt?: Date | null;
}

export interface Discount {
  amount: number;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  quantity: number;
  typeId: string;
  type: InvoiceLineItemType;
  price: number;
  discount?: Discount | null;
  employeeId: string;
}

export enum InvoiceLineItemType {
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
}

export enum InvoiceStatus {
  VOID = 'VOID',
  REFUNDED = 'REFUNDED',
  COMPLETED = 'COMPLETED',
}

export interface Payment {
  amount: number;
  method?: PaymentMethod | null;
}

export interface PaymentMethod {
  name: string;
}

export interface Tip {
  amount: number;
}
