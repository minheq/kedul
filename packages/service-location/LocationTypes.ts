import { Address, CalendarEvent, ContactDetails } from '@kedul/common-utils';

export interface Location {
  id: string;
  businessId: string;
  name: string;
  contactDetails?: ContactDetails | null;
  address?: Address | null;
  businessHours: CalendarEvent[];
  createdAt: Date;
  deletedAt?: Date | null;
  updatedAt: Date;
}
