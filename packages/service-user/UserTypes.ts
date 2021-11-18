import { ContactDetails } from '@kedul/common-utils';

export interface User {
  id: string;
  profile?: UserProfile | null;
  account: UserAccount;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  profileImageId?: string | null;
  fullName: string;
  birthday?: Date | null;
  gender?: PersonGender | null;
}

export enum PersonGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface UserAccount extends ContactDetails {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  socialIdentities: SocialIdentity[];
  logins: AccountLogin[];
}

export interface AccountLogin {
  name: string;
  key: string;
  claim: string;
  createdAt: Date;
}

export interface SocialIdentity {
  userId: string;
  provider: string;
  providerUserId: string;
  profileData?: string | null;
}
