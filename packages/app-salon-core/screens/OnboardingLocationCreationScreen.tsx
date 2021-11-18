import { Header, SubmitBottomBar, useI18n } from '@kedul/common-client';
import { Container } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { LocationNameEditForm } from '../components/LocationNameEditForm';
import { useCurrentLocation } from '../components/CurrentLocationProvider';
import { CurrentBusiness } from '../components/CurrentBusiness';
import { ScreenWrapper } from '../components/ScreenWrapper';
import {
  useCreateLocationForm,
  useCurrentBusinessQuery,
} from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { useNavigation } from '../components/useNavigation';
import { CurrentUser } from '../components/CurrentUser';
import { ScreenTitle } from '../components/ScreenTitle';

export const OnboardingLocationCreationScreen = () => {
  const i18n = useI18n();
  const { navigate } = useNavigation();
  const { setCurrentLocation } = useCurrentLocation();
  const { refetch } = useCurrentBusinessQuery();

  const form = useCreateLocationForm({
    initialValues: { name: '' },

    onCompleted: async data => {
      if (!data.createLocation || !data.createLocation.location) {
        throw new Error('Expected data');
      }

      setCurrentLocation(data.createLocation.location);

      await refetch();

      navigate('OnboardingLocationSetup');
    },
  });

  return (
    <CurrentUser>
      <CurrentBusiness>
        <ScreenWrapper>
          <Header left={<BackButton to="OnboardingIntro" />} />
          <ScrollView>
            <Container>
              <ScreenTitle title={i18n.t('Create location')} />
              <LocationNameEditForm form={form as LocationNameEditForm} />
            </Container>
          </ScrollView>
          <SubmitBottomBar
            isLoading={form.isSubmitting}
            onPress={form.submitForm}
            title={i18n.t('Next')}
            testID="NEXT"
          />
        </ScreenWrapper>
      </CurrentBusiness>
    </CurrentUser>
  );
};
