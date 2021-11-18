import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { RequestContext } from '@kedul/common-server';
import {
  QueryFindServiceByIdArgs,
  QueryFindServiceCategoryByIdArgs,
  deleteServiceCategory,
  DeleteServiceCategoryInput,
  updateServiceCategory,
  UpdateServiceCategoryInput,
  createServiceCategory,
  CreateServiceCategoryInput,
  DeleteServiceInput,
  deleteService,
  UpdateServiceInput,
  updateService,
  CreateServiceInput,
  createService,
} from '@kedul/service-service';

import { GraphQLUserError, GraphQLDate } from './GraphQLCommon';
import { GraphQLImage } from './GraphQLImage';
import { GraphQLLocation } from './GraphQLLocation';
import { makeMutation, makeQuery } from './GraphQLUtils';

export const GraphQLService: GraphQLObjectType = new GraphQLObjectType({
  name: 'Service',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    serviceCategory: { type: GraphQLServiceCategory },
    primaryImage: { type: GraphQLImage },
    images: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLImage)),
      ),
    },
    location: { type: new GraphQLNonNull(GraphQLLocation) },
    pricingOptions: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLServicePricingOption)),
      ),
    },

    //Questions to ask client during appointment booking process
    questionsForClient: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString)),
      ),
    },

    // Time before/after the appointment that is unavailable for booking.
    paddingTime: { type: GraphQLServicePaddingTime },

    // Processing time after the service lets you create a bookable space for another client between two services (e.g. color and cut)
    // For example: { type: the service length is listed as 90 minutes on your menu, 60 minutes for the service with a 30 min processing time at the end of the service.},
    // You attend to client #1 and finish the service. ClientType #1 waits for 30 mins (e.g. for color processing) before any other service starts. During the processing time you are free to take client #2
    processingTimeAfterServiceEnd: { type: GraphQLInt },

    // Processing time during the service lets you create a bookable space for another client in the middle of a single service
    // For example: { type: the service length is listed as 90 minutes on your menu, 60 minutes spent on the client with a 30 minute processing time after 20 mins.},
    // You attend to client #1 for 20 mins then client #1 waits for 30 mins (e.g. for color processing). During this time you take care of client #2 and then finish the service with client #1
    processingTimeDuringService: {
      type: GraphQLServiceProcessingTimeDuringServiceEnd,
    },

    // How many clients can be served in parallel for this service
    parallelClientsCount: { type: GraphQLInt },

    // Time slots for which clients can book in minutes (e.g. With 15min intervals, they can book appointments at 9:00, 9:30, 9:45, etc.)
    intervalTime: { type: GraphQLInt },
    noteToClient: { type: GraphQLString },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
    deletedAt: { type: GraphQLDate },

    // MAYBE
    // clientRequirement: { type: Male only, female only?},
    // color: { type: GraphQLString},
  }),
});

export const GraphQLServiceCategory = new GraphQLObjectType({
  name: 'ServiceCategory',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
  }),
});

const GraphQLServicePaddingTimeType = new GraphQLEnumType({
  name: 'ServicePaddingTimeType',
  values: {
    BEFORE: { value: 'BEFORE' },
    AFTER: { value: 'AFTER' },
    BEFORE_AND_AFTER: { value: 'BEFORE_AND_AFTER' },
  },
});

const GraphQLServicePaddingTime = new GraphQLObjectType({
  name: 'ServicePaddingTime',
  fields: () => ({
    type: { type: new GraphQLNonNull(GraphQLServicePaddingTimeType) },

    // Duration in minutes
    duration: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const GraphQLServiceProcessingTimeDuringServiceEnd = new GraphQLObjectType({
  name: 'ServiceProcessingTimeDuringServiceEnd',
  fields: () => ({
    after: { type: new GraphQLNonNull(GraphQLInt) },
    duration: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const GraphQLServicePricingOption = new GraphQLObjectType({
  name: 'ServicePricingOption',
  fields: () => ({
    duration: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    type: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const GraphQLServiceProcessingTimeDuringServiceEndInput = new GraphQLInputObjectType(
  {
    name: 'ServiceProcessingTimeDuringServiceEndInput',
    fields: () => ({
      // After how much time in minutes
      after: { type: new GraphQLNonNull(GraphQLInt) },

      // Duration in minutes
      duration: { type: new GraphQLNonNull(GraphQLInt) },
    }),
  },
);

const GraphQLServicePricingOptionInput = new GraphQLInputObjectType({
  name: 'ServicePricingOptionInput',
  fields: () => ({
    duration: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    type: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const GraphQLServicePaddingTimeInput = new GraphQLInputObjectType({
  name: 'ServicePaddingTimeInput',
  fields: () => ({
    type: { type: new GraphQLNonNull(GraphQLServicePaddingTimeType) },

    // Duration in minutes
    duration: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const CreateServiceMutation = makeMutation({
  name: 'CreateService',
  inputFields: {
    id: { type: GraphQLID },

    // Name of the service
    name: { type: new GraphQLNonNull(GraphQLString) },
    pricingOptions: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLServicePricingOptionInput)),
      ),
    },
    locationId: { type: new GraphQLNonNull(GraphQLID) },
    serviceCategoryId: { type: GraphQLID },
    description: { type: GraphQLString },
    paddingTime: { type: GraphQLServicePaddingTimeInput },
    processingTimeAfterServiceEnd: { type: GraphQLInt },
    processingTimeDuringService: {
      type: GraphQLServiceProcessingTimeDuringServiceEndInput,
    },
    parallelClientsCount: { type: GraphQLInt },
    intervalTime: { type: GraphQLInt },
    noteToClient: { type: GraphQLString },
    questionsForClient: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString)),
      ),
    },
    primaryImageId: { type: GraphQLID },
    imageIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))),
    },
  },
  outputFields: {
    service: { type: GraphQLService },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: CreateServiceInput, context: RequestContext) =>
    createService(input, context),
});

export const UpdateServiceMutation = makeMutation({
  name: 'UpdateService',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    serviceCategoryId: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    pricingOptions: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLServicePricingOptionInput)),
      ),
    },
    paddingTime: { type: GraphQLServicePaddingTimeInput },
    processingTimeAfterServiceEnd: { type: GraphQLInt },
    processingTimeDuringService: {
      type: GraphQLServiceProcessingTimeDuringServiceEndInput,
    },
    parallelClientsCount: { type: GraphQLInt },
    intervalTime: { type: GraphQLInt },
    noteToClient: { type: GraphQLString },
    questionsForClient: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString)),
      ),
    },
    primaryImageId: { type: GraphQLID },
    imageIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))),
    },
  },
  outputFields: {
    service: { type: GraphQLService },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: UpdateServiceInput, context: RequestContext) =>
    updateService(input, context),
});

export const DeleteServiceMutation = makeMutation({
  name: 'DeleteService',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    service: { type: GraphQLService },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: DeleteServiceInput, context: RequestContext) =>
    deleteService(input, context),
});

export const CreateServiceCategoryMutation = makeMutation({
  name: 'CreateServiceCategory',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    serviceCategory: { type: GraphQLServiceCategory },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: CreateServiceCategoryInput,
    context: RequestContext,
  ) => createServiceCategory(input, context),
});

export const UpdateServiceCategoryMutation = makeMutation({
  name: 'UpdateServiceCategory',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    serviceCategory: { type: GraphQLServiceCategory },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: UpdateServiceCategoryInput,
    context: RequestContext,
  ) => updateServiceCategory(input, context),
});

export const DeleteServiceCategoryMutation = makeMutation({
  name: 'DeleteServiceCategory',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    serviceCategory: { type: GraphQLServiceCategory },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: DeleteServiceCategoryInput,
    context: RequestContext,
  ) => deleteServiceCategory(input, context),
});

export const ServiceQuery = makeQuery({
  type: GraphQLService,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (
    root: {},
    args: QueryFindServiceByIdArgs,
    context: RequestContext,
  ) => {
    return null;
  },
});

export const ServiceCategoryQuery = makeQuery({
  type: GraphQLServiceCategory,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (
    root: {},
    args: QueryFindServiceCategoryByIdArgs,
    context: RequestContext,
  ) => {
    return null;
  },
});
