export interface Policy<TAction extends string = any> {
  id: string;
  businessId: string;
  version?: string | null;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
  statements: PolicyStatement<TAction>[];
}

export interface PolicyCondition {
  entity: string;
  field: string;
  value: string;
  operator: string;
}

export enum PolicyEffect {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
}

export interface PolicyResource {
  entity: string;
  entityId: string;
  locationId?: string | null;
}

export interface PolicyStatement<TAction extends string = any> {
  /**
   * Use Allow or Deny to indicate whether the policy allows or denies access.
   */
  effect: PolicyEffect;
  /**
   * Include a list of actions that the policy allows or denies.
   */
  actions: TAction[];
  /**
   * If you create an IAM permissions policy, you must specify a list of resources to which the actions apply.
   * If you create a resource-based policy, this element is optional. If you do not include this element, then the resource to which the action applies is the resource to which the policy is attached.
   */
  resources: PolicyResource[];
  /**
   * Specify the circumstances under which the policy grants permission.
   */
  conditions: PolicyCondition[];
}
