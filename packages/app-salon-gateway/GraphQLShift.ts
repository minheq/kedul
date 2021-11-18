import {
  GraphQLBoolean,
  GraphQLEnumType,
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
  findEmployeeById,
  findShiftById,
  findShifts,
  QueryFindShiftByIdArgs,
  CancelShiftInput,
  cancelShift,
  UpdateShiftInput,
  updateShift,
  createShift,
  CreateShiftInput,
  QueryFindShiftsArgs,
} from '@kedul/service-employee';
import { findLocationById } from '@kedul/service-location';

import {
  GraphQLUserError,
  GraphQLDate,
  GraphQLCalendarEventRecurrenceInput,
  GraphQLApplyRecurrence,
  GraphQLCalendarEventRecurrence,
} from './GraphQLCommon';
import { GraphQLLocation } from './GraphQLLocation';
import { GraphQLEmployee } from './GraphQLEmployee';
import { makeQuery, makeMutation } from './GraphQLUtils';

const GraphQLShiftStatus = new GraphQLEnumType({
  name: 'ShiftStatus',
  values: {
    DRAFT: { value: 'DRAFT' },
    PUBLISHED: { value: 'PUBLISHED' },
    CONFIRMED: { value: 'CONFIRMED' },
    STARTED: { value: 'STARTED' },
    COMPLETED: { value: 'COMPLETED' },
    CALLED_SICK: { value: 'CALLED_SICK' },
  },
});

const GraphQLShiftRecurrence = new GraphQLObjectType({
  name: 'ShiftRecurrence',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    initialShift: { type: new GraphQLNonNull(GraphQLShift) },
    recurrence: { type: new GraphQLNonNull(GraphQLCalendarEventRecurrence) },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
  }),
});

export const GraphQLShift: GraphQLObjectType = new GraphQLObjectType({
  name: 'Shift',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    recurrence: { type: GraphQLShiftRecurrence },
    breakDuration: { type: new GraphQLNonNull(GraphQLInt) },
    startDate: { type: new GraphQLNonNull(GraphQLDate) },
    endDate: { type: new GraphQLNonNull(GraphQLDate) },
    notes: { type: GraphQLString },
    employee: {
      type: new GraphQLNonNull(GraphQLEmployee),
      resolve: async (root, args, context) => {
        const employee = await findEmployeeById(
          { id: root.employeeId },
          context,
        );

        if (!employee) throw new Error('Could not find employee');

        return employee;
      },
    },
    location: {
      type: new GraphQLNonNull(GraphQLLocation),
      resolve: async (root, args, context) => {
        const location = await findLocationById(
          { id: root.locationId },
          context,
        );

        if (!location) throw new Error('Could not find location');

        return location;
      },
    },
    status: { type: new GraphQLNonNull(GraphQLShiftStatus) },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
    canceledAt: { type: GraphQLDate },
    startedAt: { type: GraphQLDate },
    completedAt: { type: GraphQLDate },
    markedNoShowAt: { type: GraphQLDate },
  }),
});

export const CreateShiftMutation = makeMutation({
  name: 'CreateShift',
  inputFields: {
    id: { type: GraphQLID },
    recurrence: { type: GraphQLCalendarEventRecurrenceInput },
    locationId: { type: new GraphQLNonNull(GraphQLID) },
    employeeId: { type: new GraphQLNonNull(GraphQLID) },
    breakDuration: { type: GraphQLInt },
    startDate: { type: new GraphQLNonNull(GraphQLDate) },
    endDate: { type: new GraphQLNonNull(GraphQLDate) },
    notes: { type: GraphQLString },
    status: { type: GraphQLShiftStatus },
  },
  outputFields: {
    shift: { type: GraphQLShift },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: CreateShiftInput, context: RequestContext) =>
    createShift(input, context),
});

export const UpdateShiftMutation = makeMutation({
  name: 'UpdateShift',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    recurrence: { type: GraphQLCalendarEventRecurrenceInput },
    locationId: { type: GraphQLID },
    employeeId: { type: new GraphQLNonNull(GraphQLID) },
    breakDuration: { type: GraphQLInt },
    startDate: { type: new GraphQLNonNull(GraphQLDate) },
    endDate: { type: new GraphQLNonNull(GraphQLDate) },
    notes: { type: GraphQLString },
    canceledAt: { type: GraphQLDate },
    status: { type: GraphQLShiftStatus },
    applyRecurrence: { type: new GraphQLNonNull(GraphQLApplyRecurrence) },
  },
  outputFields: {
    shift: { type: GraphQLShift },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: UpdateShiftInput, context: RequestContext) =>
    updateShift(input, context),
});

export const CancelShiftMutation = makeMutation({
  name: 'CancelShift',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    applyRecurrence: { type: new GraphQLNonNull(GraphQLApplyRecurrence) },
  },
  outputFields: {
    shift: { type: GraphQLShift },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: CancelShiftInput, context: RequestContext) =>
    cancelShift(input, context),
});

export const GraphQLShiftsFilter = new GraphQLInputObjectType({
  name: 'ShiftsFilter',
  fields: () => ({
    startDate: { type: new GraphQLNonNull(GraphQLDate) },
    endDate: { type: new GraphQLNonNull(GraphQLDate) },
    status: { type: GraphQLShiftStatus },
  }),
});

export const ShiftQuery = makeQuery({
  type: GraphQLShift,
  args: {
    id: { type: GraphQLID },
  },
  resolve: (root: {}, args: QueryFindShiftByIdArgs, context: RequestContext) =>
    findShiftById(args, context),
});

export const ShiftsQuery = makeQuery({
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLShift))),
  args: {
    locationId: { type: new GraphQLNonNull(GraphQLID) },
    filter: { type: new GraphQLNonNull(GraphQLShiftsFilter) },
  },
  resolve: (
    root: {},
    args: QueryFindShiftsArgs & { locationId: string },
    context: RequestContext,
  ) =>
    findShifts(
      { filter: { ...args.filter, locationId: args.locationId } },
      context,
    ),
});
