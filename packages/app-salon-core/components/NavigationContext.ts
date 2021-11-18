import {
  NavigationEventCallback,
  NavigationEventSubscription,
  NavigationParams,
} from 'react-navigation';

import { RouteName } from './RouteName';

export interface NavigationContext<S = any, P = NavigationParams> {
  push: (routeName: RouteName, params?: NavigationParams) => boolean;
  replace: (routeName: RouteName, params?: NavigationParams) => boolean;
  pop: (n?: number, params?: { immediate?: boolean }) => boolean;
  popToTop: (params?: { immediate?: boolean }) => boolean;
  state: S & { params?: P };
  goBack: (routeKey?: string | null) => boolean;
  dismiss: () => boolean;
  navigate(routeNameOrOptions: RouteName, params?: NavigationParams): boolean;
  navigate(props: {
    routeName?: RouteName;
    key?: string;
    params?: NavigationParams;
  }): boolean;
  getParam<T extends keyof P>(param: T): P[T];
  addListener: (
    eventName: 'willBlur' | 'willFocus' | 'didFocus' | 'didBlur',
    callback: NavigationEventCallback,
  ) => NavigationEventSubscription;
}
