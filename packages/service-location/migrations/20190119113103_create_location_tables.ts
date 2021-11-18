import Knex from 'knex';

import { Table } from '../Database';

export const up = (knex: Knex) => {
  return Promise.resolve().then(() => {
    return knex.schema.createTable(Table.LOCATION, table => {
      table
        .text('id')
        .primary()
        .notNullable();
      table.text('name').notNullable();
      table.json('contactDetails');
      table.json('address');
      table.json('businessHours').notNullable();
      table.timestamp('createdAt').notNullable();
      table.timestamp('deletedAt');
      table.timestamp('updatedAt').notNullable();
      table.text('businessId').notNullable();
    });
  });
};

export const down = (knex: Knex) => {
  return Promise.resolve().then(() =>
    knex.schema.dropTableIfExists(Table.LOCATION),
  );
};
