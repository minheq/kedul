import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { RequestContext } from '@kedul/common-server';
import { findBusinessById } from '@kedul/service-business';
import { findEmployees, findEmployeeRoles } from '@kedul/service-employee';
import {
  findLocationById,
  QueryFindLocationByIdArgs,
  findLocations,
  deleteLocation,
  DeleteLocationInput,
  updateLocation,
  UpdateLocationInput,
  createLocation,
  CreateLocationInput,
} from '@kedul/service-location';

import {
  GraphQLContactDetails,
  GraphQLAddress,
  GraphQLCalendarEvent,
  GraphQLUserError,
  GraphQLContactDetailsInput,
  GraphQLAddressInput,
  GraphQLCalendarEventInput,
  GraphQLDate,
} from './GraphQLCommon';
import { GraphQLBusiness } from './GraphQLBusiness';
import { GraphQLEmployee, GraphQLEmployeeRole } from './GraphQLEmployee';
import { makeQuery, makeMutation } from './GraphQLUtils';

export const GraphQLLocation: GraphQLObjectType = new GraphQLObjectType({
  name: 'Location',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    contactDetails: { type: GraphQLContactDetails },
    address: { type: GraphQLAddress },
    businessHours: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLCalendarEvent)),
    },
    employees: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLEmployee)),
      ),
      resolve: async (root, args, context) =>
        findEmployees({ locationId: root.id }, context),
    },
    employeeRoles: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLEmployeeRole)),
      ),
      resolve: async (root, args, context) =>
        findEmployeeRoles({ locationId: root.id }, context),
    },
    business: {
      type: new GraphQLNonNull(GraphQLBusiness),
      resolve: async (root, args, context) => {
        const business = await findBusinessById(
          { id: root.businessId },
          context,
        );

        if (!business) throw new Error('Could not find business');

        return business;
      },
    },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    deletedAt: { type: GraphQLDate },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
  }),
});

export const CreateLocationMutation = makeMutation({
  name: 'CreateLocation',
  inputFields: {
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: GraphQLAddressInput },
    contactDetails: { type: GraphQLContactDetailsInput },
    businessHours: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLCalendarEventInput)),
    },
  },
  outputFields: {
    location: { type: GraphQLLocation },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: CreateLocationInput, context: RequestContext) =>
    createLocation(input, context),
});

export const UpdateLocationMutation = makeMutation({
  name: 'UpdateLocation',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    contactDetails: { type: GraphQLContactDetailsInput },
    address: { type: GraphQLAddressInput },
    businessHours: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLCalendarEventInput)),
    },
  },
  outputFields: {
    location: { type: GraphQLLocation },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: UpdateLocationInput, context: RequestContext) =>
    updateLocation(input, context),
});

export const DeleteLocationMutation = makeMutation({
  name: 'DeleteLocation',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    location: { type: GraphQLLocation },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: DeleteLocationInput, context: RequestContext) =>
    deleteLocation(input, context),
});

export const LocationQuery = makeQuery({
  type: GraphQLLocation,
  args: {
    id: { type: GraphQLID },
  },
  resolve: (
    root: {},
    args: QueryFindLocationByIdArgs,
    context: RequestContext,
  ) => findLocationById(args, context),
});

export const LocationsQuery = makeQuery({
  type: new GraphQLNonNull(
    new GraphQLList(new GraphQLNonNull(GraphQLLocation)),
  ),
  resolve: (root: {}, args: {}, context: RequestContext) =>
    findLocations({}, context),
});
