import { ListItem, ListItemProps, ListItemOverrides } from 'paramount-ui';
import React from 'react';

import { Link, LinkProps } from './Link';
import { RouteName } from './RouteName';

export interface ListItemLinkProps
  extends LinkProps<RouteName>,
    ListItemProps {}

export const ListItemLink = (props: ListItemLinkProps) => {
  const {
    to,
    params,
    style,
    testID,
    routeKey,
    onPress,
    overrides,
    ...listItemProps
  } = props;

  const Touchable = ({ children }: ListItemOverrides['Touchable']) => (
    <Link
      to={to}
      params={params}
      testID={testID}
      onPress={onPress}
      routeKey={routeKey}
      style={{
        height: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        ...style,
      }}
    >
      {children}
    </Link>
  );

  return (
    <ListItem
      isDisabled
      size="large"
      overrides={{
        Touchable: {
          component: Touchable,
        },
        ...overrides,
      }}
      {...listItemProps}
    />
  );
};
