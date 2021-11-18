import {
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
  Kind,
  GraphQLInt,
  GraphQLID,
} from 'graphql';
import { RequestContext } from '@kedul/common-server';
import { UserProfile } from '@kedul/service-user';
import { findImageById } from '@kedul/service-image';

import { GraphQLImage } from './GraphQLImage';

export const GraphQLDate = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',

  parseValue(value) {
    return new Date(value); // value from the client
  },

  serialize(value) {
    return value.getTime(); // value sent to the client
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value); // ast value is always in string format
    }
    return null;
  },
});

export const GraphQLUserError = new GraphQLObjectType({
  name: 'UserError',
  fields: () => ({
    code: { type: new GraphQLNonNull(GraphQLString) },
    message: { type: new GraphQLNonNull(GraphQLString) },
    errors: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLValidationError)),
      ),
    },
  }),
});

export const GraphQLValidationError = new GraphQLObjectType({
  name: 'ValidationError',
  fields: () => ({
    field: { type: new GraphQLNonNull(GraphQLString) },
    message: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const GraphQLApplyRecurrence = new GraphQLEnumType({
  name: 'ApplyRecurrence',
  values: {
    ONLY_THIS_ONE: { value: 'ONLY_THIS_ONE' },
    THIS_AND_FOLLOWING: { value: 'THIS_AND_FOLLOWING' },
    ALL: { value: 'ALL' },
  },
});

export const GraphQLCalendarEventRecurrenceFrequency = new GraphQLEnumType({
  name: 'CalendarEventRecurrenceFrequency',
  values: {
    YEARLY: { value: 'YEARLY' },
    MONTHLY: { value: 'MONTHLY' },
    WEEKLY: { value: 'WEEKLY' },
    DAILY: { value: 'DAILY' },
  },
});

export const GraphQLCalendarEventInput = new GraphQLInputObjectType({
  name: 'CalendarEventInput',
  fields: () => ({
    startDate: { type: new GraphQLNonNull(GraphQLDate) },
    endDate: { type: new GraphQLNonNull(GraphQLDate) },
    recurrence: { type: GraphQLCalendarEventRecurrenceInput },
  }),
});

export const GraphQLCalendarEventRecurrence: GraphQLObjectType = new GraphQLObjectType(
  {
    name: 'CalendarEventRecurrence',
    fields: () => ({
      startDate: { type: new GraphQLNonNull(GraphQLDate) },
      frequency: {
        type: new GraphQLNonNull(GraphQLCalendarEventRecurrenceFrequency),
      },
      interval: { type: GraphQLInt },
      count: { type: GraphQLInt },
      weekStart: { type: GraphQLInt },
      until: { type: GraphQLDate },
      timezoneId: { type: GraphQLID },
      bySetPosition: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
      byMonth: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
      byMonthDay: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
      byYearDay: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
      byWeekNumber: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
      byWeekDay: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
      byHour: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
      byMinute: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
      bySecond: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    }),
  },
);

export const GraphQLCalendarEventRecurrenceInput = new GraphQLInputObjectType({
  name: 'CalendarEventRecurrenceInput',
  fields: () => ({
    frequency: {
      type: new GraphQLNonNull(GraphQLCalendarEventRecurrenceFrequency),
    },
    interval: { type: GraphQLInt },
    count: { type: GraphQLInt },
    weekStart: { type: GraphQLInt },
    until: { type: GraphQLDate },
    timezoneId: { type: GraphQLID },
    bySetPosition: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    byMonth: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    byMonthDay: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    byYearDay: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    byWeekNumber: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    byWeekDay: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    byHour: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    byMinute: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    bySecond: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
  }),
});

export const GraphQLAddressInput = new GraphQLInputObjectType({
  name: 'AddressInput',
  fields: () => ({
    streetAddressOne: { type: GraphQLString },
    streetAddressTwo: { type: GraphQLString },
    district: { type: GraphQLString },
    city: { type: GraphQLString },
    country: { type: GraphQLString },
    postalCode: { type: GraphQLString },
  }),
});

export const GraphQLContactDetailsInput = new GraphQLInputObjectType({
  name: 'ContactDetailsInput',
  fields: () => ({
    phoneNumber: { type: GraphQLString },
    countryCode: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

export const GraphQLContactDetails: GraphQLObjectType = new GraphQLObjectType({
  name: 'ContactDetails',
  fields: () => ({
    phoneNumber: { type: GraphQLString },
    countryCode: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

export const GraphQLAddress: GraphQLObjectType = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
    streetAddressOne: { type: GraphQLString },
    streetAddressTwo: { type: GraphQLString },
    district: { type: GraphQLString },
    city: { type: GraphQLString },
    country: { type: GraphQLString },
    postalCode: { type: GraphQLString },
  }),
});

const GraphQLPersonGender = new GraphQLEnumType({
  name: 'GraphQLPersonGender',
  values: {
    MALE: { value: 'MALE' },
    FEMALE: { value: 'FEMALE' },
  },
});

export const GraphQLUserProfile: GraphQLObjectType<
  UserProfile,
  RequestContext
> = new GraphQLObjectType({
  name: 'UserProfile',
  fields: () => ({
    profileImage: {
      type: GraphQLImage,
      resolve: async (root, args, context) =>
        root.profileImageId
          ? findImageById({ id: root.profileImageId }, context)
          : null,
    },
    fullName: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: GraphQLDate },
    gender: { type: GraphQLPersonGender },
  }),
});

export const GraphQLUserProfileInput = new GraphQLInputObjectType({
  name: 'UserProfileInput',
  fields: () => ({
    profileImageId: { type: GraphQLID },
    fullName: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: GraphQLDate },
    gender: { type: GraphQLPersonGender },
  }),
});

export const GraphQLWeekDay = new GraphQLEnumType({
  name: 'WeekDay',
  values: {
    MONDAY: { value: 'MONDAY' },
    TUESDAY: { value: 'TUESDAY' },
    WEDNESDAY: { value: 'WEDNESDAY' },
    THURSDAY: { value: 'THURSDAY' },
    FRIDAY: { value: 'FRIDAY' },
    SATURDAY: { value: 'SATURDAY' },
    SUNDAY: { value: 'SUNDAY' },
  },
});

export const GraphQLCalendarEvent: GraphQLObjectType = new GraphQLObjectType({
  name: 'CalendarEvent',
  fields: () => ({
    startDate: { type: new GraphQLNonNull(GraphQLDate) },
    endDate: { type: new GraphQLNonNull(GraphQLDate) },
    recurrence: { type: GraphQLCalendarEventRecurrence },
  }),
});
