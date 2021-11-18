import { Box, Divider, useTheme } from 'paramount-ui';
import React from 'react';

export const BOTTOM_BAR_HEIGHT = 64;

export interface BottomBarProps {
  children?: React.ReactNode;
  isTransparent?: boolean;
}

export const BottomBar = (props: BottomBarProps) => {
  const { children, isTransparent = false } = props;
  const theme = useTheme();

  return (
    <>
      {!isTransparent && <Divider />}
      <Box
        backgroundColor={
          isTransparent ? 'transparent' : theme.colors.background.content
        }
        height={BOTTOM_BAR_HEIGHT}
        justifyContent="center"
      >
        {children}
      </Box>
    </>
  );
};
