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
  MarkNoShowAppointmentInput,
  markNoShowAppointment,
  CreateAppointmentInput,
  createAppointmentByMember,
  UpdateAppointmentInput,
  updateAppointmentByMember,
  CancelAppointmentInput,
  cancelAppointmentByMember,
  checkOutAppointment,
  CheckOutAppointmentInput,
  QueryFindAppointmentByIdArgs,
  findAppointmentById,
  QueryFindAppointmentsArgs,
  findActiveAppointments,
} from '@kedul/service-appointment';

import {
  GraphQLUserError,
  GraphQLDate,
  GraphQLCalendarEventRecurrenceInput,
  GraphQLCalendarEventRecurrence,
  GraphQLApplyRecurrence,
} from './GraphQLCommon';
import { GraphQLEmployee } from './GraphQLEmployee';
import { GraphQLClient } from './GraphQLClient';
import { GraphQLService } from './GraphQLService';
import { GraphQLLocation } from './GraphQLLocation';
import { GraphQLInvoice } from './GraphQLInvoice';
import { makeQuery, makeMutation } from './GraphQLUtils';

const GraphQLAppointmentService = new GraphQLObjectType({
  name: 'AppointmentService',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    appointment: { type: new GraphQLNonNull(GraphQLAppointment) },
    clientNumber: { type: new GraphQLNonNull(GraphQLInt) },
    duration: { type: new GraphQLNonNull(GraphQLInt) },
    isEmployeeRequestedByClient: { type: new GraphQLNonNull(GraphQLBoolean) },
    order: { type: new GraphQLNonNull(GraphQLInt) },
    service: { type: new GraphQLNonNull(GraphQLService) },
    startDate: { type: new GraphQLNonNull(GraphQLDate) },
    employee: { type: GraphQLEmployee },
    client: { type: GraphQLClient },
  }),
});

const GraphQLAppointment: GraphQLObjectType = new GraphQLObjectType({
  name: 'Appointment',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    services: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLAppointmentService)),
      ),
    },
    recurrence: { type: GraphQLAppointmentRecurrence },
    location: { type: new GraphQLNonNull(GraphQLLocation) },

    client: { type: GraphQLClient },
    invoice: { type: GraphQLInvoice },
    internalNotes: { type: GraphQLString },
    clientNotes: { type: GraphQLString },
    cancellationReason: { type: GraphQLString },
    reference: { type: GraphQLString },
    status: { type: new GraphQLNonNull(GraphQLAppointmentStatus) },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
    canceledAt: { type: GraphQLDate },
    checkedOutAt: { type: GraphQLDate },
    markedNoShowAt: { type: GraphQLDate },
  }),
});

const GraphQLAppointmentStatus = new GraphQLEnumType({
  name: 'AppointmentStatus',
  values: {
    NEW: { value: 'NEW' },
    CONFIRMED: { value: 'CONFIRMED' },
    ARRIVED: { value: 'ARRIVED' },
    STARTED: { value: 'STARTED' },
  },
});

const GraphQLAppointmentRecurrence: GraphQLObjectType = new GraphQLObjectType({
  name: 'AppointmentRecurrence',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    initialAppointment: { type: new GraphQLNonNull(GraphQLAppointment) },
    recurrence: { type: new GraphQLNonNull(GraphQLCalendarEventRecurrence) },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
  }),
});

export const CheckOutAppointmentMutation = makeMutation({
  name: 'CheckOutAppointment',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    invoiceId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    appointment: { type: GraphQLAppointment },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: CheckOutAppointmentInput,
    context: RequestContext,
  ) => checkOutAppointment(input, context),
});

const GraphQLAppointmentServiceInput = new GraphQLInputObjectType({
  name: 'AppointmentServiceInput',
  fields: () => ({
    clientNumber: { type: new GraphQLNonNull(GraphQLInt) },
    duration: { type: new GraphQLNonNull(GraphQLInt) },
    isEmployeeRequestedByClient: { type: new GraphQLNonNull(GraphQLBoolean) },
    order: { type: new GraphQLNonNull(GraphQLInt) },
    serviceId: { type: new GraphQLNonNull(GraphQLID) },
    startDate: { type: new GraphQLNonNull(GraphQLDate) },
    id: { type: GraphQLID },
    employeeId: { type: GraphQLID },
    clientId: { type: GraphQLID },
  }),
});

export const UpdateAppointmentMutation = makeMutation({
  name: 'UpdateAppointment',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    services: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLAppointmentServiceInput)),
    },
    internalNotes: { type: GraphQLString },
    clientId: { type: GraphQLID },
    clientNotes: { type: GraphQLString },
    status: { type: GraphQLAppointmentStatus },
    canceledAt: { type: GraphQLDate },
    cancellationReason: { type: GraphQLString },

    // if only recurrence is given it should update the recurrence
    recurrence: { type: GraphQLCalendarEventRecurrenceInput },

    // if recurrence is given but applyRecurrence=ONLY_THIS_ONE
    // it will ignore recurrence
    applyRecurrence: { type: GraphQLApplyRecurrence },
  },
  outputFields: {
    appointment: { type: GraphQLAppointment },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: UpdateAppointmentInput,
    context: RequestContext,
  ) => updateAppointmentByMember(input, context),
});

export const CancelAppointmentMutation = makeMutation({
  name: 'CancelAppointment',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    applyRecurrence: { type: GraphQLApplyRecurrence },
    cancellationReason: { type: GraphQLString },
  },
  outputFields: {
    appointment: { type: GraphQLAppointment },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: CancelAppointmentInput,
    context: RequestContext,
  ) => cancelAppointmentByMember(input, context),
});

export const MarkNoShowAppointmentMutation = makeMutation({
  name: 'MarkNoShowAppointment',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    appointment: { type: GraphQLAppointment },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: MarkNoShowAppointmentInput,
    context: RequestContext,
  ) => markNoShowAppointment(input, context),
});

export const CreateAppointmentMutation = makeMutation({
  name: 'CreateAppointment',
  inputFields: {
    id: { type: GraphQLID },
    services: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLAppointmentServiceInput)),
      ),
    },
    locationId: { type: new GraphQLNonNull(GraphQLID) },
    internalNotes: { type: GraphQLString },
    recurrence: { type: GraphQLCalendarEventRecurrenceInput },
    clientId: { type: GraphQLID },
  },
  outputFields: {
    appointment: { type: GraphQLAppointment },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: CreateAppointmentInput,
    context: RequestContext,
  ) => createAppointmentByMember(input, context),
});

const GraphQLAppointmentsFilter = new GraphQLInputObjectType({
  name: 'AppointmentsFilterInput',
  fields: () => ({
    startDate: { type: GraphQLDate },
    endDate: { type: GraphQLDate },
    locationId: { type: GraphQLID },
    employeeId: { type: GraphQLID },
    serviceId: { type: GraphQLID },
    clientId: { type: GraphQLID },
    appointmentRecurrenceId: { type: GraphQLID },
  }),
});

export const AppointmentQuery = makeQuery({
  type: GraphQLAppointment,
  args: {
    id: { type: GraphQLID },
  },
  resolve: (
    root: {},
    args: QueryFindAppointmentByIdArgs,
    context: RequestContext,
  ) => findAppointmentById(args, context),
});

export const AppointmentsQuery = makeQuery({
  type: new GraphQLNonNull(
    new GraphQLList(new GraphQLNonNull(GraphQLAppointment)),
  ),
  args: {
    filter: { type: GraphQLID },
  },
  resolve: (
    root: {},
    args: QueryFindAppointmentsArgs,
    context: RequestContext,
  ) => findActiveAppointments(args, context),
});
