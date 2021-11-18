import Knex from 'knex';

import { Table } from '../Database';

export const up = (knex: Knex) => {
  return Promise.resolve()
    .then(() => {
      return knex.schema.createTable(Table.BUSINESS, table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('name').notNullable();
        table.text('logoImageId');
        table.text('email');
        table.text('countryCode');
        table.text('phoneNumber');
        table.text('facebookUrl');
        table.text('userId').notNullable();
        table.timestamp('createdAt').notNullable();
        table.timestamp('updatedAt').notNullable();
        table.timestamp('deletedAt');
      });
    })
    .then(() => {
      return knex.schema.createTable(Table.BUSINESS_MEMBER, table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('businessMemberRoleId').notNullable();
        table.text('businessId').notNullable();
        table.text('userId').notNullable();
        table.timestamp('createdAt').notNullable();
        table.timestamp('updatedAt').notNullable();
        table.timestamp('acceptedAt');
        table.timestamp('deletedAt');
      });
    })
    .then(() => {
      return knex.schema.createTable(
        Table.BUSINESS_MEMBER_INVITATION,
        table => {
          table.text('businessMemberId').notNullable();
          table.timestamp('expirationDate');
          table.text('token');
        },
      );
    })
    .then(() => {
      return knex.schema.createTable(Table.BUSINESS_MEMBER_ROLE, table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('name').notNullable();
        table.text('businessId').notNullable();
        table.text('policyId').notNullable();
      });
    });
};

export const down = (knex: Knex) => {
  return Promise.resolve()
    .then(() => knex.schema.dropTableIfExists(Table.BUSINESS))
    .then(() => knex.schema.dropTableIfExists(Table.BUSINESS_MEMBER))
    .then(() => knex.schema.dropTableIfExists(Table.BUSINESS_MEMBER_INVITATION))
    .then(() => knex.schema.dropTableIfExists(Table.BUSINESS_MEMBER_ROLE));
};
