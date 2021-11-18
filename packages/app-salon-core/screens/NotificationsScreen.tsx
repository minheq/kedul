import { Header, useI18n } from '@kedul/common-client';
import { Box, Column, Container, Row, Text } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { Loading } from '../components/Loading';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { useCurrentUserInvitationsQuery } from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { CurrentUser } from '../components/CurrentUser';

export const NotificationsScreen = () => {
  const i18n = useI18n();
  const { data, loading } = useCurrentUserInvitationsQuery();

  if (loading) return <Loading />;

  const hasInvitations = !!(
    data &&
    data.currentUser &&
    data.currentUser.employeeInvitations &&
    data.currentUser.employeeInvitations.length > 0
  );

  const hasNotifications = hasInvitations;

  return (
    <CurrentUser>
      <ScreenWrapper>
        <ScrollView>
          <Header
            left={<BackButton to="ProfileMenu" />}
            title={i18n.t('Notifications')}
          />
          <Container size="small">
            <Row>
              <Column>
                {hasInvitations && (
                  <>
                    <SectionTitle title={i18n.t('Invitations')} />
                    <Box paddingBottom={40} />
                  </>
                )}
                {!hasNotifications && (
                  <Box paddingVertical={40}>
                    <Text>{i18n.t('Notifications will appear here')}</Text>
                  </Box>
                )}
              </Column>
            </Row>
          </Container>
        </ScrollView>
      </ScreenWrapper>
    </CurrentUser>
  );
};
