import { extractUserId, publish, RequestContext } from '@kedul/common-server';
import {
  changeset,
  randomString,
  UserError,
  validateInputWithPhoneNumber,
} from '@kedul/common-utils';
import { PolicyEntity, PolicyResource } from '@kedul/service-permission';
import { sendBusinessMemberInvitation as sendBusinessMemberInvitationByPhone } from '@kedul/service-phone';
import { createNewPhoneUser, findUserByPhoneNumber } from '@kedul/service-user';
import { addDays } from 'date-fns';
import uuidv4 from 'uuid/v4';

import { Event, userErrors } from './BusinessMemberConstants';
import { BusinessMember } from './BusinessMemberTypes';
import { Business } from './BusinessTypes';
import { enhance } from './RequestContext';
import { BusinessMemberRole } from './BusinessMemberRoleTypes';
import { PredefinedBusinessMemberRoleName } from './BusinessMemberRoleMutations';

const makeSuccessPayload = (businessMember: BusinessMember) => ({
  businessMember,
  isSuccessful: true,
  userError: null,
});

const makeErrorPayload = (error: UserError) => ({
  businessMember: null,
  isSuccessful: false,
  userError: error,
});

const publishEvent = (
  event: string,
  businessMember: BusinessMember,
  context: RequestContext,
) =>
  publish(event, {
    aggregateId: businessMember.id,
    aggregateType: 'BUSINESS_MEMBER',
    data: businessMember,
    context,
  });

const getResource = (businessMember: BusinessMember): PolicyResource => ({
  entity: PolicyEntity.BUSINESS_MEMBER,
  entityId: businessMember.id,
  locationId: null,
});

interface WithBusinessId {
  businessId: string;
  userId: string;
}

const make = (
  input: InviteToBusinessInput & WithBusinessId,
): BusinessMember => {
  const businessMemberId = input.id || uuidv4();

  return {
    userId: input.userId,
    businessId: input.businessId,
    businessMemberRoleId: input.businessMemberRoleId,
    createdAt: new Date(),
    id: businessMemberId,
    updatedAt: new Date(),
    invitation: {
      businessMemberId,
      expirationDate: addDays(new Date(), 1),
      token: randomString(12),
    },
  };
};

const validatePhoneInvitation = async (input: InviteToBusinessInput) => {
  const error = await validateInputWithPhoneNumber(input);
  if (error) return error;

  return null;
};

const findOrCreateInvitedUserByPhone = async (
  input: {
    phoneNumber: string;
    countryCode: string;
  },
  context: RequestContext,
) => {
  const user = await findUserByPhoneNumber(input, context);

  if (!user) {
    return await createNewPhoneUser(input, context);
  }

  return user;
};

export interface InviteToBusinessInput {
  id?: string | null;
  phoneNumber: string;
  countryCode: string;
  businessMemberRoleId: string;
  businessId: string;
}

export const inviteToBusiness = async (
  input: InviteToBusinessInput,
  context: RequestContext,
) => {
  const { businessRepository, businessMemberRepository } = enhance(
    context,
  ).repositories;

  const error = await validatePhoneInvitation(input);
  if (error) return makeErrorPayload(error);

  // TODO: Verify input businessId matches context businessId
  const business = await businessRepository.getById(input.businessId);
  const invitedUser = await findOrCreateInvitedUserByPhone(input, context);
  const businessMember = await make({
    ...input,
    userId: invitedUser.id,
    businessId: business.id,
  });

  if (!invitedUser.account.phoneNumber) {
    throw new Error('Expected user phoneNumber');
  }
  if (!businessMember.invitation || !businessMember.invitation.token) {
    throw new Error('Expected invitation token');
  }

  await sendBusinessMemberInvitationByPhone(
    invitedUser.account.phoneNumber,
    {
      businessName: business.name,
      token: businessMember.invitation.token,
    },
    context,
  );

  await businessMemberRepository.saveOrUpdate(businessMember);
  publishEvent(Event.BUSINESS_MEMBER_INVITED, businessMember, context);

  return makeSuccessPayload(businessMember);
};

export interface UpdateBusinessMemberInput {
  id: string;
  businessMemberRoleId?: string | null;
}

export const updateBusinessMember = async (
  input: UpdateBusinessMemberInput,
  context: RequestContext,
) => {
  const { businessMemberRepository } = enhance(context).repositories;

  const prevBusinessMember = await businessMemberRepository.getById(input.id);
  const businessMember = await changeset(prevBusinessMember, input);

  await businessMemberRepository.update(businessMember);

  publishEvent(Event.BUSINESS_MEMBER_UPDATED, businessMember, context);

  return makeSuccessPayload(businessMember);
};

const acceptedChangeset = (
  prevBusinessMember: BusinessMember,
  context: RequestContext,
) => {
  const userId = extractUserId(context);

  return {
    ...prevBusinessMember,
    acceptedAt: new Date(),
    invitation: null,
    userId,
  };
};

export interface AcceptInvitationToBusinessInput {
  invitationToken: string;
}

export const acceptInvitationToBusiness = async (
  input: AcceptInvitationToBusinessInput,
  context: RequestContext,
) => {
  const { businessMemberRepository } = enhance(context).repositories;

  const prevBusinessMember = await businessMemberRepository.getByToken(
    input.invitationToken,
  );

  const businessMember = acceptedChangeset(prevBusinessMember, context);
  await businessMemberRepository.update(businessMember);

  publishEvent(
    Event.BUSINESS_MEMBER_INVITATION_ACCEPTED,
    businessMember,
    context,
  );

  return makeSuccessPayload(businessMember);
};

const validateCancelBusinessMemberInvitation = async (
  input: CancelBusinessMemberInvitationInput,
  businessMember: BusinessMember,
) => {
  if (businessMember.acceptedAt) {
    return userErrors.businessMemberAlreadyAcceptedInvite();
  }

  return null;
};

export interface CancelBusinessMemberInvitationInput {
  id: string;
}

export const cancelBusinessMemberInvitation = async (
  input: CancelBusinessMemberInvitationInput,
  context: RequestContext,
) => {
  const { businessMemberRepository } = enhance(context).repositories;

  const businessMember = await businessMemberRepository.getById(input.id);

  const error = await validateCancelBusinessMemberInvitation(
    input,
    businessMember,
  );
  if (error) return makeErrorPayload(error);

  await businessMemberRepository.remove(businessMember);

  publishEvent(Event.BUSINESS_MEMBER_INVITE_CANCELED, businessMember, context);

  return makeSuccessPayload(businessMember);
};

const validateChangeBusinessMemberRole = async (
  input: ChangeBusinessMemberRoleInput,
) => {
  if (input.role === PredefinedBusinessMemberRoleName.OWNER) {
    return userErrors.cannotChangeToOwner();
  }

  return null;
};

const changeRoleChangeset = (
  prevBusinessMember: BusinessMember,
  businessMemberRole: BusinessMemberRole,
): BusinessMember => {
  return {
    ...prevBusinessMember,
    businessMemberRoleId: businessMemberRole.id,
    updatedAt: new Date(),
  };
};

export interface ChangeBusinessMemberRoleInput {
  id: string;
  role: string;
}

export const changeBusinessMemberRole = async (
  input: ChangeBusinessMemberRoleInput,
  context: RequestContext,
) => {
  const { businessMemberRepository, businessMemberRoleRepository } = enhance(
    context,
  ).repositories;
  const prevBusinessMember = await businessMemberRepository.getById(input.id);

  const error = await validateChangeBusinessMemberRole(input);
  if (error) return makeErrorPayload(error);

  const businessMemberRole = await businessMemberRoleRepository.getByRole(
    input.role,
  );
  const businessMember = changeRoleChangeset(
    prevBusinessMember,
    businessMemberRole,
  );

  await businessMemberRepository.update(businessMember);

  publishEvent(Event.BUSINESS_MEMBER_ROLE_CHANGED, businessMember, context);
  return makeSuccessPayload(businessMember);
};

export interface RemoveBusinessMemberInput {
  id: string;
}

export const removeBusinessMember = async (
  input: RemoveBusinessMemberInput,
  context: RequestContext,
) => {
  const { businessMemberRepository } = enhance(context).repositories;

  const businessMember = await businessMemberRepository.getById(input.id);

  await businessMemberRepository.remove(businessMember);

  publishEvent(Event.BUSINESS_MEMBER_REMOVED, businessMember, context);

  return makeSuccessPayload(businessMember);
};

const makeOwner = (
  business: Business,
  businessMemberRoleId: string,
): BusinessMember => {
  return {
    acceptedAt: null,
    businessId: business.id,
    businessMemberRoleId,
    createdAt: new Date(),
    deletedAt: null,
    id: uuidv4(),
    invitation: null,
    updatedAt: new Date(),
    userId: business.userId,
  };
};

interface CreateOwnerInput {
  business: Business;
  ownerRole: BusinessMemberRole;
}

export const createOwner = async (
  input: CreateOwnerInput,
  context: RequestContext,
) => {
  const { businessMemberRepository } = enhance(context).repositories;
  const { business, ownerRole } = input;

  const owner = makeOwner(business, ownerRole.id);
  await businessMemberRepository.save(owner);

  publishEvent(Event.OWNER_CREATED, owner, context);

  return makeSuccessPayload(owner);
};
