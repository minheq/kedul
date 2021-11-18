import { getOsEnv } from '@kedul/common-utils';

export const env = {
  mail: {
    config: {
      from: getOsEnv('MAIL_CONFIG_FROM'),
    },
  },
  nodeEnv: getOsEnv('NODE_ENV'),
  services: {
    aws: {
      pinpoint: {
        applicationId: getOsEnv('AWS_PINPOINT_APPLICATION_ID'),
        region: getOsEnv('AWS_PINPOINT_REGION'),
      },
      ses: {
        region: getOsEnv('AWS_SES_REGION'),
      },
    },
  },
};
