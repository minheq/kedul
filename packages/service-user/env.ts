import { getOsEnv } from '@kedul/common-utils';

export const env = {
  secrets: {
    accessToken: getOsEnv('ACCESS_TOKEN_SECRET') || 'super secret',
  },

  services: {
    google: {
      clientId: getOsEnv('GOOGLE_CLIENT_ID'),
    },
  },
};
