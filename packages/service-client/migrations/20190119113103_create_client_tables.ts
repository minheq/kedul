import Knex from 'knex';

import { Table } from '../Database';

export const up = (knex: Knex) => {
  return Promise.resolve().then(() => {
    return knex.schema.createTable(Table.CLIENT, table => {
      table
        .text('id')
        .primary()
        .notNullable();
      table.boolean('isBanned').notNullable();
      table.json('contactDetails');
      table.text('userId');
      table.json('profile').notNullable();
      table.text('notes');
      table.text('importantNotes');
      table.text('referralSource');
      table.float('discount');
      table.timestamp('createdAt').notNullable();
      table.timestamp('updatedAt').notNullable();
      table.timestamp('deletedAt');
      table.text('businessId').notNullable();
    });
  });
};

export const down = (knex: Knex) => {
  return Promise.resolve().then(() =>
    knex.schema.dropTableIfExists(Table.CLIENT),
  );
};
