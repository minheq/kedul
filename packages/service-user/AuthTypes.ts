import { UserError } from '@kedul/common-utils';

export interface AuthStartPayload {
  state: string | null;
  isSuccessful: boolean;
  userError: UserError | null;
}

export interface AuthResultPayload {
  accessToken: string | null;
  isSuccessful: boolean;
  userError: UserError | null;
}

export interface PhoneVerificationCode {
  id: string;
  userId: string;
  code: string;
  state: string;
  type: string;
  phoneNumber: string;
  countryCode: string;
  expiredAt: Date;
}

export interface EmailVerificationCode {
  id: string;
  userId: string;
  code: string;
  state: string;
  type: string;
  email: string;
  expiredAt: Date;
}
