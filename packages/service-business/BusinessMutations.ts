import { extractUserId, publish, RequestContext } from '@kedul/common-server';
import {
  changeset,
  UserError,
  validateInputWithEmail,
  validateInputWithPhoneNumber,
} from '@kedul/common-utils';
import {
  authorizeMember,
  PolicyAction,
  PolicyEntity,
  PolicyResource,
} from '@kedul/service-permission';
import uuidv4 from 'uuid/v4';

import { Event, userErrors } from './BusinessConstants';
import { createOwner } from './BusinessMemberMutations';
import { BusinessRepository } from './BusinessRepository';
import { Business } from './BusinessTypes';
import { enhance } from './RequestContext';
import { createBusinessMemberRoles } from './BusinessMemberRoleMutations';

const makeSuccessPayload = (business: Business) => ({
  business,
  isSuccessful: true,
  userError: null,
});

const makeErrorPayload = (error: UserError) => ({
  business: null,
  isSuccessful: false,
  userError: error,
});

const publishEvent = (
  event: string,
  business: Business,
  context: RequestContext,
) =>
  publish(event, {
    aggregateId: business.id,
    aggregateType: 'BUSINESS',
    data: business,
    context,
  });

const getResource = (business: Business): PolicyResource => ({
  entity: PolicyEntity.BUSINESS,
  entityId: business.id,
  locationId: null,
});

const checkBusinessNameAvailability = (
  businessRepository: BusinessRepository,
) => async (name: string) => {
  const businessExists = await businessRepository.findByName(name);

  return !!businessExists;
};

const make = async (
  input: CreateBusinessInput,
  userId: string,
): Promise<Business> => {
  return {
    ...input,
    createdAt: new Date(),
    id: input.id || uuidv4(),
    updatedAt: new Date(),
    userId,
  };
};

export interface CreateBusinessInput {
  id?: string | null;
  name: string;
  logoImageId?: string | null;
  email?: string | null;
  countryCode?: string | null;
  phoneNumber?: string | null;
  facebookUrl?: string | null;
}

export const createBusiness = async (
  input: CreateBusinessInput,
  context: RequestContext,
) => {
  const { businessRepository } = enhance(context).repositories;

  const isNameUsed = await checkBusinessNameAvailability(businessRepository)(
    input.name,
  );

  if (isNameUsed) {
    const error = userErrors.businessNameAlreadyUsed();
    return makeErrorPayload(error);
  }

  const business = await make(input, extractUserId(context));
  await businessRepository.save(business);

  const contextWithBusiness: RequestContext = {
    ...context,
    business,
  };

  publishEvent(Event.BUSINESS_CREATED, business, contextWithBusiness);

  const { ownerRole } = await createBusinessMemberRoles(
    business,
    contextWithBusiness,
  );

  await createOwner({ business, ownerRole }, contextWithBusiness);

  return makeSuccessPayload(business);
};

const validateUpdateBusiness = async (
  input: UpdateBusinessInput,
  prevBusiness: Business,
  businessRepository: BusinessRepository,
) => {
  if (input.email) {
    const error = await validateInputWithEmail({
      email: input.email,
    });
    if (error) return error;
  }

  if (input.phoneNumber && input.countryCode) {
    const error = await validateInputWithPhoneNumber({
      countryCode: input.countryCode,
      phoneNumber: input.phoneNumber,
    });

    if (error) return error;
  }

  if (input.name && prevBusiness.name !== input.name) {
    const isNameUsed = await checkBusinessNameAvailability(businessRepository)(
      input.name,
    );

    if (isNameUsed) return userErrors.businessNameAlreadyUsed();
  }

  return null;
};

export interface UpdateBusinessInput {
  id: string;
  name?: string | null;
  logoImageId?: string | null;
  email?: string | null;
  countryCode?: string | null;
  phoneNumber?: string | null;
  facebookUrl?: string | null;
}

export const updateBusiness = async (
  input: UpdateBusinessInput,
  context: RequestContext,
) => {
  const { businessRepository } = enhance(context).repositories;
  const prevBusiness = await businessRepository.getById(input.id);

  const error = await validateUpdateBusiness(
    input,
    prevBusiness,
    businessRepository,
  );

  if (error) return makeErrorPayload(error);

  const business = await changeset(prevBusiness, input);

  const action = PolicyAction.UPDATE_BUSINESS;
  await authorizeMember(action, getResource(business), context);

  await businessRepository.update(business);

  publishEvent(Event.BUSINESS_UPDATED, business, context);
  return makeSuccessPayload(business);
};

export interface DeleteBusinessInput {
  id: string;
}

export const deleteBusiness = async (
  input: DeleteBusinessInput,
  context: RequestContext,
) => {
  const { businessRepository } = enhance(context).repositories;

  const business = await businessRepository.getById(input.id);

  const action = PolicyAction.DELETE_BUSINESS;
  await authorizeMember(action, getResource(business), context);

  await businessRepository.remove(business);

  publishEvent(Event.BUSINESS_DELETED, business, context);

  return makeSuccessPayload(business);
};
