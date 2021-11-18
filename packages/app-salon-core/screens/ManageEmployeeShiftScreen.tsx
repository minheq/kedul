import { Header } from '@kedul/common-client';
import React from 'react';

import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { BackButton } from '../components/BackButton';
import { ShiftFromNavigationParam } from '../components/ShiftFromNavigationParam';
import { ShiftDetails } from '../components/ShiftDetails';
import { useNavigation } from '../components/useNavigation';

export const ManageEmployeeShiftScreen = () => {
  const { navigate } = useNavigation();

  return (
    <CurrentUserBusinessAndLocation>
      <ShiftFromNavigationParam>
        {shift => (
          <ScreenWrapper>
            <Header left={<BackButton to="ManageEmployeeShifts" />} />
            <ShiftDetails
              id={shift.id}
              onCanceled={async () => {
                navigate('ManageEmployeeShifts');
              }}
            />
          </ScreenWrapper>
        )}
      </ShiftFromNavigationParam>
    </CurrentUserBusinessAndLocation>
  );
};
