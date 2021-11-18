import { UserValidationError } from '@kedul/common-utils';

export enum Event {
  SHIFT_CREATED = 'SHIFT_CREATED',
  SHIFT_UPDATED = 'SHIFT_UPDATED',
  SHIFT_CANCELED = 'SHIFT_CANCELED',
}

export enum UserErrorCode {
  /** Cannot delete a shift that was already completed */
  CANNOT_DELETE_COMPLETED_SHIFT = 'CANNOT_DELETE_COMPLETED_SHIFT',
}

export const userErrors = {
  cannotDeleteCompletedShift: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.CANNOT_DELETE_COMPLETED_SHIFT,
    errors: validationErrors,
    message: 'Cannot delete a shift that was already completed',
  }),
};
