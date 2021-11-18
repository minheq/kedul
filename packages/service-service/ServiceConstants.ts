import { UserValidationError } from '@kedul/common-utils';

export enum Event {
  SERVICE_CREATED = 'SERVICE_CREATED',
  SERVICE_UPDATED = 'SERVICE_UPDATED',
  SERVICE_DELETED = 'SERVICE_DELETED',
}

export enum UserErrorCode {
  /** Service has pending future appointments. Cancel them before removing the service */
  SERVICE_PENDING_FUTURE_APPOINTMENTS = 'SERVICE_PENDING_FUTURE_APPOINTMENTS',
}

export const userErrors = {
  servicePendingFutureAppointments: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.SERVICE_PENDING_FUTURE_APPOINTMENTS,
    errors: validationErrors,
    message:
      'Service has pending future appointments. Cancel them before removing the service',
  }),
};
