import {
  extractBusinessId,
  parseJsonColumn,
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';

import { Client } from './ClientTypes';
import { ClientDbObject, Table } from './Database';

export interface ClientRepository {
  findById: (id: string) => Promise<Client | null>;
  getById: (id: string) => Promise<Client>;
  save: (entity: Client) => Promise<void>;
  update: (entity: Client) => Promise<void>;
  remove: (entity: Client) => Promise<void>;
  findManyByIds: (ids: string[]) => Promise<(Client | null)[]>;
  findManyByBusinessId: (id: string) => Promise<Client[]>;
}

const toEntity = (client: ClientDbObject): Client => {
  return {
    ...client,
    profile: parseJsonColumn(client.profile),
    contactDetails: client.contactDetails
      ? parseJsonColumn(client.contactDetails)
      : null,
  };
};

const fromEntity = (context: RequestContext) => (
  client: Client,
): ClientDbObject => {
  const businessId = extractBusinessId(context);

  return {
    businessId,
    id: client.id,
    isBanned: client.isBanned,

    contactDetails: client.contactDetails
      ? JSON.stringify(client.contactDetails)
      : null,
    createdAt: new Date(),
    deletedAt: null,
    discount: client.discount || null,
    importantNotes: client.importantNotes || null,
    notes: client.notes || null,
    profile: JSON.stringify(client.profile),
    referralSource: client.referralSource || null,
    updatedAt: new Date(),
    userId: client.userId || null,
  };
};

const findById = (context: RequestContext) => async (id: string) => {
  const { knex } = context.dependencies;

  const client = (await knex
    .select()
    .where({ id })
    .andWhere({ deletedAt: null })
    .from(Table.CLIENT)
    .first()) as ClientDbObject;

  return client ? toEntity(client) : null;
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const clients = (await knex
    .select()
    .whereIn('id', ids)
    .andWhere({ deletedAt: null })
    .from(Table.CLIENT)) as ClientDbObject[];

  return upholdDataLoaderConstraints(clients.map(toEntity), ids);
};

const findManyByBusinessId = (context: RequestContext) => async (
  id: string,
) => {
  const { knex } = context.dependencies;

  const clients = (await knex
    .select()
    .where('businessId', id)
    .from(Table.CLIENT)) as ClientDbObject[];

  return clients.map(toEntity);
};

const getById = (context: RequestContext) => async (id: string) => {
  const client = await findById(context)(id);
  if (!client) throw new Error(`${id} in ${Table.CLIENT}`);

  return client;
};

const save = (context: RequestContext) => async (client: Client) => {
  const { knex } = context.dependencies;

  await knex.insert(fromEntity(context)(client)).into(Table.CLIENT);
};

const update = (context: RequestContext) => async (client: Client) => {
  const { knex } = context.dependencies;

  await knex(Table.CLIENT)
    .update({
      ...fromEntity(context)(client),
      updatedAt: new Date(),
    })
    .where({ id: client.id });
};

const remove = (context: RequestContext) => async (client: Client) => {
  const { knex } = context.dependencies;

  await knex(Table.CLIENT)
    .update({ deletedAt: new Date() })
    .where({ id: client.id });
};

export const makeClientRepository = (
  context: RequestContext,
): ClientRepository => ({
  findById: findById(context),
  findManyByIds: findManyByIds(context),
  findManyByBusinessId: findManyByBusinessId(context),
  getById: getById(context),
  remove: remove(context),
  save: save(context),
  update: update(context),
});
