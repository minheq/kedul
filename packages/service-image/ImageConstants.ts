import { Breakpoint } from '@kedul/common-config';
import { UserValidationError } from '@kedul/common-utils';

import { PredefinedImageSize } from './ImageTypes';

export enum Event {
  IMAGE_UPLOADED = 'IMAGE_UPLOADED',
  IMAGE_DELETED = 'IMAGE_DELETED',
}

export enum UserErrorCode {
  /** Image format does not match .jpg, .jpeg, .png */
  WRONG_IMAGE_FORMAT = 'WRONG_IMAGE_FORMAT',
}

export const userErrors = {
  wrongImageFormat: (validationErrors: UserValidationError[] = []) => ({
    code: UserErrorCode.WRONG_IMAGE_FORMAT,
    errors: validationErrors,
    message: 'Image format does not match .jpg, .jpeg, .png',
  }),
};

export const IMAGE_SIZE_MAPPING = {
  [Breakpoint.SMALL]: PredefinedImageSize.SMALL,
  [Breakpoint.MEDIUM]: PredefinedImageSize.MEDIUM,
  [Breakpoint.LARGE]: PredefinedImageSize.LARGE,
  [Breakpoint.XLARGE]: PredefinedImageSize.XLARGE,
  [Breakpoint.XXLARGE]: PredefinedImageSize.XXLARGE,
};
