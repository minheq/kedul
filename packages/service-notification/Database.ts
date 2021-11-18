export interface NotificationDbObject {
  id: string;
  eventId: string;
  jobId: string | null;
  data: string;
  aggregateId: string;
  aggregateType: string;
  metadata: string | null;
  event: string;
  businessId: string;
}

export enum Table {
  NOTIFICATION = 'NOTIFICATION',
}
