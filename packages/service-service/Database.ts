export interface ServiceDbObject {
  id: string;
  name: string;
  description: string | null;
  serviceCategoryId: string | null;
  primaryImageId: string | null;
  imageIds: string;
  locationId: string;
  pricingOptions: string;
  questionsForClient: string;
  paddingTime: string | null;
  processingTimeAfterServiceEnd: number | null;
  processingTimeDuringService: string | null;
  parallelClientsCount: number | null;
  intervalTime: number | null;
  noteToClient: string | null;
  createdAt: Date;
  updatedAt: Date;
  businessId: string;
}

export interface ServiceCategoryDbObject {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  businessId: string;
}

export enum Table {
  SERVICE = 'SERVICE',
  SERVICE_CATEGORY = 'SERVICE_CATEGORY',
}
