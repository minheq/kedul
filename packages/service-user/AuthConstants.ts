import { UserValidationError } from '@kedul/common-utils';

export const VALID_CODE_DURATION_MIN = 10;

export enum LoginType {
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export enum AuthEvent {
  USER_LOGGED_IN_VIA_FACEBOOK = 'USER_LOGGED_IN_VIA_FACEBOOK',
  USER_LOGGED_IN_VIA_GOOGLE = 'USER_LOGGED_IN_VIA_GOOGLE',
  USER_PHONE_LOGIN_STARTED = 'USER_PHONE_LOGIN_STARTED',
  USER_PHONE_LOGIN_VERIFIED = 'USER_PHONE_LOGIN_VERIFIED',
  USER_EMAIL_LOGIN_STARTED = 'USER_EMAIL_LOGIN_STARTED',
  USER_EMAIL_LOGIN_VERIFIED = 'USER_EMAIL_LOGIN_VERIFIED',
  USER_LOGGED_IN_SILENTLY = 'USER_LOGGED_IN_SILENTLY',
  USER_LINKED_FACEBOOK_ACCOUNT = 'USER_LINKED_FACEBOOK_ACCOUNT',
  USER_LINKED_GOOGLE_ACCOUNT = 'USER_LINKED_GOOGLE_ACCOUNT',
  USER_DISCONNECTED_FACEBOOK_ACCOUNT = 'USER_DISCONNECTED_FACEBOOK_ACCOUNT',
  USER_DISCONNECTED_GOOGLE_ACCOUNT = 'USER_DISCONNECTED_GOOGLE_ACCOUNT',
}

export enum UserErrorCode {
  /**
   * There is already an user using this email address. Sign in to that user
   * account and link it with Facebook manually from Account Settings
   **/
  FACEBOOK_ACCOUNT_ALREADY_USED = 'FACEBOOK_ACCOUNT_ALREADY_USED',
  /** There is no facebook identity associated with the user */
  FACEBOOK_IDENTITY_DOES_NOT_EXIST = 'FACEBOOK_IDENTITY_DOES_NOT_EXIST',
  /**
   * There is already an user using this email address. Sign in to that user
   * account and link it with Google manually from Account Settings
   **/
  GOOGLE_ACCOUNT_ALREADY_USED = 'GOOGLE_ACCOUNT_ALREADY_USED',
  /** There is no google identity associated with the user account */
  GOOGLE_IDENTITY_DOES_NOT_EXIST = 'GOOGLE_IDENTITY_DOES_NOT_EXIST',
  /** There has to be other login options before disconnecting an social identity */
  MUST_HAVE_OTHER_LOGIN_OPTIONS = 'MUST_HAVE_OTHER_LOGIN_OPTIONS',
  /** There is already a user registered with given email or phone number */
  USER_ALREADY_EXIST = 'USER_ALREADY_EXIST',
  /** Invalid email verification code */
  WRONG_EMAIL_VERIFICATION_CODE = 'WRONG_EMAIL_VERIFICATION_CODE',
  /** Invalid phone number verification code */
  WRONG_PHONE_VERIFICATION_CODE = 'WRONG_PHONE_VERIFICATION_CODE',
}

export const authErrors = {
  facebookAccountAlreadyUsed: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.FACEBOOK_ACCOUNT_ALREADY_USED,
    errors: validationErrors,
    message:
      'There is already an user using this email address. Sign in to that user account and link it with Facebook manually from Account Settings',
  }),
  facebookIdentityDoesNotExist: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.FACEBOOK_IDENTITY_DOES_NOT_EXIST,
    errors: validationErrors,
    message: 'There is no facebook identity associated with the user',
  }),
  googleAccountAlreadyUsed: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.GOOGLE_ACCOUNT_ALREADY_USED,
    errors: validationErrors,
    message:
      'There is already an user using this email address. Sign in to that user account and link it with Google manually from Account Settings',
  }),
  googleIdentityDoesNotExist: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.GOOGLE_IDENTITY_DOES_NOT_EXIST,
    errors: validationErrors,
    message: 'There is no google identity associated with the user account',
  }),
  mustHaveOtherLoginOptions: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.MUST_HAVE_OTHER_LOGIN_OPTIONS,
    errors: validationErrors,
    message:
      'There has to be other login options before disconnecting an social identity',
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
