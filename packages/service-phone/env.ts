import { getOsEnv } from '@kedul/common-utils';

export const env = {
  logger: {
    config: {
      level: getOsEnv('LOGGER_LEVEL'),
    },
  },
  nodeEnv: getOsEnv('NODE_ENV'),
  services: {
    aws: {
      pinpoint: {
        applicationId: getOsEnv('AWS_PINPOINT_APPLICATION_ID'),
        region: getOsEnv('AWS_PINPOINT_REGION'),
      },
    },
  },
};
