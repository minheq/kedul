import React from 'react';
import { addWeeks, endOfDay, startOfDay } from 'date-fns';

import {
  useEmployeesAndShiftsQuery,
  useEmployeesQuery,
} from '../generated/MutationsAndQueries';

import { useCurrentLocation } from './CurrentLocationProvider';

export const useEmployeeRefetch = () => {
  const { currentLocation } = useCurrentLocation();

  if (!currentLocation) {
    throw new Error('Current location expected');
  }

  const { refetch: refetchEmployeesAndShifts } = useEmployeesAndShiftsQuery({
    variables: {
      locationId: currentLocation.id,
      filter: {
        startDate: startOfDay(new Date()),
        endDate: addWeeks(endOfDay(new Date()), 2),
      },
    },
  });

  const { refetch: refetchEmployees } = useEmployeesQuery({
    variables: { locationId: currentLocation.id },
  });

  return React.useCallback(async () => {
    await refetchEmployeesAndShifts();
    await refetchEmployees();
  }, [refetchEmployees, refetchEmployeesAndShifts]);
};
