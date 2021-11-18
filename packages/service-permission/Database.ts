export interface PolicyDbObject {
  id: string;
  businessId: string;
  version: string | null;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  statements: string;
}

export enum Table {
  POLICY = 'POLICY',
}
