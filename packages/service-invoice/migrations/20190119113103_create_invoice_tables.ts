import Knex from 'knex';

export const up = (knex: Knex) => {
  return Promise.resolve()
    .then(() => {
      return knex.schema.createTable('INVOICE', table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('note');
        table.text('locationId').notNullable();
        table.json('discount');
        table.json('tip');
        table.json('payment').notNullable();
        table.text('clientId');
        table.text('status').notNullable();
        table.text('refundInvoiceId');
        table.text('originalInvoiceId');
        table.timestamp('createdAt').notNullable();
        table.timestamp('updatedAt').notNullable();
        table.timestamp('refundedAt');
        table.timestamp('voidAt');
        table.text('businessId').notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable('INVOICE_LINE_ITEM', table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('invoiceId').notNullable();
        table.integer('quantity').notNullable();
        table.text('typeId').notNullable();
        table.text('type').notNullable();
        table.float('price').notNullable();
        table.json('discount');
        table.text('employeeId').notNullable();
        table.text('businessId').notNullable();
      });
    });
};

export const down = (knex: Knex) => {
  return Promise.resolve()
    .then(() => knex.schema.dropTableIfExists('INVOICE'))
    .then(() => knex.schema.dropTableIfExists('INVOICE_LINE_ITEM'));
};
