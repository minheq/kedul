import { publish, RequestContext } from '@kedul/common-server';
import { changeset, ContactDetails, UserError } from '@kedul/common-utils';
import {
  authorizeMember,
  PolicyAction,
  PolicyEntity,
  PolicyResource,
} from '@kedul/service-permission';
import { UserProfile } from '@kedul/service-user';
import uuidv4 from 'uuid/v4';

import { Event } from './ClientConstants';
import { Client } from './ClientTypes';
import { enhance } from './RequestContext';

const getSuccessPayload = async (client: Client) => ({
  client,
  isSuccessful: true,
  userError: null,
});

const getErrorPayload = async (userError: UserError) => ({
  client: null,
  isSuccessful: false,
  userError,
});

const publishEvent = (event: Event, client: Client, context: RequestContext) =>
  publish(event, {
    aggregateId: client.id,
    aggregateType: 'CLIENT',
    data: client,
    context,
  });

const getResource = (client: Client): PolicyResource => ({
  entity: PolicyEntity.CLIENT,
  entityId: client.id,
  locationId: null,
});

export interface CreateClientInput {
  id?: string | null;
  isBanned?: boolean | null;
  contactDetails: ContactDetails;
  profile: UserProfile;
  notes?: string | null;
  importantNotes?: string | null;
  referralSource?: string | null;
  discount?: number | null;
}

type CreateClientInputWithProfile = CreateClientInput & {
  profile: UserProfile;
};

const makeByMember = async (
  input: CreateClientInputWithProfile,
): Promise<Client> => {
  const clientId = input.id || uuidv4();

  return {
    ...input,
    createdAt: new Date(),
    id: clientId,
    isBanned: false,
    updatedAt: new Date(),
  };
};

const createClientByMember = async (
  input: CreateClientInput,
  context: RequestContext,
) => {
  const { clientRepository } = enhance(context).repositories;

  const client = await makeByMember(input as CreateClientInputWithProfile);

  const action = PolicyAction.CREATE_CLIENT;
  await authorizeMember(action, getResource(client), context);

  await clientRepository.save(client);

  publishEvent(Event.CLIENT_CREATED_BY_MEMBER, client, context);
  return getSuccessPayload(client);
};

export interface UpdateClientInput {
  id: string;
  isBanned?: boolean | null;
  contactDetails?: ContactDetails | null;
  profile?: UserProfile | null;
  notes?: string | null;
  importantNotes?: string | null;
  referralSource?: string | null;
  discount?: number | null;
}

export const updateClient = async (
  input: UpdateClientInput,
  context: RequestContext,
) => {
  const { clientRepository } = enhance(context).repositories;

  const oldClient = await clientRepository.getById(input.id);
  const client = await changeset(oldClient, input);

  const action = PolicyAction.UPDATE_CLIENT;
  await authorizeMember(action, getResource(client), context);

  await clientRepository.update(client);

  publishEvent(Event.CLIENT_UPDATED, client, context);
  return getSuccessPayload(client);
};

export interface DeleteClientInput {
  id: string;
}

export const deleteClient = async (
  input: DeleteClientInput,
  context: RequestContext,
) => {
  const { clientRepository } = enhance(context).repositories;

  const client = await clientRepository.getById(input.id);

  const action = PolicyAction.DELETE_CLIENT;
  await authorizeMember(action, getResource(client), context);

  await clientRepository.remove(client);

  publishEvent(Event.CLIENT_DELETED, client, context);
  return getSuccessPayload(client);
};

export const createClient = async (
  input: CreateClientInput,
  context: RequestContext,
) => {
  return createClientByMember(input, context);
};
