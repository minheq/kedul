export interface ActivityDbObject {
  id: string;
  aggregateId: string;
  aggregateType: string;
  data: string;
  metadata: string | null;
  createdAt: Date;
  businessId: string;
}

export enum Table {
  ACTIVITY = 'ACTIVITY',
}
