import { uniq } from 'lodash';
import { I18n } from '@kedul/common-config';

import { PolicyEffect, PolicyStatement } from './PolicyTypes';

export enum PolicyEntity {
  BUSINESS = 'BUSINESS',
  BUSINESS_MEMBER = 'BUSINESS_MEMBER',
  LOCATION = 'LOCATION',
  EMPLOYEE = 'EMPLOYEE',
  SHIFT = 'SHIFT',
  CLIENT = 'CLIENT',
  APPOINTMENT = 'APPOINTMENT',
  SERVICE = 'SERVICE',
  SERVICE_CATEGORY = 'SERVICE_CATEGORY',
  INVOICE = 'INVOICE',
}

export enum PolicyAction {
  VIEW_EMPLOYEES = 'EMPLOYEE:VIEW_EMPLOYEES',
  CREATE_EMPLOYEE = 'EMPLOYEE:CREATE_EMPLOYEE',
  UPDATE_EMPLOYEE = 'EMPLOYEE:UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE = 'EMPLOYEE:DELETE_EMPLOYEE',
  INVITE_EMPLOYEE = 'EMPLOYEE:INVITE_EMPLOYEE',
  UPDATE_EMPLOYEE_ROLE = 'EMPLOYEE:UPDATE_EMPLOYEE_ROLE',
  UPDATE_ROLE_PERMISSIONS = 'EMPLOYEE:UPDATE_ROLE_PERMISSIONS',

  VIEW_SHIFTS = 'SHIFT:VIEW_SHIFTS',
  CREATE_SHIFT = 'SHIFT:CREATE_SHIFT',
  UPDATE_SHIFT = 'SHIFT:UPDATE_SHIFT',

  UPDATE_BUSINESS = 'BUSINESS:UPDATE_BUSINESS',
  DELETE_BUSINESS = 'BUSINESS:DELETE_BUSINESS',

  VIEW_LOCATIONS = 'LOCATION:VIEW_LOCATIONS',
  CREATE_LOCATION = 'LOCATION:CREATE_LOCATION',
  UPDATE_LOCATION = 'LOCATION:UPDATE_LOCATION',
  DELETE_LOCATION = 'LOCATION:DELETE_LOCATION',

  VIEW_CLIENTS = 'CLIENT:VIEW_CLIENTS',
  CREATE_CLIENT = 'CLIENT:CREATE_CLIENT',
  UPDATE_CLIENT = 'CLIENT:UPDATE_CLIENT',
  DELETE_CLIENT = 'CLIENT:DELETE_CLIENT',

  VIEW_INVOICES = 'INVOICE:VIEW_INVOICES',
  CREATE_INVOICE = 'INVOICE:CREATE_INVOICE',
  UPDATE_INVOICE = 'INVOICE:UPDATE_INVOICE',

  VIEW_SERVICES = 'SERVICE:VIEW_SERVICES',
  CREATE_SERVICE = 'SERVICE:CREATE_SERVICE',
  UPDATE_SERVICE = 'SERVICE:UPDATE_SERVICE',
  DELETE_SERVICE = 'SERVICE:DELETE_SERVICE',

  VIEW_APPOINTMENTS = 'APPOINTMENT:VIEW_APPOINTMENTS',
  CREATE_APPOINTMENT = 'APPOINTMENT:CREATE_APPOINTMENT',
  UPDATE_APPOINTMENT = 'APPOINTMENT:UPDATE_APPOINTMENT',
}

export const getPolicyActionDescription = (
  action: PolicyAction,
  i18n: I18n,
) => {
  switch (action) {
    case PolicyAction.INVITE_EMPLOYEE:
      return i18n.t('Invite user to use the system');
    case PolicyAction.UPDATE_SHIFT:
      return i18n.t('Update status and details');
    case PolicyAction.UPDATE_APPOINTMENT:
      return i18n.t('Update status and details');
    case PolicyAction.UPDATE_EMPLOYEE_ROLE:
      return i18n.t('Only admins and owner are allowed');
    case PolicyAction.UPDATE_ROLE_PERMISSIONS:
      return i18n.t('Only admins and owner are allowed');
    default:
      return '';
  }
};

const validateDuringRuntime = () => {
  const hasDuplicates = (actions: PolicyAction[]) => {
    return uniq(actions).length !== actions.length;
  };

  Object.values(PolicyAction).forEach(policyAction => {
    const [entity, action] = policyAction.split(':');

    if (
      !entity ||
      !action ||
      !Object.values(PolicyEntity).includes(entity as PolicyEntity)
    ) {
      throw new Error(`Invalid PolicyAction ${policyAction}`);
    }

    // @ts-ignore
    if (!PolicyAction[action]) {
      throw new Error(`Action "${action}" does not match name in PolicyAction`);
    }
  });

  if (hasDuplicates(Object.values(PolicyAction))) {
    throw new Error(`PolicyAction has duplicate actions`);
  }
};

validateDuringRuntime();

export const ALL_ACTIONS = Object.values(PolicyAction);
export const DISABLED_ACTIONS = [
  PolicyAction.UPDATE_ROLE_PERMISSIONS,
  PolicyAction.UPDATE_EMPLOYEE_ROLE,
];

export const EMPLOYEE_ACTIONS_BLACKLIST: PolicyAction[] = [
  PolicyAction.UPDATE_BUSINESS,
  PolicyAction.DELETE_BUSINESS,
  PolicyAction.CREATE_LOCATION,
  PolicyAction.DELETE_LOCATION,
];

export const EMPLOYEE_ACTIONS_WHITELIST: PolicyAction[] = ALL_ACTIONS.filter(
  action => !EMPLOYEE_ACTIONS_BLACKLIST.includes(action),
);

export const BUSINESS_MEMBER_ACTIONS_BLACKLIST: PolicyAction[] = [
  PolicyAction.DELETE_BUSINESS,
];

export const BUSINESS_MEMBER_ACTIONS_WHITELIST: PolicyAction[] = ALL_ACTIONS.filter(
  action => !BUSINESS_MEMBER_ACTIONS_BLACKLIST.includes(action),
);

/**
 * If there are duplicates, the first values is chosen
 */
export const toPolicyStatement = (
  actions: PolicyAction[],
): PolicyStatement<PolicyAction> => {
  return {
    actions: uniq(actions),
    conditions: [],
    effect: PolicyEffect.ALLOW,
    resources: [
      {
        entity: '*',
        entityId: '*',
        locationId: '*',
      },
    ],
  };
};
