import React from 'react';

import { useCurrentBusiness } from '../components/CurrentBusinessProvider';
import { Loading } from '../components/Loading';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useCurrentLocation } from '../components/CurrentLocationProvider';
import { useNavigation } from '../components/useNavigation';
import { useCurrentUser } from '../components/CurrentUserProvider';

export const AuthLoadingScreen = () => {
  const { currentUser } = useCurrentUser();
  const { currentBusiness } = useCurrentBusiness();
  const { currentLocation } = useCurrentLocation();
  const { navigate } = useNavigation();

  React.useEffect(() => {
    if (currentUser) {
      if (currentBusiness && currentLocation) {
        navigate('CalendarOverview');
      } else if (!!currentUser.businesses.length) {
        navigate('BusinessAndLocationSelection');
      } else {
        navigate('OnboardingIntro');
      }
    } else {
      navigate('Login');
    }
  }, [currentUser, currentBusiness, currentLocation, navigate]);

  return (
    <ScreenWrapper>
      <Loading />
    </ScreenWrapper>
  );
};
