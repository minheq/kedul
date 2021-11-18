export interface LocationDbObject {
  id: string;
  name: string;
  contactDetails: string | null;
  address: string | null;
  businessHours: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date;
  businessId: string;
}

export enum Table {
  LOCATION = 'LOCATION',
}
