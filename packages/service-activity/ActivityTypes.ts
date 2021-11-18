export interface Activity {
  readonly id: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly data: string;
  readonly metadata?: string | null;
  readonly createdAt: Date;
}
