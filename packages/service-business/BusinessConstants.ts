import { UserValidationError } from '@kedul/common-utils';

export enum Event {
  BUSINESS_CREATED = 'BUSINESS_CREATED',
  BUSINESS_UPDATED = 'BUSINESS_UPDATED',
  BUSINESS_DELETED = 'BUSINESS_DELETED',
  OWNER_CREATED = 'OWNER_CREATED',
}

export enum UserErrorCode {
  /** Business with given name already exists */
  BUSINESS_NAME_ALREADY_USED = 'BUSINESS_NAME_ALREADY_USED',
}

export const userErrors = {
  businessNameAlreadyUsed: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.BUSINESS_NAME_ALREADY_USED,
    errors: validationErrors,
    message: 'Business with given name already exists',
  }),
};
