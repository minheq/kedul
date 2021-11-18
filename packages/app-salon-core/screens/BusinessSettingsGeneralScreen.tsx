import {
  DangerButtonWithConfirmDialog,
  Header,
  useI18n,
} from '@kedul/common-client';
import { Box, Column, Container, Row } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { useCurrentLocation } from '../components/CurrentLocationProvider';
import { CurrentBusiness } from '../components/CurrentBusiness';
import { useCurrentBusiness } from '../components/CurrentBusinessProvider';
import { ScreenWrapper } from '../components/ScreenWrapper';
import {
  BusinessFragment,
  useCurrentBusinessQuery,
  useCurrentUserQuery,
  useDeleteBusinessForm,
} from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { useNavigation } from '../components/useNavigation';
import { CurrentUser } from '../components/CurrentUser';

export const BusinessSettingsGeneralScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUser>
      <CurrentBusiness>
        {currentBusiness => (
          <ScreenWrapper>
            <Header
              left={<BackButton to="BusinessSettings" />}
              title={i18n.t('General settings')}
            />
            <ScrollView>
              <Container>
                <Row>
                  <Column>
                    <Box paddingBottom={60}>
                      <BusinessSettingsGeneral business={currentBusiness} />
                    </Box>
                  </Column>
                </Row>
              </Container>
            </ScrollView>
          </ScreenWrapper>
        )}
      </CurrentBusiness>
    </CurrentUser>
  );
};

interface BusinessSettingsGeneralProps {
  business: BusinessFragment;
}

const BusinessSettingsGeneral = (props: BusinessSettingsGeneralProps) => {
  const { business } = props;
  const i18n = useI18n();
  const { navigate } = useNavigation();
  const { refetch: refetchCurrentUser } = useCurrentUserQuery();
  const { unsetCurrentLocation } = useCurrentLocation();
  const { unsetCurrentBusiness } = useCurrentBusiness();
  const { refetch: refetchCurrentBusiness } = useCurrentBusinessQuery();

  const form = useDeleteBusinessForm({
    initialValues: {
      id: business.id,
    },

    onCompleted: async () => {
      navigate('ProfileMenu');

      await unsetCurrentLocation();
      await unsetCurrentBusiness();
      await refetchCurrentUser();
      await refetchCurrentBusiness();
    },
  });

  return (
    <DangerButtonWithConfirmDialog
      title={i18n.t('Delete business')}
      confirmTitle={i18n.t('Are you sure you want to delete this business?')}
      onConfirm={form.submitForm}
      testID="DELETE_BUSINESS"
    />
  );
};
