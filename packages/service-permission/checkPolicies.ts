import {
  Policy,
  PolicyCondition,
  PolicyEffect,
  PolicyResource,
  PolicyStatement,
} from './PolicyTypes';

export interface ResourceBase {
  entity: string;
  entityId: string;
  locationId?: string | string[] | null;
}

enum AuthorizationErrorType {
  ACTION_NOT_ALLOWED = 'ACTION_NOT_ALLOWED',
  ACTION_DENIED = 'ACTION_DENIED',
  RESOURCE_ENTITY_MISMATCH = 'RESOURCE_ENTITY_MISMATCH',
  RESOURCE_LOCATION_MISMATCH = 'RESOURCE_LOCATION_MISMATCH',
  RESOURCE_IDENTIFIER_MISMATCH = 'RESOURCE_IDENTIFIER_MISMATCH',
  CONDITION_NOT_MET = 'CONDITION_NOT_MET',
}

interface AuthorizationError {
  type: AuthorizationErrorType;
  given: any;
  context: any;
}

const checkHasAction = <TResource extends ResourceBase = any>(
  action: string,
  resource: TResource,
) => (statement: PolicyStatement) => {
  if (statement.actions.includes('*')) return true;

  const [entity, operation] = action.split(':');
  if (!entity || !operation) throw new Error('Invalid action');

  if (entity !== resource.entity) return false;

  return statement.actions.some(statementAction => {
    const [statementEntity, statementOperation] = statementAction.split(':');

    if (statementEntity !== entity) return false;
    if (statementOperation === '*') return true;

    return statementAction === action;
  });
};

const checkActionAllowed = <TResource extends ResourceBase = any>(
  action: string,
  resource: TResource,
) => (statement: PolicyStatement) => {
  if (statement.effect === PolicyEffect.ALLOW) {
    return checkHasAction(action, resource)(statement);
  }

  return false;
};

const checkActionDenied = <TResource extends ResourceBase = any>(
  action: string,
  resource: TResource,
) => (statement: PolicyStatement) => {
  if (statement.effect === PolicyEffect.DENY) {
    return checkHasAction(action, resource)(statement);
  }

  return false;
};

const checkEntityMatch = (resource: ResourceBase) => (
  resourceStatement: PolicyResource,
) => {
  return (
    resourceStatement.entity === '*' ||
    resourceStatement.entity === resource.entity
  );
};

const checkLocationMatch = (resource: ResourceBase) => (
  resourceStatement: PolicyResource,
) => {
  // If resource does not have locationId (belongs globally), we do not have to do the check
  if (!resource.locationId) return true;

  if (
    resourceStatement.locationId === '*' ||
    resourceStatement.locationId === null ||
    resourceStatement.locationId === undefined
  ) {
    return true;
  }

  if (Array.isArray(resource.locationId)) {
    return resource.locationId.includes(resourceStatement.locationId);
  }

  if (resource.locationId === resourceStatement.locationId) return true;

  return false;
};

const checkIdMatch = (resource: ResourceBase) => (
  resourceStatement: PolicyResource,
) => {
  if (resourceStatement.entityId === '*') return true;

  return resourceStatement.entityId === resource.entityId;
};

const checkResourceHasMatch = (resource: ResourceBase) => (
  resourceStatement: PolicyResource,
): boolean => {
  const isEntityMatch = checkEntityMatch(resource)(resourceStatement);
  if (!isEntityMatch) return false;

  const isLocationMatch = checkLocationMatch(resource)(resourceStatement);
  if (!isLocationMatch) return false;

  const resourceIdMatch = checkIdMatch(resource)(resourceStatement);
  if (!resourceIdMatch) return false;

  return true;
};

const checkResourceMatch = (resource: ResourceBase) => (
  statement: PolicyStatement,
): boolean => {
  return statement.resources.some(checkResourceHasMatch(resource));
};

const applyOperator = (operator: string) => (
  givenValue: any,
  expectedValue: any,
): boolean => {
  if (givenValue === null || givenValue === undefined) {
    return false;
  }

  switch (operator) {
    case 'STRING_EQUALS':
      return givenValue === expectedValue;
    case 'GREATER':
      return givenValue > expectedValue;
    default:
      return false;
  }
};

const checkConditionMatchBase = (condition: PolicyCondition) => (
  entityData: any,
) => {
  const expectedValue = condition.value;
  const givenValue = entityData[condition.field];

  return applyOperator(condition.operator)(givenValue, expectedValue);
};

const checkConditionMet = (resource: ResourceBase) => (
  condition: PolicyCondition,
): boolean => {
  const check = checkConditionMatchBase(condition);

  return check(resource);
};

const checkConditionsMet = (resource: ResourceBase) => (
  statement: PolicyStatement,
): boolean => statement.conditions.every(checkConditionMet(resource));

const deniedActionError = (action: string) => ({
  context: { reason: `action ${action} denied` },
  given: action,
  type: AuthorizationErrorType.ACTION_DENIED,
});

const notAllowedActionError = (action: string) => ({
  context: { reason: `action ${action} not allowed` },
  given: action,
  type: AuthorizationErrorType.ACTION_NOT_ALLOWED,
});

export const checkPolicies = <TResource extends ResourceBase = any>(
  policies: readonly Omit<Policy, 'businessId'>[],
  action: string,
  resource: TResource,
): AuthorizationError[] => {
  let hasAnyPolicyThatAllows = false;
  let hasAnyPolicyThatDenies = false;

  policies.forEach(policy => {
    policy.statements.forEach(statement => {
      if (hasAnyPolicyThatDenies) return;

      const hasResourceMatch = checkResourceMatch(resource)(statement);
      if (hasResourceMatch) {
        if (checkActionDenied(action, resource)(statement)) {
          hasAnyPolicyThatDenies = true;
        }

        if (
          checkActionAllowed(action, resource)(statement) &&
          checkConditionsMet(resource)(statement)
        ) {
          hasAnyPolicyThatAllows = true;
        }
      }
    });
  });

  // Deny should be given priority
  if (hasAnyPolicyThatDenies) return [deniedActionError(action)];
  if (!hasAnyPolicyThatAllows) return [notAllowedActionError(action)];

  return [];
};
