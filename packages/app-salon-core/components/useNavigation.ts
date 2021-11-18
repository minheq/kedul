import React from 'react';
import {
  NavigationContext as NavigationContextBase,
  NavigationParams,
  NavigationState,
} from 'react-navigation';

import { NavigationContext } from './NavigationContext';

export const useNavigation = <
  S = NavigationState,
  P = NavigationParams
>(): NavigationContext<S, P> => {
  // @ts-ignore
  return React.useContext(NavigationContextBase);
};
