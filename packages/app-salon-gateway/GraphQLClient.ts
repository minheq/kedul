import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { RequestContext } from '@kedul/common-server';
import {
  QueryFindClientByIdArgs,
  QueryFindClientsArgs,
  findClientById,
  findClients,
  DeleteClientInput,
  deleteClient,
  createClient,
  CreateClientInput,
  updateClient,
  UpdateClientInput,
} from '@kedul/service-client';

import {
  GraphQLUserError,
  GraphQLUserProfileInput,
  GraphQLContactDetailsInput,
  GraphQLDate,
  GraphQLUserProfile,
  GraphQLContactDetails,
} from './GraphQLCommon';
import { GraphQLUser } from './GraphQLUser';
import { makeMutation, makeQuery } from './GraphQLUtils';

export const GraphQLClient: GraphQLObjectType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    isBanned: { type: new GraphQLNonNull(GraphQLBoolean) },
    contactDetails: { type: GraphQLContactDetails },
    user: { type: GraphQLUser },
    profile: { type: new GraphQLNonNull(GraphQLUserProfile) },
    notes: { type: GraphQLString },
    importantNotes: { type: GraphQLString },
    referralSource: { type: GraphQLString },
    discount: { type: GraphQLFloat },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
    deletedAt: { type: GraphQLDate },
  }),
});

export const CreateClientMutation = makeMutation({
  name: 'CreateClient',
  inputFields: {
    id: { type: GraphQLID },
    isBanned: { type: GraphQLBoolean },
    contactDetails: { type: new GraphQLNonNull(GraphQLContactDetailsInput) },
    profile: { type: new GraphQLNonNull(GraphQLUserProfileInput) },
    notes: { type: GraphQLString },
    importantNotes: { type: GraphQLString },
    referralSource: { type: GraphQLString },
    discount: { type: GraphQLFloat },
  },
  outputFields: {
    client: { type: GraphQLClient },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: CreateClientInput, context: RequestContext) =>
    createClient(input, context),
});

export const UpdateClientMutation = makeMutation({
  name: 'UpdateClient',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    isBanned: { type: GraphQLBoolean },
    contactDetails: { type: GraphQLContactDetailsInput },
    profile: { type: GraphQLUserProfileInput },
    notes: { type: GraphQLString },
    importantNotes: { type: GraphQLString },
    referralSource: { type: GraphQLString },
    discount: { type: GraphQLFloat },
  },
  outputFields: {
    client: { type: GraphQLClient },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: UpdateClientInput, context: RequestContext) =>
    updateClient(input, context),
});

export const DeleteClientMutation = makeMutation({
  name: 'DeleteClient',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    client: { type: GraphQLClient },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: DeleteClientInput, context: RequestContext) =>
    deleteClient(input, context),
});

export const ClientQuery = makeQuery({
  type: GraphQLClient,
  resolve: (root: {}, args: QueryFindClientByIdArgs, context: RequestContext) =>
    findClientById(args, context),
});

export const ClientsQuery = makeQuery({
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLClient))),
  args: {
    businessId: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: (root: {}, args: QueryFindClientsArgs, context: RequestContext) =>
    findClients(args, context),
});
