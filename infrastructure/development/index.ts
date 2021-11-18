import cloudform from 'cloudform';

import { ImagesBucket, ImagesBucketPolicy } from '../common/Images';

export default cloudform({
  Description: 'Kedul development infrastructure',
  Resources: {
    ImagesBucket,
    ImagesBucketPolicy,
  },
});
