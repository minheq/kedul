import { useI18n } from '@kedul/common-client';
import { Text } from 'paramount-ui';
import React from 'react';

import {
  LocationFragment,
  LocationQuery,
} from '../generated/MutationsAndQueries';

import { useNavigation } from './useNavigation';

export interface LocationFromNavigationParamProps {
  children: (location: LocationFragment) => React.ReactNode;
}

export const LocationFromNavigationParam = (
  props: LocationFromNavigationParamProps,
) => {
  const { children } = props;
  const { getParam } = useNavigation();
  const i18n = useI18n();
  const locationId = getParam('locationId') as string | null;

  if (!locationId) throw new Error('Expected locationId param');

  return (
    <LocationQuery variables={{ id: locationId }}>
      {({ location }) => {
        if (!location) {
          return <Text>{i18n.t('Location not found')}</Text>;
        }

        return <>{children(location)}</>;
      }}
    </LocationQuery>
  );
};
