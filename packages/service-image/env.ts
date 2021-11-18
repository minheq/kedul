import { getOsEnv } from '@kedul/common-utils';

export const env = {
  nodeEnv: getOsEnv('NODE_ENV'),
  services: {
    aws: {
      s3: {
        bucket: getOsEnv('AWS_S3_IMAGES_BUCKET'),
        region: getOsEnv('AWS_S3_IMAGES_BUCKET_REGION'),
      },
      accessKeyId: getOsEnv('AWS_ACCESS_KEY'),
      secretAccessKey: getOsEnv('AWS_SECRET_KEY'),
    },
  },
};
