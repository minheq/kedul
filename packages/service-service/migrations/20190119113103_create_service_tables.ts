import Knex from 'knex';

export const up = (knex: Knex) => {
  return Promise.resolve()
    .then(() => {
      return knex.schema.createTable('SERVICE', table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('name').notNullable();
        table.text('description');
        table.text('serviceCategoryId');
        table.text('primaryImageId');
        table.text('imageIds').notNullable();
        table.text('locationId').notNullable();
        table.json('pricingOptions').notNullable();
        table.text('questionsForClient').notNullable();
        table.json('paddingTime');
        table.integer('processingTimeAfterServiceEnd');
        table.json('processingTimeDuringService');
        table.integer('parallelClientsCount');
        table.integer('intervalTime');
        table.text('noteToClient');
        table.timestamp('createdAt').notNullable();
        table.timestamp('updatedAt').notNullable();
        table.text('businessId').notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable('SERVICE_CATEGORY', table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('name').notNullable();
        table.timestamp('createdAt').notNullable();
        table.timestamp('updatedAt').notNullable();
        table.text('businessId').notNullable();
      });
    });
};

export const down = (knex: Knex) => {
  return Promise.resolve()
    .then(() => knex.schema.dropTableIfExists('SERVICE'))
    .then(() => knex.schema.dropTableIfExists('SERVICE_CATEGORY'));
};
