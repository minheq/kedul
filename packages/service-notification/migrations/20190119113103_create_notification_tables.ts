import Knex from 'knex';

export const up = (knex: Knex) => {
  return Promise.resolve().then(() => {
    return knex.schema.createTable('NOTIFICATION', table => {
      table
        .text('id')
        .primary()
        .notNullable();
      table.text('eventId').notNullable();
      table.text('jobId');
      table.text('data').notNullable();
      table.text('aggregateId').notNullable();
      table.text('aggregateType').notNullable();
      table.text('metadata');
      table.text('event').notNullable();
      table.text('businessId').notNullable();
    });
  });
};

export const down = (knex: Knex) => {
  return Promise.resolve().then(() =>
    knex.schema.dropTableIfExists('NOTIFICATION'),
  );
};
