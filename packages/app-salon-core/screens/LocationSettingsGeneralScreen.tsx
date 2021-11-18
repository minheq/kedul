import {
  DangerButtonWithConfirmDialog,
  Header,
  useI18n,
} from '@kedul/common-client';
import { Container } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { useCurrentLocation } from '../components/CurrentLocationProvider';
import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import {
  LocationFragment,
  useCurrentBusinessQuery,
  useDeleteLocationForm,
} from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { useNavigation } from '../components/useNavigation';

export const LocationSettingsGeneralScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUserBusinessAndLocation>
      {({ currentLocation }) => (
        <ScreenWrapper>
          <Header
            left={<BackButton to="LocationSettings" />}
            title={i18n.t('General settings')}
          />
          <ScrollView>
            <Container>
              <LocationSettingsGeneral location={currentLocation} />
            </Container>
          </ScrollView>
        </ScreenWrapper>
      )}
    </CurrentUserBusinessAndLocation>
  );
};

interface LocationSettingsGeneralProps {
  location: LocationFragment;
}

const LocationSettingsGeneral = (props: LocationSettingsGeneralProps) => {
  const { location } = props;
  const i18n = useI18n();
  const { navigate } = useNavigation();
  const { unsetCurrentLocation } = useCurrentLocation();
  const { refetch: refetchCurrentBusiness } = useCurrentBusinessQuery();

  const form = useDeleteLocationForm({
    initialValues: {
      id: location.id,
    },

    onCompleted: async () => {
      await unsetCurrentLocation();
      await refetchCurrentBusiness();

      navigate('ProfileMenu');
    },
  });

  return (
    <DangerButtonWithConfirmDialog
      title={i18n.t('Delete location')}
      confirmTitle={i18n.t('Are you sure you want to delete this location?')}
      onConfirm={form.submitForm}
      testID="DELETE_LOCATION"
    />
  );
};
