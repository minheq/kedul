import Knex from 'knex';

import { Table } from '../Database';

// eslint-disable-next-line
export const up = (knex: Knex) => {
  return Promise.resolve()
    .then(() => {
      return knex.schema.createTable(Table.EMPLOYEE, table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('employeeRoleId');
        table.text('locationId').notNullable();
        table.text('businessId').notNullable();
        table.text('userId');
        table.text('notes');
        table.timestamp('acceptedInvitationAt');
        table.timestamp('createdAt').notNullable();
        table.timestamp('deletedAt');
        table.timestamp('updatedAt').notNullable();
        table.json('contactDetails');
        table.json('profile');
        table.json('salarySettings');
        table.json('shiftSettings');
        table.json('employment');
        table.text('serviceIds').notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable(Table.EMPLOYEE_INVITATION, table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('businessId').notNullable();
        table.text('employeeId').notNullable();
        table.text('invitedByUserId').notNullable();
        table.text('phoneNumber').notNullable();
        table.text('countryCode').notNullable();
        table.timestamp('expirationDate').notNullable();
        table.text('token').notNullable();
        table.timestamp('createdAt').notNullable();
        table.timestamp('updatedAt').notNullable();
      });
    })

    .then(() => {
      return knex.schema.createTable(Table.EMPLOYEE_ROLE, table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('name').notNullable();
        table.text('locationId').notNullable();
        table.text('businessId').notNullable();
        table.text('policyId').notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable(Table.SHIFT, table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('shiftRecurrenceId');
        table.text('locationId').notNullable();
        table.text('businessId').notNullable();
        table.text('employeeId').notNullable();
        table.integer('breakDuration').notNullable();
        table.timestamp('startDate').notNullable();
        table.timestamp('endDate').notNullable();
        table.text('notes');
        table.text('status').notNullable();
        table.timestamp('createdAt').notNullable();
        table.timestamp('updatedAt').notNullable();
        table.timestamp('canceledAt');
        table.timestamp('startedAt');
        table.timestamp('completedAt');
        table.timestamp('markedNoShowAt');
      });
    })
    .then(() => {
      return knex.schema.createTable(Table.SHIFT_RECURRENCE, table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('initialShiftId').notNullable();
        table.json('recurrence').notNullable();
        table.timestamp('createdAt').notNullable();
        table.timestamp('updatedAt').notNullable();
      });
    });
};

export const down = (knex: Knex) => {
  return Promise.resolve()
    .then(() => knex.schema.dropTableIfExists(Table.EMPLOYEE))
    .then(() => knex.schema.dropTableIfExists(Table.EMPLOYEE_INVITATION))
    .then(() => knex.schema.dropTableIfExists(Table.EMPLOYEE_ROLE))
    .then(() => knex.schema.dropTableIfExists(Table.SHIFT))
    .then(() => knex.schema.dropTableIfExists(Table.SHIFT_RECURRENCE));
};
