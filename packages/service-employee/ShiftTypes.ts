import { CalendarEventRecurrence } from '@kedul/common-utils';

export interface Shift {
  id: string;
  recurrence?: ShiftRecurrence | null;
  shiftRecurrenceId?: string | null;
  locationId: string;
  businessId: string;
  employeeId: string;
  breakDuration: number;
  startDate: Date;
  endDate: Date;
  notes?: string | null;
  status: ShiftStatus;
  createdAt: Date;
  updatedAt: Date;
  canceledAt?: Date | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  markedNoShowAt?: Date | null;
}

export interface ShiftRecurrence {
  id: string;
  initialShiftId: string;
  recurrence: CalendarEventRecurrence;
  createdAt: Date;
  updatedAt: Date;
}

export enum ShiftStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CONFIRMED = 'CONFIRMED',
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  CALLED_SICK = 'CALLED_SICK',
}

export interface ShiftsFilter {
  startDate?: Date | null;
  endDate?: Date | null;
  employeeId?: string | null;
  locationId?: string | null;
  status?: ShiftStatus | null;
}
