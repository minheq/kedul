export interface BusinessMember {
  id: string;
  businessMemberRoleId: string;
  businessId: string;
  userId: string;
  invitation?: BusinessMemberInvitation | null;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface BusinessMemberInvitation {
  businessMemberId: string;
  expirationDate?: Date | null;
  token?: string | null;
}
