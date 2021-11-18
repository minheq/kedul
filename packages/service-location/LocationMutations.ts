import {
  extractBusinessId,
  publish,
  RequestContext,
} from '@kedul/common-server';
import {
  Address,
  CalendarEventInput,
  changeset,
  ContactDetails,
  makeRecurrence,
} from '@kedul/common-utils';
import {
  authorizeMember,
  PolicyAction,
  PolicyEntity,
  PolicyResource,
} from '@kedul/service-permission';
import uuidv4 from 'uuid/v4';

import { Event } from './LocationConstants';
import { Location } from './LocationTypes';
import { enhance } from './RequestContext';

const makeSuccessPayload = async (location: Location) => ({
  location,
  isSuccessful: true,
  userError: null,
});

const publishEvent = (
  event: string,
  location: Location,
  context: RequestContext,
) =>
  publish(event, {
    aggregateId: location.id,
    aggregateType: 'LOCATION',
    data: location,
    context,
  });

const getResource = (location: Location): PolicyResource => ({
  entity: PolicyEntity.LOCATION,
  entityId: location.id,
  locationId: location.id,
});

const make = async (
  input: CreateLocationInput,
  context: RequestContext,
): Promise<Location> => {
  return {
    ...input,
    businessId: extractBusinessId(context),
    businessHours: input.businessHours
      ? input.businessHours.map(bh => ({
          ...bh,
          recurrence: bh.recurrence
            ? makeRecurrence(new Date(), bh.recurrence)
            : null,
        }))
      : [],
    createdAt: new Date(),
    id: input.id || uuidv4(),
    updatedAt: new Date(),
  };
};

export interface CreateLocationInput {
  id?: string | null;
  name: string;
  address?: Address | null;
  contactDetails?: ContactDetails | null;
  businessHours?: CalendarEventInput[] | null;
}

export const createLocation = async (
  input: CreateLocationInput,
  context: RequestContext,
) => {
  const { locationRepository } = enhance(context).repositories;

  const location = await make(input, context);
  const action = PolicyAction.CREATE_LOCATION;

  await authorizeMember(
    action,
    { entityId: '*', entity: PolicyEntity.LOCATION, locationId: null },
    context,
  );

  await locationRepository.save(location);

  publishEvent(Event.LOCATION_CREATED, location, context);

  return makeSuccessPayload(location);
};

export interface UpdateLocationInput {
  id: string;
  name?: string | null;
  contactDetails?: ContactDetails | null;
  address?: Address | null;
  businessHours?: CalendarEventInput[] | null;
}

export const updateLocation = async (
  input: UpdateLocationInput,
  context: RequestContext,
) => {
  const { locationRepository } = enhance(context).repositories;

  const oldLocation = await locationRepository.getById(input.id);
  const location = await changeset(oldLocation, input);

  const action = PolicyAction.UPDATE_LOCATION;
  await authorizeMember(action, getResource(location), context);

  await locationRepository.update(location);

  publishEvent(Event.LOCATION_UPDATED, location, context);

  return makeSuccessPayload(location);
};

export interface DeleteLocationInput {
  id: string;
}

export const deleteLocation = async (
  input: DeleteLocationInput,
  context: RequestContext,
) => {
  const { locationRepository } = enhance(context).repositories;

  const location = await locationRepository.getById(input.id);

  const action = PolicyAction.DELETE_LOCATION;
  await authorizeMember(action, getResource(location), context);

  await locationRepository.remove(location);

  publishEvent(Event.LOCATION_DELETED, location, context);

  return makeSuccessPayload(location);
};
