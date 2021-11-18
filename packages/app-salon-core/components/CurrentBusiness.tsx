import { isFunction } from 'lodash';
import React from 'react';

import { CurrentBusinessFragment } from '../generated/MutationsAndQueries';
import { BusinessAndLocationSelectionScreen } from '../screens';

import { Loading } from './Loading';
import { useCurrentBusiness } from './CurrentBusinessProvider';

export interface CurrentBusinessProps {
  children:
    | ((currentBusiness: CurrentBusinessFragment) => React.ReactNode)
    | React.ReactNode;
}

export const CurrentBusiness = (props: CurrentBusinessProps) => {
  const { children } = props;
  const { isBusinessLoading, currentBusiness } = useCurrentBusiness();

  if (isBusinessLoading) return <Loading />;
  if (!currentBusiness) return <BusinessAndLocationSelectionScreen />;

  if (isFunction(children)) return <>{children(currentBusiness)}</>;

  return <>{children}</>;
};
