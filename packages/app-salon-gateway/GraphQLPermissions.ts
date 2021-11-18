import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { GraphQLDate } from './GraphQLCommon';

export const GraphQLPolicy: GraphQLObjectType = new GraphQLObjectType({
  name: 'Policy',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    version: { type: GraphQLString },
    name: { type: GraphQLString },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
    statements: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLPolicyStatement)),
      ),
    },
  }),
});

const GraphQLPolicyStatement: GraphQLObjectType = new GraphQLObjectType({
  name: 'PolicyStatement',
  fields: () => ({
    effect: { type: new GraphQLNonNull(GraphQLPolicyEffect) },
    actions: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString)),
      ),
    },
    resources: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLPolicyResource)),
      ),
    },
    conditions: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLPolicyCondition)),
      ),
    },
  }),
});

const GraphQLPolicyEffect = new GraphQLEnumType({
  name: 'PolicyEffect',
  values: {
    ALLOW: { value: 'ALLOW' },
    DENY: { value: 'DENY' },
  },
});

const GraphQLPolicyResource: GraphQLObjectType = new GraphQLObjectType({
  name: 'PolicyResource',
  fields: () => ({
    entity: { type: new GraphQLNonNull(GraphQLString) },
    entityId: { type: new GraphQLNonNull(GraphQLID) },
    locationId: { type: GraphQLID },
  }),
});

const GraphQLPolicyCondition: GraphQLObjectType = new GraphQLObjectType({
  name: 'PolicyCondition',
  fields: () => ({
    entity: { type: new GraphQLNonNull(GraphQLString) },
    field: { type: new GraphQLNonNull(GraphQLString) },
    value: { type: new GraphQLNonNull(GraphQLString) },
    operator: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
