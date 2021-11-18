import { getOsEnv } from '@kedul/common-utils';
import Knex from 'knex';

const env = {
  database: {
    config: {
      client: getOsEnv('DATABASE_CLIENT'),
      connection: getOsEnv('DATABASE_CONNECTION'),
      name: getOsEnv('DATABASE_NAME'),
    },
  },
};

const knex = Knex({
  client: env.database.config.client,
  connection: `${env.database.config.connection}/postgres`,
});

const dropDb = async () => {
  await knex.raw(`DROP DATABASE IF EXISTS ${env.database.config.name}`);
};

dropDb()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    knex.destroy();
  });
