import AWS from 'aws-sdk';

import { env } from '../env';
import { CloudStorageProvider, StorageImage } from '../ImageTypes';

import { ImageStorageClient } from './StorageClientInterface';

export const makeS3StorageClient = (): ImageStorageClient => {
  const s3 = new AWS.S3({
    accessKeyId: env.services.aws.accessKeyId,
    secretAccessKey: env.services.aws.secretAccessKey,
  });

  const upload = (image: StorageImage): Promise<AWS.S3.PutObjectOutput> => {
    return new Promise((resolve, reject) => {
      s3.putObject(
        {
          Key: image.key,
          Bucket: env.services.aws.s3.bucket,
          Body: image.buffer,
        },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        },
      );
    });
  };

  return {
    cloudStorageProvider: CloudStorageProvider.S3,
    uploadImages: async images => Promise.all(images.map(upload)),
  };
};
