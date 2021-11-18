import { UserValidationError } from '@kedul/common-utils';

export enum Event {
  CLIENT_CREATED_BY_MEMBER = 'CLIENT_CREATED_BY_MEMBER',
  CLIENT_CREATED_BY_CLIENT = 'CLIENT_CREATED_BY_CLIENT',
  CLIENT_UPDATED = 'CLIENT_UPDATED',
  CLIENT_DELETED = 'CLIENT_DELETED',
}

export enum UserErrorCode {
  /** Client has pending future appointments. Cancel them before removing the client */
  CLIENT_PENDING_FUTURE_APPOINTMENTS = 'CLIENT_PENDING_FUTURE_APPOINTMENTS',
}

export const userErrors = {
  clientPendingFutureAppointments: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.CLIENT_PENDING_FUTURE_APPOINTMENTS,
    errors: validationErrors,
    message:
      'Client has pending future appointments. Cancel them before removing the client',
  }),
};
