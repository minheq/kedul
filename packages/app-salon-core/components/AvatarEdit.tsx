import { ImagePicker } from '@kedul/common-client';
import { Avatar } from 'paramount-ui';
import React from 'react';

import { ImageQuery } from '../generated/MutationsAndQueries';

import { getImageSource } from './ImageUtils';

export interface AvatarEditProps {
  imageId?: string | null;
  name?: string;
  onChange?: (imageId: string) => void;
}

export const AvatarEdit = (props: AvatarEditProps) => {
  const { imageId, name, onChange = () => {} } = props;

  // const uploadImages = async (params: any) => {};

  const handleSelect = React.useCallback(files => {
    // uploadImages({ variables: { input: { images: files } } }).then(result => {
    //   if (result && result.data && result.data.uploadImages) {
    //     const image = result.data.uploadImages.images[0];
    //     onChange(image.id);
    //   }
    // });
  }, []);

  return (
    <ImagePicker onSelect={handleSelect}>
      {imageId ? (
        <ImageQuery variables={{ id: imageId }}>
          {({ image }) => (
            <Avatar size="large" source={getImageSource(image)} name={name} />
          )}
        </ImageQuery>
      ) : (
        <Avatar size="large" name={name} />
      )}
    </ImagePicker>
  );
};
