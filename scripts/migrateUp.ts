import path from 'path';

import Knex from 'knex';

export const knex = Knex({
  client: process.env.DATABASE_CLIENT,
  connection: `${process.env.DATABASE_CONNECTION}/${process.env.DATABASE_NAME}`,
  useNullAsDefault: false,
});

// eslint-disable-next-line
const pkg = require(path.join(process.cwd(), 'package.json'));

const migrateUp = async () => {
  // Check database connection
  await knex.raw('select 1+1 as result');

  // Run migrations
  await knex.migrate.latest({
    tableName: `${pkg.name}_migrations`,
  });
};

migrateUp()
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
