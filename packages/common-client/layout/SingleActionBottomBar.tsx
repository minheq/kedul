import { Button, ButtonProps } from 'paramount-ui';
import React from 'react';

import { BottomBar } from './BottomBar';

export interface SingleActionBottomBarProps extends ButtonProps {
  isTransparent?: boolean;
}

export const SingleActionBottomBar = (props: SingleActionBottomBarProps) => {
  const { isTransparent, ...buttonProps } = props;

  return (
    <BottomBar isTransparent={isTransparent}>
      <Button {...buttonProps} />
    </BottomBar>
  );
};
