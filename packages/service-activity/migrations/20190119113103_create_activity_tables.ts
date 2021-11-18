import Knex from 'knex';

export const up = (knex: Knex) => {
  return Promise.resolve().then(() => {
    return knex.schema.createTable('ACTIVITY', table => {
      table
        .text('id')
        .primary()
        .notNullable();
      table.text('aggregateId').notNullable();
      table.text('aggregateType').notNullable();
      table.text('data').notNullable();
      table.text('metadata');
      table.timestamp('createdAt').notNullable();
      table.text('businessId').notNullable();
    });
  });
};

export const down = (knex: Knex) => {
  return Promise.resolve().then(() =>
    knex.schema.dropTableIfExists('ACTIVITY'),
  );
};
