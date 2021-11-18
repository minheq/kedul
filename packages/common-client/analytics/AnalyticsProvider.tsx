import React from 'react';

import { AnalyticsClientInterface } from './AnalyticsClientInterface';
import { AnalyticsContext, createAnalyticsProvider } from './AnalyticsContext';
import { ConsoleAnalyticsClient } from './ConsoleAnalyticsClient';

export interface AnalyticsProviderProps {
  children: React.ReactNode;
  clients?: AnalyticsClientInterface[];
}

export const AnalyticsProvider = (props: AnalyticsProviderProps) => {
  const { clients = [ConsoleAnalyticsClient], children } = props;

  return (
    <AnalyticsContext.Provider value={createAnalyticsProvider(clients)}>
      {children}
    </AnalyticsContext.Provider>
  );
};
