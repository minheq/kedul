import { Header, useI18n } from '@kedul/common-client';
import { Container } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { CurrentLocation } from '../components/CurrentLocation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { SectionWrapper } from '../components/SectionWrapper';
import { LocationFragment } from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { ListItemLink } from '../components/ListItemLink';
import { AvatarProfile } from '../components/AvatarProfile';
import { Link } from '../components/Link';

export const LocationSettingsScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentLocation>
      {currentLocation => (
        <ScreenWrapper>
          <Header
            left={<BackButton to="ProfileMenu" />}
            title={i18n.t('Location settings')}
          />
          <ScrollView>
            <Container>
              <LocationProfileSection location={currentLocation} />
              <LocationSettingsSection />
            </Container>
          </ScrollView>
        </ScreenWrapper>
      )}
    </CurrentLocation>
  );
};

export interface LocationProfileSectionProps {
  location: LocationFragment;
}

const LocationProfileSection = (props: LocationProfileSectionProps) => {
  const { location } = props;
  const i18n = useI18n();

  return (
    <SectionWrapper>
      <Link
        to="LocationProfile"
        params={{ locationId: location.id }}
        testID="VIEW_PROFILE"
      >
        <AvatarProfile
          name={location.name}
          description={i18n.t('View profile')}
        />
      </Link>
    </SectionWrapper>
  );
};

const LocationSettingsSection = () => {
  const i18n = useI18n();

  return (
    <SectionWrapper>
      <SectionTitle title={i18n.t('Settings')} />
      <ListItemLink
        to="LocationSettingsGeneral"
        title={i18n.t('General')}
        testID="LOCATION_SETTINGS_GENERAL"
      />
    </SectionWrapper>
  );
};
