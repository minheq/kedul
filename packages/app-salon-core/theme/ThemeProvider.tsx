import {
  LayoutProvider,
  ThemeProvider as ThemeProviderBase,
} from 'paramount-ui';
import React from 'react';

import { theme } from './theme';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const { children } = props;

  return (
    <ThemeProviderBase value={theme}>
      <LayoutProvider>{children}</LayoutProvider>
    </ThemeProviderBase>
  );
};
