import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { RequestContext } from '@kedul/common-server';
import {
  logInSilent,
  LogInSilentInput,
  logInPhoneVerify,
  LogInPhoneVerifyInput,
  logInPhoneStart,
  LogInPhoneStartInput,
  logInEmailVerify,
  LogInEmailVerifyInput,
  logInEmailStart,
  LogInEmailStartInput,
  disconnectGoogle,
  DisconnectGoogleInput,
  logInGoogle,
  LogInGoogleInput,
  linkGoogleAccount,
  LinkGoogleAccountInput,
  logInFacebook,
  LogInFacebookInput,
} from '@kedul/service-user';

import { GraphQLUserError } from './GraphQLCommon';
import { makeMutation } from './GraphQLUtils';

export const LogInFacebookMutation = makeMutation({
  name: 'LogInFacebook',
  inputFields: {
    facebookAccessToken: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    accessToken: { type: GraphQLString },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: LogInFacebookInput, context: RequestContext) =>
    logInFacebook(input, context),
});

export const LinkGoogleAccountMutation = makeMutation({
  name: 'LinkGoogleAccount',
  inputFields: {
    googleIdToken: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: LinkGoogleAccountInput,
    context: RequestContext,
  ) => linkGoogleAccount(input, context),
});

export const LogInGoogleMutation = makeMutation({
  name: 'LogInGoogle',
  inputFields: {
    googleIdToken: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    accessToken: { type: GraphQLString },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: LogInGoogleInput, context: RequestContext) =>
    logInGoogle(input, context),
});

export const DisconnectGoogleMutation = makeMutation({
  name: 'DisconnectGoogle',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: DisconnectGoogleInput,
    context: RequestContext,
  ) => disconnectGoogle(input, context),
});

export const LogInEmailStartMutation = makeMutation({
  name: 'LogInEmailStart',
  inputFields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    state: { type: GraphQLString },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: LogInEmailStartInput, context: RequestContext) =>
    logInEmailStart(input, context),
});

export const LogInEmailVerifyMutation = makeMutation({
  name: 'LogInEmailVerify',
  inputFields: {
    code: { type: new GraphQLNonNull(GraphQLString) },
    state: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    accessToken: { type: GraphQLString },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: LogInEmailVerifyInput,
    context: RequestContext,
  ) => logInEmailVerify(input, context),
});

export const LogInPhoneStartMutation = makeMutation({
  name: 'LogInPhoneStart',
  inputFields: {
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    countryCode: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    state: { type: GraphQLString },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: LogInPhoneStartInput, context: RequestContext) =>
    logInPhoneStart(input, context),
});

export const LogInPhoneVerifyMutation = makeMutation({
  name: 'LogInPhoneVerify',
  inputFields: {
    code: { type: new GraphQLNonNull(GraphQLString) },
    state: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    accessToken: { type: GraphQLString },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: LogInPhoneVerifyInput,
    context: RequestContext,
  ) => logInPhoneVerify(input, context),
});

export const LogInSilentMutation = makeMutation({
  name: 'LogInSilent',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    accessToken: { type: GraphQLString },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: LogInSilentInput, context: RequestContext) =>
    logInSilent(input, context),
});
