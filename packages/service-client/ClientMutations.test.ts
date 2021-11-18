import path from 'path';

import { SourceContext } from '@kedul/common-server';
import { makeContext, makeKnex } from '@kedul/common-test-utils';
import { PersonGender } from '@kedul/service-user';
import faker from 'faker';

import {
  createClient,
  CreateClientInput,
  deleteClient,
  updateClient,
  UpdateClientInput,
} from './ClientMutations';
import { findClientById } from './ClientQueries';

jest.mock('@kedul/service-permission');

const knex = makeKnex();

const makeCreateInput = (
  input?: Partial<CreateClientInput>,
): CreateClientInput => ({
  isBanned: false,

  discount: faker.random.number(),
  importantNotes: faker.random.word(),
  notes: faker.random.word(),
  contactDetails: {
    email: faker.random.word(),
    phoneNumber: faker.random.word(),
  },
  profile: {
    birthday: new Date(),
    fullName: faker.random.word(),
    gender: PersonGender.MALE,
  },

  referralSource: faker.random.word(),
  ...input,
});

beforeAll(async () => {
  await knex.migrate.latest({
    directory: path.resolve(__dirname, './migrations'),
  });
});

afterAll(async () => {
  await knex.destroy();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

test('should create by member happy path', async () => {
  const input = makeCreateInput();
  const result = await createClient(input, makeContext());

  expect(result.client!).toMatchObject(input);
});

test('should create by client happy path', async () => {
  const userId = faker.random.uuid();

  const result = await createClient(
    {
      contactDetails: {},
      profile: {
        fullName: faker.random.word(),
      },
    },
    makeContext({
      actor: { userId },
      source: SourceContext.BOOKING_SITE,
    }),
  );

  expect(result.client).toBeTruthy();
});

test('should update happy path', async () => {
  const context = makeContext();
  const { client } = await createClient(makeCreateInput(), context);

  const input: UpdateClientInput = {
    ...makeCreateInput(),
    id: client!.id,
  };

  const result = await updateClient(input, context);
  expect(result.client).toMatchObject(input);
});

test('should delete client happy path', async () => {
  const context = makeContext();

  const { client } = await createClient(makeCreateInput(), context);

  await deleteClient({ id: client!.id }, context);

  const result = await findClientById({ id: client!.id }, context);

  expect(result).toBeFalsy();
});
