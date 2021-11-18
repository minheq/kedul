import { getOsEnv } from '@kedul/common-utils';

const getNormalizedOsEnv = (variable: string) => {
  return (
    getOsEnv(variable) ||
    getOsEnv(`STORYBOOK_${variable}`) ||
    getOsEnv(`REACT_APP_${variable}`)
  );
};

export const env = {
  nodeEnv: getOsEnv('NODE_ENV'),

  logger: {
    level: getOsEnv('LOGGER_LEVEL') || 'info',
  },

  services: {
    locize: {
      apiKey: getNormalizedOsEnv('LOCIZE_API_KEY'),
      projectId: getNormalizedOsEnv('LOCIZE_PROJECT_ID'),
    },
  },
};
