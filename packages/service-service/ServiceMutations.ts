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
import { Event } from './ServiceConstants';
import {
  Service,
  ServicePaddingTime,
  ServicePricingOption,
  ServiceProcessingTimeDuringServiceEnd,
} from './ServiceTypes';

const makeSuccessPayload = async (service: Service) => ({
  isSuccessful: true,
  service,
  userError: null,
});

const makeErrorPayload = async (userError: UserError) => ({
  isSuccessful: false,
  service: null,
  userError,
});

const publishEvent = (
  event: string,
  service: Service,
  context: RequestContext,
) =>
  publish(event, {
    aggregateId: service.id,
    aggregateType: 'SERVICE',
    data: service,
    context,
  });

const getResource = (service: Service): PolicyResource => ({
  entity: PolicyEntity.SERVICE,
  entityId: service.id,
  locationId: service.locationId,
});

const make = async (input: CreateServiceInput): Promise<Service> => {
  return {
    ...input,
    createdAt: new Date(),
    id: input.id || uuidv4(),
    imageIds: input.imageIds || [],
    pricingOptions: input.pricingOptions.map(po => ({
      ...po,
    })),
    questionsForClient: input.questionsForClient || [],
    updatedAt: new Date(),
  };
};

export interface CreateServiceInput {
  id?: string | null;
  name: string;
  pricingOptions: ServicePricingOption[];
  locationId: string;
  serviceCategoryId?: string | null;
  description?: string | null;
  paddingTime?: ServicePaddingTime | null;
  processingTimeAfterServiceEnd?: number | null;
  processingTimeDuringService?: ServiceProcessingTimeDuringServiceEnd | null;
  parallelClientsCount?: number | null;
  intervalTime?: number | null;
  noteToClient?: string | null;
  questionsForClient?: string[] | null;
  primaryImageId?: string | null;
  imageIds?: string[] | null;
}

export const createService = async (
  input: CreateServiceInput,
  context: RequestContext,
) => {
  const { serviceRepository } = enhance(context).repositories;

  const service = await make(input);

  const action = PolicyAction.CREATE_SERVICE;
  await authorizeMember(action, getResource(service), context);

  await serviceRepository.save(service);

  publishEvent(Event.SERVICE_CREATED, service, context);
  return makeSuccessPayload(service);
};

export interface UpdateServiceInput {
  id: string;
  serviceCategoryId?: string | null;
  name?: string | null;
  description?: string | null;
  pricingOptions?: ServicePricingOption[] | null;
  paddingTime?: ServicePaddingTime | null;
  processingTimeAfterServiceEnd?: number | null;
  processingTimeDuringService?: ServiceProcessingTimeDuringServiceEnd | null;
  parallelClientsCount?: number | null;
  intervalTime?: number | null;
  noteToClient?: string | null;
  questionsForClient?: string[] | null;
  primaryImageId?: string | null;
  imageIds?: string[] | null;
}

export const updateService = async (
  input: UpdateServiceInput,
  context: RequestContext,
) => {
  const { serviceRepository } = enhance(context).repositories;

  const oldService = await serviceRepository.getById(input.id);
  const service = await changeset(oldService, input);

  const action = PolicyAction.UPDATE_SERVICE;
  await authorizeMember(action, getResource(service), context);

  await serviceRepository.update(service);

  publishEvent(Event.SERVICE_UPDATED, service, context);
  return makeSuccessPayload(service);
};

export interface DeleteServiceInput {
  id: string;
}

export const deleteService = async (
  input: DeleteServiceInput,
  context: RequestContext,
) => {
  const { serviceRepository } = enhance(context).repositories;

  const service = await serviceRepository.getById(input.id);

  const action = PolicyAction.DELETE_SERVICE;
  await authorizeMember(action, getResource(service), context);

  await serviceRepository.remove(service);

  publishEvent(Event.SERVICE_DELETED, service, context);

  return makeSuccessPayload(service);
};
