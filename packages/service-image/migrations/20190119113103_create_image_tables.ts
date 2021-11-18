import Knex from 'knex';

import { Table } from '../Database';

export const up = (knex: Knex) => {
  return Promise.resolve().then(() => {
    return knex.schema.createTable(Table.IMAGE, table => {
      table
        .text('id')
        .primary()
        .notNullable();
      table.integer('width');
      table.integer('height');
      table.text('url');
      table.text('format').notNullable();
      table.text('filename').notNullable();
      table.text('mimetype').notNullable();
      table.text('encoding').notNullable();
      table.text('cloudStorageProvider').notNullable();
      table.json('sizes').notNullable();
      table.timestamp('createdAt').notNullable();
      table.timestamp('deletedAt');
    });
  });
};

export const down = (knex: Knex) => {
  return Promise.resolve().then(() =>
    knex.schema.dropTableIfExists(Table.IMAGE),
  );
};
