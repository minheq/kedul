import { NavigationContext as NavigationContextBase } from '@react-navigation/core';
import React from 'react';
import { NavigationParams, NavigationState } from 'react-navigation';

import { NavigationContext } from './NavigationContext';

export const useNavigation = <
  S = NavigationState,
  P = NavigationParams
>(): NavigationContext<S, P> => {
  const context = React.useContext(NavigationContextBase);

  // @ts-ignore
  return { ...context, goBack: () => window.history.back() };
};
