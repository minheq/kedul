import { Link, LinkProps } from '@kedul/app-salon-core';
import React from 'react';

import { WebRouteName } from '../App';

export interface WebLinkProps extends LinkProps<WebRouteName> {}

export const WebLink = (props: WebLinkProps) => {
  // @ts-ignore
  return <Link {...props} />;
};
