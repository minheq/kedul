import { ImageURISource } from 'react-native';

import { Image } from '../generated/MutationsAndQueries';

export const getImageSource = (
  image?: Image | null,
): number | ImageURISource | ImageURISource[] | undefined => {
  if (!image) return undefined;

  return {
    width: image.width,
    uri: image.url,
    height: image.height,
  };
};
