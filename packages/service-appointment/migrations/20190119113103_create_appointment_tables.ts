import Knex from 'knex';

export const up = (knex: Knex) => {
  return Promise.resolve()
    .then(() => {
      return knex.schema.createTable('APPOINTMENT', table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('appointmentRecurrenceId');
        table.text('locationId').notNullable();
        table.text('clientId');
        table.text('invoiceId');
        table.text('internalNotes');
        table.text('clientNotes');
        table.text('cancellationReason');
        table.text('reference');
        table.text('status').notNullable();
        table.timestamp('createdAt').notNullable();
        table.timestamp('updatedAt').notNullable();
        table.timestamp('canceledAt');
        table.timestamp('checkedOutAt');
        table.timestamp('markedNoShowAt');
        table.text('businessId').notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable('APPOINTMENT_SERVICE', table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('appointmentId').notNullable();
        table.integer('clientNumber').notNullable();
        table.integer('duration').notNullable();
        table.boolean('isEmployeeRequestedByClient').notNullable();
        table.integer('order').notNullable();
        table.text('serviceId').notNullable();
        table.timestamp('startDate').notNullable();
        table.text('employeeId');
        table.text('clientId');
        table.text('businessId').notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable('APPOINTMENT_RECURRENCE', table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('initialAppointmentId').notNullable();
        table.json('recurrence').notNullable();
        table.timestamp('createdAt').notNullable();
        table.timestamp('updatedAt').notNullable();
      });
    });
};

export const down = (knex: Knex) => {
  return Promise.resolve()
    .then(() => knex.schema.dropTableIfExists('APPOINTMENT'))
    .then(() => knex.schema.dropTableIfExists('APPOINTMENT_SERVICE'))
    .then(() => knex.schema.dropTableIfExists('APPOINTMENT_RECURRENCE'));
};
