import { UserValidationError } from '@kedul/common-utils';

export enum LoginType {
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export enum UserEvent {
  USER_DEACTIVATED = 'USER_DEACTIVATED',
  USER_PHONE_UPDATE_STARTED = 'USER_PHONE_UPDATE_STARTED',
  USER_PHONE_UPDATE_VERIFIED = 'USER_PHONE_UPDATE_VERIFIED',
  USER_EMAIL_UPDATE_STARTED = 'USER_EMAIL_UPDATE_STARTED',
  USER_EMAIL_UPDATE_VERIFIED = 'USER_EMAIL_UPDATE_VERIFIED',
  USER_PROFILE_UPDATED = 'USER_PROFILE_UPDATED',
}

export enum UserErrorCode {
  /** There is already a user registered with given email or phone number */
  USER_ALREADY_EXIST = 'USER_ALREADY_EXIST',
  /** Invalid email verification code */
  WRONG_EMAIL_VERIFICATION_CODE = 'WRONG_EMAIL_VERIFICATION_CODE',
  /** Invalid phone number verification code */
  WRONG_PHONE_VERIFICATION_CODE = 'WRONG_PHONE_VERIFICATION_CODE',
}

export const userErrors = {
  userAlreadyExist: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.USER_ALREADY_EXIST,
    errors: validationErrors,
    message:
      'There is already a user registered with given email or phone number',
  }),
  wrongEmailVerificationCode: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.WRONG_EMAIL_VERIFICATION_CODE,
    errors: validationErrors,
    message: 'Invalid email verification code',
  }),
  wrongPhoneVerificationCode: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.WRONG_PHONE_VERIFICATION_CODE,
    errors: validationErrors,
    message: 'Invalid phone number verification code',
  }),
};
