import { isFunction } from 'lodash';
import React from 'react';

import { LocationFragment } from '../generated/MutationsAndQueries';
import { BusinessAndLocationSelectionScreen } from '../screens';

import { Loading } from './Loading';
import { useCurrentLocation } from './CurrentLocationProvider';

export interface CurrentLocationProps {
  children:
    | ((currentLocation: LocationFragment) => React.ReactNode)
    | React.ReactNode;
}

export const CurrentLocation = (props: CurrentLocationProps) => {
  const { children } = props;
  const { isLocationLoading, currentLocation } = useCurrentLocation();

  if (isLocationLoading) return <Loading />;
  if (!currentLocation) return <BusinessAndLocationSelectionScreen />;

  if (isFunction(children)) return <>{children(currentLocation)}</>;

  return <>{children}</>;
};
