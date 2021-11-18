import { TextInput, TextInputProps } from 'paramount-ui';
import React from 'react';

export const OneTimeCodeInput = (props: TextInputProps) => {
  return (
    <TextInput
      textContentType="oneTimeCode"
      keyboardType="number-pad"
      {...props}
    />
  );
};
