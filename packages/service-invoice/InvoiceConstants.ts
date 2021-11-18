import { UserValidationError } from '@kedul/common-utils';

export enum Event {
  INVOICE_CREATED = 'INVOICE_CREATED',
  INVOICE_VOIDED = 'INVOICE_VOIDED',
  INVOICE_REFUNDED = 'INVOICE_REFUNDED',
}

export enum UserErrorCode {
  /** Refund items request are invalid */
  INVALID_REFUND = 'INVALID_REFUND',
  /** Invoice refunded or void cannot be changed */
  INVOICE_FROZEN = 'INVOICE_FROZEN',
  /** Invoice refunded cannot be refunded or void */
  INVOICE_ALREADY_REFUNDED = 'INVOICE_ALREADY_REFUNDED',
}

export const userErrors = {
  invalidRefund: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.INVALID_REFUND,
    errors: validationErrors,
    message: 'Refund items request are invalid',
  }),
  invoiceFrozen: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.INVOICE_FROZEN,
    errors: validationErrors,
    message: 'Invoice refunded or void cannot be changed',
  }),
  invoiceAlreadyRefunded: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.INVOICE_ALREADY_REFUNDED,
    errors: validationErrors,
    message: 'Invoice refunded cannot be refunded or void',
  }),
};
