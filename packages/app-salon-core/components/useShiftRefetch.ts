import React from 'react';
import { addWeeks, endOfDay, startOfDay } from 'date-fns';

import { useEmployeesAndShiftsQuery } from '../generated/MutationsAndQueries';

import { useCurrentLocation } from './CurrentLocationProvider';

export const useShiftRefetch = () => {
  const { currentLocation } = useCurrentLocation();

  if (!currentLocation) {
    throw new Error('Current location expected');
  }

  const { refetch } = useEmployeesAndShiftsQuery({
    variables: {
      locationId: currentLocation.id,
      filter: {
        startDate: startOfDay(new Date()),
        endDate: addWeeks(endOfDay(new Date()), 2),
      },
    },
  });

  return React.useCallback(async () => {
    await refetch();
  }, [refetch]);
};
