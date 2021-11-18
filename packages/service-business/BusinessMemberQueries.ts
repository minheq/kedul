import { RequestContext } from '@kedul/common-server';

import { enhance } from './RequestContext';

export interface QueryFindBusinessMemberByIdArgs {
  id: string;
}

export const findBusinessMemberById = async (
  input: QueryFindBusinessMemberByIdArgs,
  context: RequestContext,
) => {
  const { businessMembersLoader } = enhance(context).loaders;

  return businessMembersLoader.load(input.id);
};

export const findBusinessMemberByUserIdAndBusinessId = async (
  input: { userId: string; businessId: string },
  context: RequestContext,
) => {
  const { businessMemberRepository } = enhance(context).repositories;

  return businessMemberRepository.findByUserIdAndBusinessId(
    input.userId,
    input.businessId,
  );
};

export const findBusinessMembersByUserId = async (
  input: { userId: string },
  context: RequestContext,
) => {
  const { businessMemberRepository } = enhance(context).repositories;

  return businessMemberRepository.findManyByUserId(input.userId);
};

export const findBusinessMembersByBusinessId = async (
  input: { businessId: string },
  context: RequestContext,
) => {
  const { businessMemberRepository } = enhance(context).repositories;

  return businessMemberRepository.findManyByBusinessId(input.businessId);
};
