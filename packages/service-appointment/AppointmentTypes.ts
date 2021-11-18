import { CalendarEventRecurrence } from '@kedul/common-utils';

export interface Appointment {
  id: string;
  services: AppointmentService[];
  recurrence?: AppointmentRecurrence | null;
  appointmentRecurrenceId?: string | null;
  locationId: string;
  clientId?: string | null;
  invoiceId?: string | null;
  internalNotes?: string | null;
  clientNotes?: string | null;
  cancellationReason?: string | null;
  reference?: string | null;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
  canceledAt?: Date | null;
  checkedOutAt?: Date | null;
  markedNoShowAt?: Date | null;
}

export interface AppointmentRecurrence {
  id: string;
  initialAppointmentId: string;
  recurrence: CalendarEventRecurrence;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentService {
  id: string;
  appointmentId: string;
  clientNumber: number;
  duration: number;
  isEmployeeRequestedByClient: boolean;
  order: number;
  serviceId: string;
  startDate: Date;
  employeeId?: string | null;
  clientId?: string | null;
}

export enum AppointmentStatus {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  ARRIVED = 'ARRIVED',
  STARTED = 'STARTED',
}
