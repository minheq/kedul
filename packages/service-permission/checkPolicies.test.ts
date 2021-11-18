import faker from 'faker';

import { checkPolicies } from './checkPolicies';
import { PolicyAction, PolicyEntity } from './PolicyData';
import { Policy, PolicyEffect, PolicyStatement } from './PolicyTypes';

const makePolicy = (statements: Partial<PolicyStatement>[]): Policy => {
  return {
    createdAt: new Date(),
    id: faker.random.uuid(),
    businessId: faker.random.uuid(),
    name: faker.random.word(),
    statements: statements.map(statement => ({
      actions: statement.actions || [],
      conditions: statement.conditions || [],
      effect: statement.effect || PolicyEffect.ALLOW,
      resources: statement.resources || [],
    })),
    updatedAt: new Date(),
    version: faker.random.word(),
  };
};

const employeeEntity = {
  entity: PolicyEntity.EMPLOYEE,
  entityId: faker.random.uuid(),
  locationId: faker.random.uuid(),
};

test('given policy to allow everything, action A should be allowed', async () => {
  const policy = makePolicy([
    {
      actions: ['*'],
      effect: PolicyEffect.ALLOW,
      resources: [{ entity: '*', locationId: '*', entityId: '*' }],
    },
  ]);

  const errors = checkPolicies(
    [policy],
    PolicyAction.CREATE_EMPLOYEE,
    employeeEntity,
  );

  expect(errors).toHaveLength(0);
});

test('given policy to allow for all actions related to entity, action A should be allowed', async () => {
  const policy = makePolicy([
    {
      actions: ['EMPLOYEE:*'],
      effect: PolicyEffect.ALLOW,
      resources: [{ entity: '*', locationId: '*', entityId: '*' }],
    },
  ]);

  const errors = checkPolicies(
    [policy],
    PolicyAction.CREATE_EMPLOYEE,
    employeeEntity,
  );

  expect(errors).toHaveLength(0);
});

test('given policy to allow for an action for all entities, action A should be allowed', async () => {
  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.ALLOW,
      resources: [{ entity: '*', locationId: '*', entityId: '*' }],
    },
  ]);

  const errors = checkPolicies(
    [policy],
    PolicyAction.CREATE_EMPLOYEE,
    employeeEntity,
  );

  expect(errors).toHaveLength(0);
});

test('given policy statement A supports action A on resource A, when performing action A it should be allowed', async () => {
  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.ALLOW,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: '*', entityId: '*' },
      ],
    },
  ]);

  const errors = checkPolicies(
    [policy],
    PolicyAction.CREATE_EMPLOYEE,
    employeeEntity,
  );

  expect(errors).toHaveLength(0);
});

test('given policy statement supports action A on resource A, when trying to perform action A on resource B, it should not allow', async () => {
  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.ALLOW,
      resources: [
        {
          entity: PolicyEntity.LOCATION,
          locationId: '*',
          entityId: '*',
        },
      ],
    },
  ]);

  const errors = checkPolicies(
    [policy],
    PolicyAction.CREATE_EMPLOYEE,
    employeeEntity,
  );

  expect(errors).toHaveLength(1);
});

test('given policy statement A does not support action A, when performing action A it should not allow', async () => {
  const policy = makePolicy([
    {
      effect: PolicyEffect.ALLOW,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: '*', entityId: '*' },
      ],
    },
  ]);

  const errors = checkPolicies(
    [policy],
    PolicyAction.CREATE_EMPLOYEE,
    employeeEntity,
  );

  expect(errors).toHaveLength(1);
});

test('given policy statement A allows * actions and policy statement B denying action A, when performing action A, it should not allow', async () => {
  const policy = makePolicy([
    {
      actions: ['*'],
      effect: PolicyEffect.ALLOW,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: '*', entityId: '*' },
      ],
    },
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.DENY,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: '*', entityId: '*' },
      ],
    },
  ]);

  const errors = checkPolicies(
    [policy],
    PolicyAction.CREATE_EMPLOYEE,
    employeeEntity,
  );

  expect(errors).toHaveLength(1);
});

test('given policy statement A allows * actions on resource A with entityId A, when performing action A on resource A with entityId A, it should allow', async () => {
  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.ALLOW,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: '*', entityId: 'A' },
      ],
    },
  ]);

  const errors = checkPolicies([policy], PolicyAction.CREATE_EMPLOYEE, {
    entity: PolicyEntity.EMPLOYEE,
    entityId: 'A',
    locationId: faker.random.uuid(),
  });

  expect(errors).toHaveLength(0);
});

test('given policy statement A allows * actions on resource A with entityId A, when performing action A on resource A with entityId B, it should not allow', async () => {
  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.ALLOW,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: '*', entityId: 'A' },
      ],
    },
  ]);

  const errors = checkPolicies([policy], PolicyAction.CREATE_EMPLOYEE, {
    entity: PolicyEntity.EMPLOYEE,
    entityId: 'B',
    locationId: faker.random.uuid(),
  });

  expect(errors).toHaveLength(1);
});

test('given policy statement A allows * actions on resource A with location A, when performing action A on resource A with location A, it should allow', async () => {
  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.ALLOW,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: 'A', entityId: 'A' },
      ],
    },
  ]);

  const errors = checkPolicies([policy], PolicyAction.CREATE_EMPLOYEE, {
    entity: PolicyEntity.EMPLOYEE,
    entityId: 'A',
    locationId: 'A',
  });

  expect(errors).toHaveLength(0);
});

test('given policy statement A allows * actions on resource A with location A, when performing action A on resource A with location B, it should not allow', async () => {
  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.ALLOW,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: 'A', entityId: '*' },
      ],
    },
  ]);

  const errors = checkPolicies([policy], PolicyAction.CREATE_EMPLOYEE, {
    entity: PolicyEntity.EMPLOYEE,
    entityId: 'A',
    locationId: 'B',
  });

  expect(errors).toHaveLength(1);
});

test('given policy statement A allows * actions on resource A with location A, when performing action A on resource A with two locations A, B, it should allow', async () => {
  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.ALLOW,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: 'A', entityId: '*' },
      ],
    },
  ]);

  const errors = checkPolicies([policy], PolicyAction.CREATE_EMPLOYEE, {
    entity: PolicyEntity.EMPLOYEE,
    entityId: faker.random.uuid(),
    locationId: ['A', 'B'],
  });

  expect(errors).toHaveLength(0);
});

test('given policy statement A allows * actions on resource A with location A, when performing action A on resource A which does not have location, it should allow', async () => {
  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.ALLOW,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: 'A', entityId: '*' },
      ],
    },
  ]);

  const errors = checkPolicies([policy], PolicyAction.CREATE_EMPLOYEE, {
    entity: PolicyEntity.EMPLOYEE,
    entityId: faker.random.uuid(),
    locationId: null,
  });

  expect(errors).toHaveLength(0);
});

test('given policy statement A allows * actions on resource A with entity A, when performing action A on resource A with entity B, it should not allow', async () => {
  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.ALLOW,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: '*', entityId: '*' },
      ],
    },
  ]);

  const errors = checkPolicies([policy], PolicyAction.CREATE_EMPLOYEE, {
    entity: PolicyEntity.CLIENT,
    entityId: faker.random.uuid(),
    locationId: faker.random.uuid(),
  });

  expect(errors).toHaveLength(1);
});

test('given policy statement A, B, and B allowing action to be performed, it should allow', async () => {
  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.ALLOW,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: 'A', entityId: 'B' },
      ],
    },
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      effect: PolicyEffect.ALLOW,
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: 'A', entityId: 'C' },
      ],
    },
  ]);

  const errors = checkPolicies([policy], PolicyAction.CREATE_EMPLOYEE, {
    entity: PolicyEntity.EMPLOYEE,
    entityId: 'C',
    locationId: 'A',
  });

  expect(errors).toHaveLength(0);
});

test('all conditions must be met', async () => {
  const resourceName = faker.random.word();
  const city = faker.random.word();

  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      conditions: [
        {
          entity: PolicyEntity.EMPLOYEE,
          field: 'name',
          operator: 'STRING_EQUALS',
          value: resourceName,
        },
        {
          entity: PolicyEntity.EMPLOYEE,
          field: 'city',
          operator: 'STRING_EQUALS',
          value: city,
        },
      ],
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: '*', entityId: '*' },
      ],
    },
  ]);

  const errors = checkPolicies([policy], PolicyAction.CREATE_EMPLOYEE, {
    city,
    entity: PolicyEntity.EMPLOYEE,
    entityId: '*',
    locationId: '*',
    name: resourceName,
  });

  expect(errors).toHaveLength(0);
});

test('if one condition is not met, it should fail', async () => {
  const resourceName = faker.random.word();
  const resourceEmail = faker.internet.email();

  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      conditions: [
        {
          entity: PolicyEntity.EMPLOYEE,
          field: 'name',
          operator: 'STRING_EQUALS',
          value: resourceName,
        },
        {
          entity: PolicyEntity.EMPLOYEE,
          field: 'email',
          operator: 'STRING_EQUALS',
          value: faker.random.word(),
        },
      ],
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: '*', entityId: '*' },
      ],
    },
  ]);

  const errors = checkPolicies([policy], PolicyAction.CREATE_EMPLOYEE, {
    entity: PolicyEntity.EMPLOYEE,
    entityId: '*',
    locationId: '*',
    name: resourceName,
    email: resourceEmail,
  });

  expect(errors).toHaveLength(1);
});

test('if resource does not have value required by condition, it should fail', async () => {
  const resourceName = faker.random.word();

  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      conditions: [
        {
          entity: PolicyEntity.EMPLOYEE,
          field: 'name',
          operator: 'STRING_EQUALS',
          value: resourceName,
        },
      ],
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: '*', entityId: '*' },
      ],
    },
  ]);

  const errors = checkPolicies([policy], PolicyAction.CREATE_EMPLOYEE, {
    entity: PolicyEntity.EMPLOYEE,
    entityId: '*',
    locationId: '*',
  });

  expect(errors).toHaveLength(1);
});

test('statements should be detached from one another', async () => {
  const policy = makePolicy([
    {
      actions: [PolicyAction.CREATE_EMPLOYEE],
      conditions: [],
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: '*', entityId: 'A' },
      ],
    },
    {
      actions: [PolicyAction.DELETE_EMPLOYEE],
      conditions: [],
      resources: [
        { entity: PolicyEntity.EMPLOYEE, locationId: '*', entityId: 'B' },
      ],
    },
  ]);

  const errors = checkPolicies([policy], PolicyAction.CREATE_EMPLOYEE, {
    entity: PolicyEntity.EMPLOYEE,
    entityId: 'B',
    locationId: '*',
  });

  expect(errors).toHaveLength(1);
});

test.todo('given resource location null, and resource policy has location A');
