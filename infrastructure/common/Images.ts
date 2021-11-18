import { Fn, S3 } from 'cloudform';
import BucketPolicy from 'cloudform-types/types/s3/bucketPolicy';

export const ImagesBucket = new S3.Bucket({
  AccessControl: 'PublicRead',
  WebsiteConfiguration: {
    IndexDocument: 'index.html',
    ErrorDocument: 'error.html',
  },
});

export const ImagesBucketPolicy = new BucketPolicy({
  Bucket: Fn.Ref('ImagesBucket'),
  PolicyDocument: {
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: Fn.Join('', ['arn:aws:s3:::', Fn.Ref('ImagesBucket'), '/*']),
      },
    ],
  },
});
