import { Header, useI18n } from '@kedul/common-client';
import { Container } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { CurrentBusiness } from '../components/CurrentBusiness';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { SectionWrapper } from '../components/SectionWrapper';
import { BackButton } from '../components/BackButton';
import { ListItemLink } from '../components/ListItemLink';
import { AvatarProfile } from '../components/AvatarProfile';
import { Link } from '../components/Link';

export const BusinessSettingsScreen = () => {
  const i18n = useI18n();

  return (
    <ScreenWrapper>
      <Header
        left={<BackButton to="ProfileMenu" />}
        title={i18n.t('Business settings')}
      />
      <ScrollView>
        <Container>
          <BusinessProfileSection />
          <BusinessSettingsSection />
        </Container>
      </ScrollView>
    </ScreenWrapper>
  );
};

const BusinessProfileSection = () => {
  return (
    <SectionWrapper>
      <CurrentBusiness>
        {currentBusiness => (
          <Link
            to="BusinessProfile"
            params={{ businessId: currentBusiness.id }}
            testID="VIEW_PROFILE"
          >
            <AvatarProfile
              name={currentBusiness.name}
              image={currentBusiness.logoImage}
            />
          </Link>
        )}
      </CurrentBusiness>
    </SectionWrapper>
  );
};

const BusinessSettingsSection = () => {
  const i18n = useI18n();

  return (
    <SectionWrapper>
      <SectionTitle title={i18n.t('Settings')} />
      <ListItemLink
        to="BusinessSettingsGeneral"
        title={i18n.t('General')}
        testID="BUSINESS_SETTINGS_GENERAL"
      />
      <ListItemLink to="BusinessSettingsBilling" title={i18n.t('Billing')} />
    </SectionWrapper>
  );
};
