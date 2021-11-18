import { Box, Dots, useTheme } from 'paramount-ui';
import React from 'react';

export const Loading = () => {
  const theme = useTheme();
  return (
    <Box height="100%" width="100%" justifyContent="center" alignItems="center">
      <Dots color={theme.colors.background.primaryDark} />
    </Box>
  );
};
