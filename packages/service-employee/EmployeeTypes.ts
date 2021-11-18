import { ContactDetails } from '@kedul/common-utils';
import { UserProfile } from '@kedul/service-user';

export interface Employee {
  id: string;
  employeeRoleId?: string | null;
  locationId: string;
  businessId: string;
  userId?: string | null;
  notes?: string | null;
  acceptedInvitationAt?: Date | null;
  createdAt: Date;
  deletedAt?: Date | null;
  updatedAt: Date;
  contactDetails?: ContactDetails | null;
  profile: UserProfile;
  salarySettings?: EmployeeSalarySettings | null;
  shiftSettings?: EmployeeShiftSettings | null;
  employment?: EmployeeEmployment | null;
  serviceIds: string[];
  invitation?: EmployeeInvitation | null;
}

export interface EmployeeEmployment {
  title?: string | null;
  employmentEndDate?: Date | null;
  employmentStartDate?: Date | null;
}

export interface EmployeeInvitation {
  id: string;
  businessId: string;
  employeeId: string;
  invitedByUserId: string;
  phoneNumber: string;
  countryCode: string;
  expirationDate: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeSalarySettings {
  wage?: number | null;
  productCommission?: number | null;
  serviceCommission?: number | null;
  voucherCommission?: number | null;
}

export interface EmployeeShiftSettings {
  appointmentColor?: string | null;
  canHaveAppointments?: boolean | null;
}
