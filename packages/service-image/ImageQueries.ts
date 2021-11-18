import { RequestContext } from '@kedul/common-server';

import { Image, PredefinedImageSize } from './ImageTypes';
import { enhance } from './RequestContext';

export interface QueryFindImageByIdArgs {
  id: string;
  size?: PredefinedImageSize | null;
}

export const findImageById = async (
  input: QueryFindImageByIdArgs,
  context: RequestContext,
): Promise<Image | null> => {
  const { imageRepository } = enhance(context).repositories;
  const { id, size = PredefinedImageSize.MEDIUM } = input;

  const image = await imageRepository.findById(id);

  if (!image) return null;

  const imageSize = image.sizes.find(s => s.size === size);

  if (imageSize) {
    return {
      ...image,
      width: imageSize.width,
      height: imageSize.height,
      url: imageSize.url,
    };
  }

  return {
    ...image,
    width: image.width,
    height: image.height,
    url: image.url,
  };
};
