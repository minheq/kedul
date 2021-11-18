export interface Business {
  id: string;
  name: string;
  logoImageId?: string | null;
  email?: string | null;
  countryCode?: string | null;
  phoneNumber?: string | null;
  facebookUrl?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
