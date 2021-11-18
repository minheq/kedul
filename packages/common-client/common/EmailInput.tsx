import { TextInput, TextInputProps } from 'paramount-ui';
import React from 'react';

export const EmailInput = (props: TextInputProps) => {
  return (
    <TextInput
      textContentType="emailAddress"
      keyboardType="email-address"
      testID="EMAIL_INPUT"
      {...props}
    />
  );
};
