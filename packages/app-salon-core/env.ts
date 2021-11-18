import { getOsEnv } from '@kedul/common-utils';

const getNormalizedOsEnv = (variable: string) => {
  return getOsEnv(variable) || getOsEnv(`REACT_APP_${variable}`);
};

export const env = {
  gateway: {
    graphqlUri:
      getNormalizedOsEnv('GATEWAY_GRAPHQL_URI') || 'http://localhost:4000/',
  },

  services: {
    facebook: {
      appId: getNormalizedOsEnv('FACEBOOK_APP_ID'),
    },

    google: {
      clientId: getNormalizedOsEnv('GOOGLE_CLIENT_ID'),
    },
  },
};
