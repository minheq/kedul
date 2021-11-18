import Knex from 'knex';

import { Table } from '../Database';

// eslint-disable-next-line
export const up = (knex: Knex) => {
  return Promise.resolve()
    .then(() => {
      return knex.schema.createTable(Table.USER, table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.json('profile');
        table.boolean('isActive').notNullable();
        table.timestamp('createdAt').notNullable();
        table.timestamp('updatedAt').notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable(Table.USER_ACCOUNT, table => {
        table.text('userId').notNullable();
        table.text('email');
        table.text('phoneNumber');
        table.text('countryCode');
        table.boolean('isEmailVerified').notNullable();
        table.boolean('isPhoneVerified').notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable(Table.SOCIAL_IDENTITY, table => {
        table.text('userId').notNullable();
        table.text('provider').notNullable();
        table.text('providerUserId').notNullable();
        table.text('profileData');
      });
    })
    .then(() => {
      return knex.schema.createTable(Table.ACCOUNT_LOGIN, table => {
        table.text('userId').notNullable();
        table.text('name').notNullable();
        table.text('key').notNullable();
        table.text('claim').notNullable();
        table.timestamp('createdAt').notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable(Table.PHONE_VERIFICATION_CODE, table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('userId').notNullable();
        table.text('code').notNullable();
        table.text('state').notNullable();
        table.text('type').notNullable();
        table.text('phoneNumber').notNullable();
        table.text('countryCode').notNullable();
        table.timestamp('expiredAt').notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable(Table.EMAIL_VERIFICATION_CODE, table => {
        table
          .text('id')
          .primary()
          .notNullable();
        table.text('userId').notNullable();
        table.text('code').notNullable();
        table.text('state').notNullable();
        table.text('type').notNullable();
        table.text('email').notNullable();
        table.timestamp('expiredAt').notNullable();
      });
    });
};

export const down = (knex: Knex) => {
  return Promise.resolve()
    .then(() => knex.schema.dropTableIfExists(Table.USER))
    .then(() => knex.schema.dropTableIfExists(Table.USER_ACCOUNT))
    .then(() => knex.schema.dropTableIfExists(Table.SOCIAL_IDENTITY))
    .then(() => knex.schema.dropTableIfExists(Table.ACCOUNT_LOGIN))
    .then(() => knex.schema.dropTableIfExists(Table.PHONE_VERIFICATION_CODE))
    .then(() => knex.schema.dropTableIfExists(Table.EMAIL_VERIFICATION_CODE));
};
