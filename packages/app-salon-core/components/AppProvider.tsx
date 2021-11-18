import { AnalyticsProvider, I18nProvider } from '@kedul/common-client';
import { LayoutProvider } from 'paramount-ui';
import React from 'react';

import { ThemeProvider } from '../theme/ThemeProvider';

import { CurrentBusinessProvider } from './CurrentBusinessProvider';
import { CurrentLocationProvider } from './CurrentLocationProvider';
import { PermissionsProvider } from './PermissionsProvider';
import { CurrentUserProvider } from './CurrentUserProvider';
import { EnhancedGraphQLProvider } from './EnhancedGraphQLProvider';

export interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Providers for the app
 */
export const AppProvider = (props: AppProviderProps) => {
  const { children } = props;

  return (
    <I18nProvider>
      <AnalyticsProvider>
        <ThemeProvider>
          <LayoutProvider>
            <EnhancedGraphQLProvider>
              <CurrentUserProvider>
                <CurrentBusinessProvider>
                  <CurrentLocationProvider>
                    <PermissionsProvider>{children}</PermissionsProvider>
                  </CurrentLocationProvider>
                </CurrentBusinessProvider>
              </CurrentUserProvider>
            </EnhancedGraphQLProvider>
          </LayoutProvider>
        </ThemeProvider>
      </AnalyticsProvider>
    </I18nProvider>
  );
};
