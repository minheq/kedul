import { AddText } from '@kedul/common-client';
import React from 'react';

import { Link, LinkProps } from './Link';
import { RouteName } from './RouteName';

export const AddLink = (props: LinkProps<RouteName>) => {
  const {
    children,
    to,
    params,
    style,
    onPress,
    testID,
    routeKey,
    size = 'medium',
  } = props;

  return (
    <Link
      to={to}
      params={params}
      testID={testID}
      style={style}
      onPress={onPress}
      routeKey={routeKey}
    >
      <AddText size={size}>{children}</AddText>
    </Link>
  );
};
