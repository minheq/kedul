import { RequestContext } from '@kedul/common-server';

import { enhance } from './RequestContext';

export const findBusinessMemberRoles = async (
  input: { businessId: string },
  context: RequestContext,
) => {
  const { businessMemberRoleRepository } = enhance(context).repositories;

  return businessMemberRoleRepository.findBusinessMemberRoles(input.businessId);
};

export const findBusinessMemberRoleById = async (
  input: { id: string },
  context: RequestContext,
) => {
  const { businessMemberRolesLoader } = enhance(context).loaders;

  return businessMemberRolesLoader.load(input.id);
};
