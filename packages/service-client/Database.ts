export interface ClientDbObject {
  id: string;
  isBanned: boolean;
  contactDetails: string | null;
  userId: string | null;
  profile: string;
  notes: string | null;
  importantNotes: string | null;
  referralSource: string | null;
  discount: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  businessId: string;
}

export enum Table {
  CLIENT = 'CLIENT',
}
