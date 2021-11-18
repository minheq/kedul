import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { extractUserId, RequestContext } from '@kedul/common-server';
import {
  findBusinessById,
  createBusiness,
  CreateBusinessInput,
  UpdateBusinessInput,
  updateBusiness,
  DeleteBusinessInput,
  deleteBusiness,
  Business,
  findBusinessMemberByUserIdAndBusinessId,
} from '@kedul/service-business';
import { findEmployeesByUserId } from '@kedul/service-employee';
import { findImageById } from '@kedul/service-image';
import { findLocations } from '@kedul/service-location';
import { findUserById, User } from '@kedul/service-user';

import { GraphQLUserError, GraphQLDate } from './GraphQLCommon';
import { GraphQLImage } from './GraphQLImage';
import { GraphQLUser } from './GraphQLUser';
import { GraphQLLocation } from './GraphQLLocation';
import { makeMutation, makeQuery } from './GraphQLUtils';

export const GraphQLBusiness: GraphQLObjectType<
  Business,
  RequestContext,
  any
> = new GraphQLObjectType({
  name: 'Business',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    countryCode: { type: GraphQLString },
    facebookUrl: { type: GraphQLString },
    owner: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: async (root, args, context): Promise<User> => {
        const user = await findUserById({ id: root.userId }, context);

        if (!user) throw new Error('Could not find user');

        return user;
      },
    },
    assignedLocations: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLLocation)),
      ),
      resolve: async (root, args, context) => {
        const locations = await findLocations({}, context);

        const businessMember = await findBusinessMemberByUserIdAndBusinessId(
          { userId: extractUserId(context), businessId: root.id },
          context,
        );
        if (businessMember) return locations;

        const employees = await findEmployeesByUserId(
          { userId: extractUserId(context) },
          context,
        );

        const locationIds = employees.map(bl => bl.locationId);

        return locations.filter(bl => {
          return locationIds.includes(bl.id);
        });
      },
    },
    locations: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLLocation)),
      ),
    },
    logoImage: {
      type: GraphQLImage,

      resolve: (root, args, context) =>
        root.logoImageId
          ? findImageById({ id: root.logoImageId }, context)
          : null,
    },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
    deletedAt: { type: GraphQLDate },
  }),
});

export const CreateBusinessMutation = makeMutation({
  name: 'CreateBusiness',
  inputFields: {
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    logoImageId: { type: GraphQLID },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    countryCode: { type: GraphQLString },
    facebookUrl: { type: GraphQLString },
  },
  outputFields: {
    business: { type: GraphQLBusiness },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: CreateBusinessInput, context: RequestContext) =>
    createBusiness(input, context),
});

export const UpdateBusinessMutation = makeMutation({
  name: 'UpdateBusiness',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    logoImageId: { type: GraphQLID },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    countryCode: { type: GraphQLString },
    facebookUrl: { type: GraphQLString },
  },
  outputFields: {
    business: { type: GraphQLBusiness },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: UpdateBusinessInput, context: RequestContext) =>
    updateBusiness(input, context),
});

export const DeleteBusinessMutation = makeMutation({
  name: 'DeleteBusiness',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    business: { type: GraphQLBusiness },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: DeleteBusinessInput, context: RequestContext) =>
    deleteBusiness(input, context),
});

export const CurrentBusinessQuery = makeQuery({
  type: GraphQLBusiness,
  resolve: async (root: {}, args: {}, context: RequestContext) =>
    context && context.business
      ? findBusinessById({ id: context.business.id }, context)
      : null,
});
