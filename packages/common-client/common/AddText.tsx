import { Box, Icon, Text, TextProps } from 'paramount-ui';
import React from 'react';

export const AddText = (props: TextProps) => {
  const { children, size = 'medium', color = 'link', ...textProps } = props;

  return (
    <Box flexDirection="row" alignItems="center">
      <Icon
        name="plus"
        size={size === 'medium' ? 24 : size === 'small' ? 16 : size}
        color={color}
      />
      <Text color={color} size={size} {...textProps}>
        {children}
      </Text>
    </Box>
  );
};
