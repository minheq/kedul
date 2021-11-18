import { RequestContext } from '@kedul/common-server';

import { enhance } from './RequestContext';

export const findPolicyById = async (
  input: { id: string },
  context: RequestContext,
) => {
  const enhancedContext = enhance(context);
  const { policiesLoader } = enhancedContext.loaders;

  return policiesLoader.load(input.id);
};

export const findPoliciesByUserId = async (
  input: { userId: string },
  context: RequestContext,
) => {
  const enhancedContext = enhance(context);
  const { policyRepository } = enhancedContext.repositories;

  return await policyRepository.findManyByUserId(input.userId);
};
