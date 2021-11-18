export interface BusinessDbObject {
  id: string;
  name: string;
  logoImageId: string | null;
  email: string | null;
  countryCode: string | null;
  phoneNumber: string | null;
  facebookUrl: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessMemberDbObject {
  id: string;
  businessMemberRoleId: string;
  businessId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt: Date | null;
}

export interface BusinessMemberInvitationDbObject {
  businessMemberId: string;
  expirationDate: Date | null;
  token: string | null;
}

export interface BusinessMemberRoleDbObject {
  id: string;
  name: string;
  businessId: string;
  policyId: string;
}

export enum Table {
  BUSINESS_MEMBER_INVITATION = 'BUSINESS_MEMBER_INVITATION',
  BUSINESS = 'BUSINESS',
  BUSINESS_MEMBER = 'BUSINESS_MEMBER',
  BUSINESS_MEMBER_ROLE = 'BUSINESS_MEMBER_ROLE',
}
