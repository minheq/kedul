import { getOsEnv } from '@kedul/common-utils';

export const env = {
  database: {
    config: {
      client: getOsEnv('DATABASE_CLIENT'),
      connection: getOsEnv('DATABASE_CONNECTION'),
      name: getOsEnv('DATABASE_NAME'),
    },
  },
  nodeEnv: getOsEnv('NODE_ENV'),
};
