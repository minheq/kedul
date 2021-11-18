import { ShiftStatus } from './ShiftTypes';

export interface EmployeeDbObject {
  id: string;
  employeeRoleId: string | null;
  locationId: string;
  businessId: string;
  userId: string | null;
  notes: string | null;
  acceptedInvitationAt: Date | null;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date;
  contactDetails: string | null;
  profile: string;
  salarySettings: string | null;
  shiftSettings: string | null;
  employment: string | null;
  serviceIds: string;
}

export interface EmployeeInvitationDbObject {
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

export interface ShiftDbObject {
  id: string;
  shiftRecurrenceId: string | null;
  locationId: string;
  businessId: string;
  employeeId: string;
  breakDuration: number;
  startDate: Date;
  endDate: Date;
  notes: string | null;
  status: ShiftStatus;
  createdAt: Date;
  updatedAt: Date;
  canceledAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  markedNoShowAt: Date | null;
}

export interface ShiftRecurrenceDbObject {
  id: string;
  initialShiftId: string;
  recurrence: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeRoleDbObject {
  id: string;
  name: string;
  locationId: string;
  businessId: string;
  policyId: string;
}

export enum Table {
  EMPLOYEE_INVITATION = 'EMPLOYEE_INVITATION',
  EMPLOYEE_ROLE = 'EMPLOYEE_ROLE',
  SHIFT = 'SHIFT',
  SHIFT_RECURRENCE = 'SHIFT_RECURRENCE',
  EMPLOYEE = 'EMPLOYEE',
}
