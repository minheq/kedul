export interface AppointmentDbObject {
  id: string;
  appointmentRecurrenceId: string | null;
  locationId: string;
  clientId: string | null;
  invoiceId: string | null;
  internalNotes: string | null;
  clientNotes: string | null;
  cancellationReason: string | null;
  reference: string | null;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
  canceledAt: Date | null;
  checkedOutAt: Date | null;
  markedNoShowAt: Date | null;
  businessId: string;
}

export interface AppointmentServiceDbObject {
  id: string;
  appointmentId: string;
  clientNumber: number;
  duration: number;
  isEmployeeRequestedByClient: boolean;
  order: number;
  serviceId: string;
  startDate: Date;
  employeeId: string | null;
  clientId: string | null;
  businessId: string;
}

export interface AppointmentRecurrenceDbObject {
  id: string;
  initialAppointmentId: string;
  recurrence: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AppointmentStatus {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  ARRIVED = 'ARRIVED',
  STARTED = 'STARTED',
}

export enum Table {
  APPOINTMENT_SERVICE = 'APPOINTMENT_SERVICE',
  APPOINTMENT_RECURRENCE = 'APPOINTMENT_RECURRENCE',
  APPOINTMENT = 'APPOINTMENT',
}
