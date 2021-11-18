import { ContactDetails } from '@kedul/common-utils';
import { UserProfile } from '@kedul/service-user';

export interface Client {
  id: string;
  isBanned: boolean;
  contactDetails?: ContactDetails | null;
  userId?: string | null;
  profile: UserProfile;
  notes?: string | null;
  importantNotes?: string | null;
  referralSource?: string | null;
  discount?: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
