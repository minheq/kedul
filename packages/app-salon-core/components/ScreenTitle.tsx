import { Spacing, Heading } from 'paramount-ui';
import React from 'react';

export interface ScreenTitle {
  children?: string;
  title?: string;
}

export const ScreenTitle = (props: ScreenTitle) => {
  const { children, title } = props;

  return (
    <>
      <Heading size="large">{title || children}</Heading>
      <Spacing size="large" />
    </>
  );
};
