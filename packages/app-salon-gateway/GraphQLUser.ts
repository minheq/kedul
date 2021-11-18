import { uniq } from 'lodash';
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { ActorType, RequestContext } from '@kedul/common-server';
import {
  findBusinessesByIds,
  findBusinessMembersByUserId,
} from '@kedul/service-business';
import {
  findEmployeesByUserId,
  findEmployeeInvitationsByUserId,
} from '@kedul/service-employee';
import {
  findUserById,
  deactivateUser,
  DeactivateUserInput,
  updateUserProfile,
  UpdateUserProfileInput,
  updateUserPhoneVerify,
  UpdateUserPhoneVerifyInput,
  updateUserPhoneStart,
  UpdateUserPhoneStartInput,
  updateUserEmailVerify,
  UpdateUserEmailVerifyInput,
  updateUserEmailStart,
  UpdateUserEmailStartInput,
  disconnectFacebook,
  DisconnectFacebookInput,
  linkFacebookAccount,
  LinkFacebookAccountInput,
  User,
} from '@kedul/service-user';
import { findPoliciesByUserId } from '@kedul/service-permission';

import {
  GraphQLUserError,
  GraphQLDate,
  GraphQLUserProfile,
  GraphQLUserProfileInput,
} from './GraphQLCommon';
import { GraphQLPolicy } from './GraphQLPermissions';
import { GraphQLBusiness } from './GraphQLBusiness';
import { GraphQLEmployeeInvitation } from './GraphQLEmployee';
import { makeQuery, makeMutation } from './GraphQLUtils';

export const GraphQLUser: GraphQLObjectType<
  User,
  RequestContext,
  any
> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    profile: { type: GraphQLUserProfile },
    account: { type: new GraphQLNonNull(GraphQLUserAccount) },
    isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
    businesses: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLBusiness)),
      ),
      resolve: async (root, args, context) => {
        const employees = await findEmployeesByUserId(
          { userId: root.id },
          context,
        );
        const employeeBusinessIds = employees.map(sm => sm.businessId);

        const businessMembers = await findBusinessMembersByUserId(
          { userId: root.id },
          context,
        );
        const businessMemberBusinessIds = businessMembers.map(
          bm => bm.businessId,
        );

        return findBusinessesByIds(
          {
            ids: uniq(employeeBusinessIds.concat(businessMemberBusinessIds)),
          },
          context,
        );
      },
    },
    employeeInvitations: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLEmployeeInvitation)),
      ),
      resolve: (root, args, context) =>
        findEmployeeInvitationsByUserId({ userId: root.id }, context),
    },
    policies: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLPolicy)),
      ),
      resolve: (root, args, context) =>
        findPoliciesByUserId({ userId: root.id }, context),
    },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
  }),
});

const GraphQLUserAccount: GraphQLObjectType = new GraphQLObjectType({
  name: 'UserAccount',
  fields: () => ({
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    countryCode: { type: GraphQLString },
    isEmailVerified: { type: new GraphQLNonNull(GraphQLBoolean) },
    isPhoneVerified: { type: new GraphQLNonNull(GraphQLBoolean) },
    socialIdentities: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLSocialIdentity)),
      ),
    },
    logins: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLAccountLogin)),
      ),
    },
  }),
});

const GraphQLAccountLogin: GraphQLObjectType = new GraphQLObjectType({
  name: 'AccountLogin',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    key: { type: new GraphQLNonNull(GraphQLString) },
    claim: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
  }),
});

const GraphQLSocialIdentity: GraphQLObjectType = new GraphQLObjectType({
  name: 'SocialIdentity',
  fields: () => ({
    provider: { type: new GraphQLNonNull(GraphQLString) },
    providerUserId: { type: new GraphQLNonNull(GraphQLString) },
    profileData: { type: GraphQLString },
  }),
});

export const UpdateUserEmailStartMutation = makeMutation({
  name: 'UpdateUserEmailStart',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: UpdateUserEmailStartInput,
    context: RequestContext,
  ) => updateUserEmailStart(input, context),
});

export const UpdateUserEmailVerifyMutation = makeMutation({
  name: 'UpdateUserEmailVerify',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    code: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: { type: GraphQLUser },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: UpdateUserEmailVerifyInput,
    context: RequestContext,
  ) => updateUserEmailVerify(input, context),
});

export const UpdateUserPhoneStartMutation = makeMutation({
  name: 'UpdateUserPhoneStart',
  inputFields: {
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    countryCode: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: UpdateUserPhoneStartInput,
    context: RequestContext,
  ) => updateUserPhoneStart(input, context),
});

export const UpdateUserPhoneVerifyMutation = makeMutation({
  name: 'UpdateUserPhoneVerify',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    code: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    countryCode: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: { type: GraphQLUser },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: UpdateUserPhoneVerifyInput,
    context: RequestContext,
  ) => updateUserPhoneVerify(input, context),
});

export const UpdateUserProfileMutation = makeMutation({
  name: 'UpdateUserProfile',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    profile: { type: GraphQLUserProfileInput },
  },
  outputFields: {
    user: { type: GraphQLUser },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: UpdateUserProfileInput,
    context: RequestContext,
  ) => updateUserProfile(input, context),
});

export const DeactivateUserMutation = makeMutation({
  name: 'DeactivateUser',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: DeactivateUserInput, context: RequestContext) =>
    deactivateUser(input, context),
});

export const LinkFacebookAccountMutation = makeMutation({
  name: 'LinkFacebookAccount',
  inputFields: {
    facebookAccessToken: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: LinkFacebookAccountInput,
    context: RequestContext,
  ) => linkFacebookAccount(input, context),
});

export const DisconnectFacebookMutation = makeMutation({
  name: 'DisconnectFacebook',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: DisconnectFacebookInput,
    context: RequestContext,
  ) => disconnectFacebook(input, context),
});

export const CurrentUserQuery = makeQuery({
  type: GraphQLUser,
  resolve: async (root: {}, args: {}, context: RequestContext) =>
    context && context.actor && context.actor.type === ActorType.USER
      ? findUserById({ id: context.actor.userId }, context)
      : null,
});
