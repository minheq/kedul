import React from 'react';
import { TouchableOpacity } from 'react-native';

import { ImagePickerProps } from './ImagePicker';

export const ImagePicker: React.FunctionComponent<ImagePickerProps> = props => {
  const { children, onSelect = () => {}, isMultiple = false } = props;

  const handleOnChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.currentTarget.files;

      if (files && files.length > 0) {
        if (isMultiple) onSelect(files);
        else onSelect(files.item(0));
      }
    },
    [isMultiple, onSelect],
  );

  return (
    <TouchableOpacity>
      {children}
      <input
        accept="image/png, image/jpg, image/jpeg"
        type="file"
        onChange={handleOnChange}
        multiple
        style={{
          bottom: 0,
          height: '100%',
          left: 0,
          opacity: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          width: '100%',
          zIndex: 1,
        }}
      />
    </TouchableOpacity>
  );
};
