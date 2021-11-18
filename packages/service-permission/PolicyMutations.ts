import {
  extractBusinessId,
  publish,
  RequestContext,
} from '@kedul/common-server';
import uuidv4 from 'uuid/v4';

import { Event } from './PolicyConstants';
import { Policy, PolicyStatement } from './PolicyTypes';
import { enhance } from './RequestContext';

const publishEvent = (event: string, policy: Policy, context: RequestContext) =>
  publish(event, {
    aggregateId: policy.id,
    aggregateType: 'POLICY',
    data: policy,
    context,
  });

const makeStatements = (input: PolicyStatement): PolicyStatement => {
  return {
    ...input,
    resources: input.resources.map(resource => ({
      ...resource,
      locationId: resource.locationId || null,
    })),
  };
};

const make = async (
  input: CreatePolicyInput,
  context: RequestContext,
): Promise<Policy> => {
  const businessId = extractBusinessId(context);

  return {
    createdAt: new Date(),
    id: input.id || uuidv4(),
    businessId,
    name: input.name || null,
    statements: input.statements.map(makeStatements),
    updatedAt: new Date(),
    version: input.version || null,
  };
};

export interface CreatePolicyInput {
  id?: string | null;
  version?: string | null;
  name?: string | null;
  statements: PolicyStatement[];
}

export const createPolicy = async (
  input: CreatePolicyInput,
  context: RequestContext,
) => {
  const { policyRepository } = enhance(context).repositories;

  const policy = await make(input, context);
  await policyRepository.save(policy);

  publishEvent(Event.POLICY_CREATED, policy, context);

  return policy;
};

const changeset = async (
  oldPolicy: Policy,
  input: UpdatePolicyInput,
): Promise<Policy> => {
  return {
    ...oldPolicy,
    ...input,
  };
};

export interface UpdatePolicyInput {
  id: string;
  version?: string | null;
  name?: string | null;
  statements: PolicyStatement[];
}

export const updatePolicy = async (
  input: UpdatePolicyInput,
  context: RequestContext,
) => {
  const { policyRepository } = enhance(context).repositories;

  const oldPolicy = await policyRepository.getById(input.id);
  const policy = await changeset(oldPolicy, input);

  await policyRepository.update(policy);

  publishEvent(Event.POLICY_UPDATED, policy, context);

  return policy;
};

export interface DeletePolicyInput {
  id: string;
}

export const deletePolicy = async (
  input: DeletePolicyInput,
  context: RequestContext,
) => {
  const { policyRepository } = enhance(context).repositories;

  const policy = await policyRepository.getById(input.id);

  await policyRepository.remove(policy);

  publishEvent(Event.POLICY_DELETED, policy, context);

  return policy;
};
