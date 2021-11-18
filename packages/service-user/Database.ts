export enum Table {
  USER_ACCOUNT = 'USER_ACCOUNT',
  SOCIAL_IDENTITY = 'SOCIAL_IDENTITY',
  ACCOUNT_LOGIN = 'ACCOUNT_LOGIN',
  USER = 'USER',
  PHONE_VERIFICATION_CODE = 'PHONE_VERIFICATION_CODE',
  EMAIL_VERIFICATION_CODE = 'EMAIL_VERIFICATION_CODE',
}

export interface UserDbObject {
  id: string;
  profile: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAccountDbObject {
  userId: string;
  email: string | null;
  phoneNumber: string | null;
  countryCode: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface SocialIdentityDbObject {
  userId: string;
  provider: string;
  providerUserId: string;
  profileData: string | null;
}

export interface AccountLoginDbObject {
  userId: string;
  name: string;
  key: string;
  claim: string;
  createdAt: Date;
}

export interface PhoneVerificationCodeDbObject {
  id: string;
  userId: string;
  code: string;
  state: string;
  type: string;
  phoneNumber: string;
  countryCode: string;
  expiredAt: Date;
}

export interface EmailVerificationCodeDbObject {
  id: string;
  userId: string;
  code: string;
  state: string;
  type: string;
  email: string;
  expiredAt: Date;
}
