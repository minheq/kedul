import Knex from 'knex';

const knex = Knex({
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
});

export const makeKnex = () => knex;
