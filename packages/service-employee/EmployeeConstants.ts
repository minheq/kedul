import { UserValidationError } from '@kedul/common-utils';

export enum Event {
  EMPLOYEE_CREATED = 'EMPLOYEE_CREATED',
  EMPLOYEE_UPDATED = 'EMPLOYEE_UPDATED',
  EMPLOYEE_DELETED = 'EMPLOYEE_DELETED',
  EMPLOYEE_INVITED = 'EMPLOYEE_INVITED',
  EMPLOYEE_INVITATION_ACCEPTED = 'EMPLOYEE_INVITATION_ACCEPTED',
  EMPLOYEE_INVITATION_DECLINED = 'EMPLOYEE_INVITATION_DECLINED',
  EMPLOYEE_INVITATION_CANCELED = 'EMPLOYEE_INVITATION_CANCELED',
  EMPLOYEE_UNLINKED = 'EMPLOYEE_UNLINKED',
}

export enum UserErrorCode {
  /** Cannot remove a employee with pending future appointments */
  EMPLOYEE_PENDING_FUTURE_APPOINTMENTS = 'EMPLOYEE_PENDING_FUTURE_APPOINTMENTS',
  /** Invitation has expired */
  EMPLOYEE_INVITATION_EXPIRED = 'EMPLOYEE_INVITATION_EXPIRED',
  /** Invitation token is not valid */
  EMPLOYEE_INVITATION_INVALID = 'EMPLOYEE_INVITATION_INVALID',
  /** Invitation is not found */
  EMPLOYEE_INVITATION_NOT_FOUND = 'EMPLOYEE_INVITATION_NOT_FOUND',
  /** Employee already joined the business */
  EMPLOYEE_ALREADY_JOINED = 'EMPLOYEE_ALREADY_JOINED',
  CANNOT_ASSIGN_OWNER_ROLE = 'CANNOT_ASSIGN_OWNER_ROLE',
  INVALID_PERMISSIONS = 'INVALID_PERMISSIONS',
}

export const userErrors = {
  employeePendingFutureAppointments: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.EMPLOYEE_PENDING_FUTURE_APPOINTMENTS,
    errors: validationErrors,
    message: 'Cannot remove a employee with pending future appointments',
  }),
  employeeInvitationExpired: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.EMPLOYEE_INVITATION_EXPIRED,
    errors: validationErrors,
    message: 'Invitation has expired',
  }),
  employeeInvitationInvalid: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.EMPLOYEE_INVITATION_INVALID,
    errors: validationErrors,
    message: 'Invitation token is not valid',
  }),
  employeeInvitationNotFound: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.EMPLOYEE_INVITATION_NOT_FOUND,
    errors: validationErrors,
    message: 'Invitation is not found',
  }),
  employeeAlreadyJoined: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.EMPLOYEE_ALREADY_JOINED,
    errors: validationErrors,
    message: 'Employee already joined the business',
  }),
};
