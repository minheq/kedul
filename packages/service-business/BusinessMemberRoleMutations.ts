import { RequestContext } from '@kedul/common-server';
import {
  createPolicy,
  toPolicyStatement,
  ALL_ACTIONS,
  BUSINESS_MEMBER_ACTIONS_WHITELIST,
  PolicyAction,
} from '@kedul/service-permission';
import uuidv4 from 'uuid/v4';

import { Business } from './BusinessTypes';
import { enhance } from './RequestContext';
import { BusinessMemberRole } from './BusinessMemberRoleTypes';

export enum PredefinedBusinessMemberRoleName {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export const createBusinessMemberRoles = async (
  business: Business,
  context: RequestContext,
) => {
  const ownerRole = await createBusinessMemberRole(
    {
      businessId: business.id,
      id: uuidv4(),
      name: PredefinedBusinessMemberRoleName.OWNER,
      permissions: predefinedPermissionsMap.OWNER,
    },
    context,
  );
  const adminRole = await createBusinessMemberRole(
    {
      businessId: business.id,
      id: uuidv4(),
      name: PredefinedBusinessMemberRoleName.ADMIN,
      permissions: predefinedPermissionsMap.ADMIN,
    },
    context,
  );
  const memberRole = await createBusinessMemberRole(
    {
      businessId: business.id,
      id: uuidv4(),
      name: PredefinedBusinessMemberRoleName.MEMBER,
      permissions: predefinedPermissionsMap.MEMBER,
    },
    context,
  );

  return { ownerRole, adminRole, memberRole };
};

export interface CreateBusinessMemberRoleInput {
  id?: string | null;
  businessId: string;
  name: string;
  permissions: PolicyAction[];
}

const createBusinessMemberRole = async (
  input: CreateBusinessMemberRoleInput,
  context: RequestContext,
) => {
  const { businessId, id, name, permissions } = input;
  const { businessMemberRoleRepository } = enhance(context).repositories;

  const policy = await createPolicy(
    {
      name: `${businessId}-${name}`,
      statements: [toPolicyStatement(permissions)],
      version: '1.0.0',
    },
    context,
  );

  const businessMemberRole: BusinessMemberRole = {
    businessId,
    id: id || uuidv4(),
    name,
    policyId: policy.id,
  };

  await businessMemberRoleRepository.save(businessMemberRole);

  return businessMemberRole;
};

const predefinedPermissionsMap: {
  [role in PredefinedBusinessMemberRoleName]: PolicyAction[]
} = {
  [PredefinedBusinessMemberRoleName.OWNER]: ALL_ACTIONS,
  [PredefinedBusinessMemberRoleName.ADMIN]: BUSINESS_MEMBER_ACTIONS_WHITELIST,
  [PredefinedBusinessMemberRoleName.MEMBER]: BUSINESS_MEMBER_ACTIONS_WHITELIST,
};
