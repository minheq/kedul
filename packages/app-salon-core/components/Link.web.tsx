import { NavigationActions } from '@react-navigation/core';
import { Text } from 'paramount-ui';
import * as queryString from 'query-string';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { LinkProps } from './Link';
import { RouteName } from './RouteName';
import { useNavigation } from './useNavigation';

const getTopNavigation = (navigation: any): any => {
  const parent = navigation.dangerouslyGetParent();
  if (parent) {
    return getTopNavigation(parent);
  }
  return navigation;
};

const useHref = ({ action, to, params, routeKey }: LinkProps<RouteName>) => {
  const navigation = useNavigation();
  const topNavigation = getTopNavigation(navigation);
  const topRouter = topNavigation.router;
  const navAction =
    action ||
    NavigationActions.navigate({
      routeName: to,
      key: routeKey,
      params,
    });

  const navActionResponse = topRouter.getStateForAction(
    navAction,
    topNavigation.state,
  );
  const nextState =
    navActionResponse === null ? topNavigation.state : navActionResponse;
  const pathAndParams = topRouter.getPathAndParamsForState(nextState);

  return Object.keys(pathAndParams.params).length
    ? `/${pathAndParams.path}?${queryString.stringify(pathAndParams.params)}`
    : `/${pathAndParams.path}`;
};

export const Link = (props: LinkProps<RouteName>) => {
  const {
    children,
    to,
    params,
    style,
    testID,
    onPress = () => {},
    routeKey,
    ...textProps
  } = props;
  const { navigate } = useNavigation();
  const href = useHref({ params, to });

  return (
    <a
      data-testid={testID}
      href={href}
      onClick={e => {
        e.preventDefault();

        if (to) navigate({ routeName: to, params, key: routeKey });
      }}
      // @ts-ignore
      style={{
        textDecoration: 'none',
        alignItems: 'stretch',
        border: '0 solid black',
        boxSizing: 'border-box',
        display: 'flex',
        flexBasis: 'auto',
        flexDirection: 'column',
        flexShrink: 0,
        margin: 0,
        minHeight: 0,
        minWidth: 0,
        padding: 0,
        position: 'relative',
        zIndex: 0,
        ...style,
      }}
    >
      <TouchableOpacity onPress={onPress} style={style} accessible={false}>
        {typeof children === 'string' ? (
          <Text color="link" {...textProps}>
            {children}
          </Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    </a>
  );
};
