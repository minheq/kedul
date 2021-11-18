import { UserValidationError } from '@kedul/common-utils';

export enum Event {
  BUSINESS_MEMBER_UPDATED = 'BUSINESS_MEMBER_UPDATED',
  BUSINESS_MEMBER_INVITED = 'BUSINESS_MEMBER_INVITED',
  BUSINESS_MEMBER_INVITATION_ACCEPTED = 'BUSINESS_MEMBER_INVITATION_ACCEPTED',
  BUSINESS_MEMBER_INVITE_CANCELED = 'BUSINESS_MEMBER_INVITE_CANCELED',
  BUSINESS_MEMBER_ROLE_CHANGED = 'BUSINESS_MEMBER_ROLE_CHANGED',
  BUSINESS_MEMBER_REMOVED = 'BUSINESS_MEMBER_REMOVED',
  OWNER_CREATED = 'OWNER_CREATED',
}

export enum UserErrorCode {
  /** Business member already joined organization */
  BUSINESS_MEMBER_ALREADY_EXISTS = 'BUSINESS_MEMBER_ALREADY_EXISTS',
  /** Invited email does not match user email */
  EMAIL_DOES_NOT_MATCH = 'EMAIL_DOES_NOT_MATCH',
  /** Invited email does not match user email */
  BUSINESS_MEMBER_ALREADY_ACCEPTED_INVITE = 'BUSINESS_MEMBER_ALREADY_ACCEPTED_INVITE',
  /** Invited phone number does not match user phone number */
  PHONE_NUMBER_DOES_NOT_MATCH = 'PHONE_NUMBER_DOES_NOT_MATCH',
  /** Cannot change role to owner */
  CANNOT_CHANGE_TO_OWNER = 'CANNOT_CHANGE_TO_OWNER',
}

export const userErrors = {
  businessMemberAlreadyExists: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.BUSINESS_MEMBER_ALREADY_EXISTS,
    errors: validationErrors,
    message: 'Business member already joined organization',
  }),
  emailDoesNotMatch: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.EMAIL_DOES_NOT_MATCH,
    errors: validationErrors,
    message: 'Invited email does not match user email',
  }),
  businessMemberAlreadyAcceptedInvite: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.BUSINESS_MEMBER_ALREADY_ACCEPTED_INVITE,
    errors: validationErrors,
    message: 'Invited email does not match user email',
  }),
  phoneNumberDoesNotMatch: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.PHONE_NUMBER_DOES_NOT_MATCH,
    errors: validationErrors,
    message: 'Invited phone number does not match user phone number',
  }),
  cannotChangeToOwner: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.CANNOT_CHANGE_TO_OWNER,
    errors: validationErrors,
    message: 'Cannot change role to owner',
  }),
};
