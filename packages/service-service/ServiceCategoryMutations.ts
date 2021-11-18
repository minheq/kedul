import { publish, RequestContext } from '@kedul/common-server';
import { changeset, UserError } from '@kedul/common-utils';
import {
  authorizeMember,
  PolicyAction,
  PolicyEntity,
  PolicyResource,
} from '@kedul/service-permission';
import uuidv4 from 'uuid/v4';

import { enhance } from './RequestContext';
import { Event } from './ServiceCategoryConstants';
import { ServiceCategory } from './ServiceCategoryTypes';

const makeSuccessPayload = async (serviceCategory: ServiceCategory) => ({
  isSuccessful: true,
  serviceCategory,
  userError: null,
});

const makeErrorPayload = async (userError: UserError) => ({
  isSuccessful: false,
  serviceCategory: null,
  userError,
});

const publishEvent = (
  event: Event,
  serviceCategory: ServiceCategory,
  context: RequestContext,
) =>
  publish(event, {
    aggregateId: serviceCategory.id,
    aggregateType: 'SERVICE_CATEGORY',
    data: serviceCategory,
    context,
  });

const make = async (
  input: CreateServiceCategoryInput,
): Promise<ServiceCategory> => {
  return {
    ...input,
    createdAt: new Date(),
    id: uuidv4(),
    updatedAt: new Date(),
  };
};

const getResource = (serviceCategory: ServiceCategory): PolicyResource => ({
  entity: PolicyEntity.SERVICE_CATEGORY,
  entityId: serviceCategory.id,
  locationId: null,
});

export interface CreateServiceCategoryInput {
  name: string;
}

export const createServiceCategory = async (
  input: CreateServiceCategoryInput,
  context: RequestContext,
) => {
  const { serviceCategoryRepository } = enhance(context).repositories;

  const serviceCategory = await make(input);

  const action = PolicyAction.CREATE_SERVICE;
  await authorizeMember(action, getResource(serviceCategory), context);

  await serviceCategoryRepository.save(serviceCategory);

  publishEvent(Event.SERVICE_CATEGORY_CREATED, serviceCategory, context);
  return makeSuccessPayload(serviceCategory);
};

export interface UpdateServiceCategoryInput {
  id: string;
  name: string;
}

export const updateServiceCategory = async (
  input: UpdateServiceCategoryInput,
  context: RequestContext,
) => {
  const { serviceCategoryRepository } = enhance(context).repositories;

  const oldServiceCategory = await serviceCategoryRepository.getById(input.id);
  const serviceCategory = await changeset(oldServiceCategory, input);

  const action = PolicyAction.UPDATE_SERVICE;
  await authorizeMember(action, getResource(serviceCategory), context);

  await serviceCategoryRepository.update(serviceCategory);

  publishEvent(Event.SERVICE_CATEGORY_UPDATED, serviceCategory, context);
  return makeSuccessPayload(serviceCategory);
};

export interface DeleteServiceCategoryInput {
  id: string;
}

export const deleteServiceCategory = async (
  input: DeleteServiceCategoryInput,
  context: RequestContext,
) => {
  const { serviceCategoryRepository } = enhance(context).repositories;

  const serviceCategory = await serviceCategoryRepository.getById(input.id);

  const action = PolicyAction.DELETE_SERVICE;
  await authorizeMember(action, getResource(serviceCategory), context);

  await serviceCategoryRepository.remove(serviceCategory);

  publishEvent(Event.SERVICE_CATEGORY_DELETED, serviceCategory, context);
  return makeSuccessPayload(serviceCategory);
};
