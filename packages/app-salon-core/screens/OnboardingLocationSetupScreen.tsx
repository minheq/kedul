import { Header, SubmitBottomBar, useI18n } from '@kedul/common-client';
import { Box, Container } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { CurrentBusiness } from '../components/CurrentBusiness';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { BackButton } from '../components/BackButton';
import { useNavigation } from '../components/useNavigation';
import { CurrentUser } from '../components/CurrentUser';
import { AddLink } from '../components/AddLink';
import { ScreenTitle } from '../components/ScreenTitle';

export const OnboardingLocationSetupScreen = () => {
  const i18n = useI18n();
  const { navigate } = useNavigation();

  return (
    <CurrentUser>
      <CurrentBusiness>
        <ScreenWrapper>
          <Header left={<BackButton to="OnboardingLocationCreation" />} />
          <ScrollView>
            <Container>
              <ScreenTitle title={i18n.t('Setup location')} />
              <Box paddingBottom={24}>
                <AddLink to="CalendarOverview">
                  {i18n.t('Add services')}
                </AddLink>
              </Box>
              <Box paddingVertical={24}>
                <AddLink to="CalendarOverview">
                  {i18n.t('Add products')}
                </AddLink>
              </Box>
              <Box paddingVertical={24}>
                <AddLink to="CalendarOverview">
                  {i18n.t('Add employee')}
                </AddLink>
              </Box>
            </Container>
          </ScrollView>
          <SubmitBottomBar
            onPress={() => navigate('CalendarOverview')}
            title={i18n.t('Next')}
            testID="NEXT"
          />
        </ScreenWrapper>
      </CurrentBusiness>
    </CurrentUser>
  );
};
