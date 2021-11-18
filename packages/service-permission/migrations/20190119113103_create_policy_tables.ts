import Knex from 'knex';

import { Table } from '../Database';

export const up = (knex: Knex) => {
  return Promise.resolve().then(() => {
    return knex.schema.createTable(Table.POLICY, table => {
      table
        .text('id')
        .primary()
        .notNullable();
      table.text('businessId').notNullable();
      table.text('version');
      table.text('name');
      table.timestamp('createdAt').notNullable();
      table.timestamp('updatedAt').notNullable();
      table.json('statements').notNullable();
    });
  });
};

export const down = (knex: Knex) => {
  return Promise.resolve().then(() =>
    knex.schema.dropTableIfExists(Table.POLICY),
  );
};
