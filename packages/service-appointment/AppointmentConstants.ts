import { UserValidationError } from '@kedul/common-utils';

export enum Event {
  APPOINTMENT_CREATED_BY_CLIENT = 'APPOINTMENT_CREATED_BY_CLIENT',
  APPOINTMENT_CREATED_BY_MEMBER = 'APPOINTMENT_CREATED_BY_MEMBER',
  APPOINTMENT_UPDATED_BY_CLIENT = 'APPOINTMENT_UPDATED_BY_CLIENT',
  APPOINTMENT_UPDATED_BY_MEMBER = 'APPOINTMENT_UPDATED_BY_MEMBER',
  APPOINTMENT_CHECKED_OUT = 'APPOINTMENT_CHECKED_OUT',
  APPOINTMENT_CANCELED_BY_CLIENT = 'APPOINTMENT_CANCELED_BY_CLIENT',
  APPOINTMENT_CANCELED_BY_MEMBER = 'APPOINTMENT_CANCELED_BY_MEMBER',
  APPOINTMENT_MARKED_NO_SHOW = 'APPOINTMENT_MARKED_NO_SHOW',
}

export enum UserErrorCode {
  /** Cannot make changes to appointment whose status is CONFIRMED or CANCELED */
  APPOINTMENT_FROZEN = 'APPOINTMENT_FROZEN',
  /** Cannot cancel appointment if it is not in the future */
  CANCEL_ONLY_FOR_FUTURE_APPOINTMENTS = 'CANCEL_ONLY_FOR_FUTURE_APPOINTMENTS',
  /** End date must be greater than start date */
  INVALID_RECURRENCE_END_DATE = 'INVALID_RECURRENCE_END_DATE',
  /** Until must be greater than end date */
  INVALID_RECURRENCE_UNTIL_DATE = 'INVALID_RECURRENCE_UNTIL_DATE',
  /** Appointment must have minimum one service */
  MINIMUM_APPOINTMENT_SERVICE = 'MINIMUM_APPOINTMENT_SERVICE',
  /** Cannot mark an appointment to no show if it is not in the past */
  NO_SHOW_ONLY_FOR_PAST_APPOINTMENTS = 'NO_SHOW_ONLY_FOR_PAST_APPOINTMENTS',
  /** Client wanted to perform unauthorized actions */
  ACTION_NOT_ALLOWED = 'ACTION_NOT_ALLOWED',
  /** Client field is required */
  CLIENT_FIELD_REQUIRED = 'CLIENT_FIELD_REQUIRED',
}

export const userErrors = {
  appointmentFrozen: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.APPOINTMENT_FROZEN,
    errors: validationErrors,
    message:
      'Cannot make changes to appointment whose status is CONFIRMED or CANCELED',
  }),
  cancelOnlyForFutureAppointments: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.CANCEL_ONLY_FOR_FUTURE_APPOINTMENTS,
    errors: validationErrors,
    message: 'Cannot cancel appointment if it is not in the future',
  }),
  invalidRecurrenceEndDate: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.INVALID_RECURRENCE_END_DATE,
    errors: validationErrors,
    message: 'End date must be greater than start date',
  }),
  invalidRecurrenceUntilDate: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.INVALID_RECURRENCE_UNTIL_DATE,
    errors: validationErrors,
    message: 'Until must be greater than end date',
  }),
  minimumAppointmentService: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.MINIMUM_APPOINTMENT_SERVICE,
    errors: validationErrors,
    message: 'Appointment must have minimum one service',
  }),
  noShowOnlyForPastAppointments: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.NO_SHOW_ONLY_FOR_PAST_APPOINTMENTS,
    errors: validationErrors,
    message: 'Cannot mark an appointment to no show if it is not in the past',
  }),
  actionNotAllowed: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.ACTION_NOT_ALLOWED,
    errors: validationErrors,
    message: 'Client wanted to perform unauthorized actions',
  }),
  clientFieldRequired: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.CLIENT_FIELD_REQUIRED,
    errors: validationErrors,
    message: 'Client field is required',
  }),
};
