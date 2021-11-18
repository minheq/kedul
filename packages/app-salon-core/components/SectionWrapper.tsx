import { Box } from 'paramount-ui';
import React from 'react';

export interface SectionWrapper {
  children: React.ReactNode;
}

export const SectionWrapper = (props: SectionWrapper) => {
  const { children } = props;

  return <Box paddingBottom={56}>{children}</Box>;
};
