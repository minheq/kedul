import { Text, ControlSize } from 'paramount-ui';
import React from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { NavigationParams } from 'react-navigation';

import { RouteName } from './RouteName';
import { useNavigation } from './useNavigation';

export interface LinkProps<TRouteName> {
  children?: React.ReactNode;
  to?: TRouteName;
  routeKey?: string;
  onPress?: (event: GestureResponderEvent) => void;
  params?: NavigationParams;
  style?: ViewStyle;
  testID?: string;
  action?: any;
  size?: ControlSize | number;
}

export const Link = (props: LinkProps<RouteName>) => {
  const {
    children,
    to,
    params,
    style,
    testID,
    size = 'medium',
    routeKey,
    onPress = () => {},
  } = props;
  const { navigate } = useNavigation();

  return (
    <TouchableOpacity
      testID={testID}
      style={style}
      onPress={e => {
        e.preventDefault();

        onPress(e);
        if (to) navigate({ routeName: to, params, key: routeKey });
      }}
    >
      {typeof children === 'string' ? (
        <Text color="link" size={size}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};
