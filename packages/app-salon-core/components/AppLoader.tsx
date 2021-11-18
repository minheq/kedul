import { useI18n } from '@kedul/common-client';
import { Box } from 'paramount-ui';
import React from 'react';

import { useCurrentUser } from './CurrentUserProvider';
import { useCurrentBusiness } from './CurrentBusinessProvider';
import { useCurrentLocation } from './CurrentLocationProvider';
import { Loading } from './Loading';

export interface RootProps {
  children?: React.ReactNode;
}

/**
 * Shows a spinner while all initialization data is being loaded for the app
 */
export const AppLoader = (props: RootProps) => {
  const { children } = props;
  const { isI18nLoading } = useI18n();
  const { isUserLoading } = useCurrentUser();
  const { isBusinessLoading } = useCurrentBusiness();
  const { isLocationLoading } = useCurrentLocation();
  const [hasDataLoadedOnce, setHasDataLoadedOnce] = React.useState(false);

  React.useEffect(() => {
    if (
      !hasDataLoadedOnce &&
      !isI18nLoading &&
      !isUserLoading &&
      !isBusinessLoading &&
      !isLocationLoading
    ) {
      setHasDataLoadedOnce(true);
    }
  }, [
    isI18nLoading,
    isUserLoading,
    isBusinessLoading,
    isLocationLoading,
    hasDataLoadedOnce,
  ]);

  if (!hasDataLoadedOnce) {
    return <Loading />;
  }

  return <Box height="100%">{children}</Box>;
};
