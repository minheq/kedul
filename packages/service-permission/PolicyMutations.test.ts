import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import faker from 'faker';

import { PolicyAction, PolicyEntity } from './PolicyData';
import {
  createPolicy,
  CreatePolicyInput,
  deletePolicy,
  updatePolicy,
} from './PolicyMutations';
import { findPolicyById } from './PolicyQueries';
import { PolicyEffect } from './PolicyTypes';

const knex = makeKnex();

const makeCreateInput = (
  input?: Partial<CreatePolicyInput>,
): CreatePolicyInput => ({
  id: faker.random.uuid(),
  name: faker.random.word(),
  statements: [
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      conditions: [],
      effect: PolicyEffect.ALLOW,
      resources: [
        {
          entity: PolicyEntity.EMPLOYEE,
          entityId: faker.random.uuid(),
          locationId: faker.random.uuid(),
        },
      ],
    },
  ],
  version: faker.random.word(),
  ...input,
});

beforeAll(async () => {
  await knex.migrate.latest({
    directory: path.resolve(__dirname, './migrations'),
  });
});

afterAll(async () => {
  await knex.destroy();
});

describe('create', () => {
  test('should create happy path', async () => {
    const input = makeCreateInput();
    const policy = await createPolicy(input, makeContext());

    expect(policy.statements).toHaveLength(input.statements.length);
  });
});

describe('update', () => {
  test('should update happy path', async () => {
    const context = makeContext();
    const policy = await createPolicy(makeCreateInput(), context);

    const input = {
      ...makeCreateInput(),
      id: policy!.id,
    };

    const updatedPolicy = await updatePolicy(input, context);

    expect(updatedPolicy).toMatchObject(input);
    expect(updatedPolicy.statements).toHaveLength(input.statements.length);
  });
});

describe('delete', () => {
  test('should delete policy happy path', async () => {
    const context = makeContext();
    const policy = await createPolicy(makeCreateInput(), context);

    await deletePolicy({ id: policy!.id }, context);

    const result = await findPolicyById({ id: policy!.id }, context);

    expect(result).toBeFalsy();
  });
});
