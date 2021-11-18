export interface Service {
  id: string;
  name: string;
  description?: string | null;
  serviceCategoryId?: string | null;
  primaryImageId?: string | null;
  imageIds: string[];
  locationId: string;
  pricingOptions: ServicePricingOption[];
  questionsForClient: string[];
  paddingTime?: ServicePaddingTime | null;
  processingTimeAfterServiceEnd?: number | null;
  processingTimeDuringService?: ServiceProcessingTimeDuringServiceEnd | null;
  parallelClientsCount?: number | null;
  intervalTime?: number | null;
  noteToClient?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServicePaddingTime {
  type: ServicePaddingTimeType;
  duration: number;
}

export enum ServicePaddingTimeType {
  BEFORE = 'BEFORE',
  AFTER = 'AFTER',
  BEFORE_AND_AFTER = 'BEFORE_AND_AFTER',
}

export interface ServicePricingOption {
  duration: number;
  name?: string | null;
  type: string;
  price: number;
}

export interface ServiceProcessingTimeDuringServiceEnd {
  after: number;
  duration: number;
}
