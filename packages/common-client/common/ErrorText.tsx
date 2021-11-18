import { Text, TextProps } from 'paramount-ui';
import React from 'react';

export const ErrorText = (props: TextProps) => {
  return <Text color="danger" {...props} />;
};
