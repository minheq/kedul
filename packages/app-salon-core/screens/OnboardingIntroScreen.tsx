import { Header, useI18n, CloseableModal } from '@kedul/common-client';
import React from 'react';
import { Button, Container, Text, Spacing } from 'paramount-ui';
import { ScrollView } from 'react-native';

import { ScreenWrapper } from '../components/ScreenWrapper';
import { CurrentUser } from '../components/CurrentUser';
import { HeaderLogOutButton } from '../components/HeaderLogOutButton';
import { CurrentUserInvitationsQuery } from '../generated/MutationsAndQueries';
import { SectionWrapper } from '../components/SectionWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { EmployeeInvitation } from '../components/EmployeeInvitation';
import { CreateBusiness } from '../components/BusinessSelect';
import { useNavigation } from '../components/useNavigation';
import { useCurrentBusiness } from '../components/CurrentBusinessProvider';
import { useCurrentLocation } from '../components/CurrentLocationProvider';
import { HeaderGoToProfileButton } from '../components/HeaderGoToProfileButton';

export const OnboardingIntroScreen = () => {
  const i18n = useI18n();
  const { navigate } = useNavigation();
  const { setCurrentBusiness } = useCurrentBusiness();
  const { setCurrentLocation } = useCurrentLocation();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <CurrentUser>
      <ScreenWrapper>
        <Header
          left={<HeaderLogOutButton />}
          right={<HeaderGoToProfileButton />}
        />
        <CurrentUserInvitationsQuery>
          {data => {
            const hasInvitations =
              data.currentUser &&
              data.currentUser.employeeInvitations &&
              data.currentUser.employeeInvitations.length > 0;

            if (hasInvitations) {
              return (
                <ScrollView>
                  <Container>
                    <SectionWrapper>
                      <SectionTitle title={i18n.t('Invitations')} />
                      {data.currentUser &&
                        data.currentUser.employeeInvitations.map(invitation => (
                          <EmployeeInvitation
                            key={invitation.id}
                            invitation={invitation}
                            onAccepted={async (business, location) => {
                              await setCurrentBusiness(business);
                              await setCurrentLocation(location);

                              navigate('CalendarOverview');
                            }}
                          />
                        ))}
                    </SectionWrapper>
                    <Text align="center">{i18n.t('OR')}</Text>
                    <Spacing size="xxlarge" />
                    <SectionWrapper>
                      <SectionTitle title={i18n.t('Setup business')} />
                      <Button
                        onPress={() => setIsModalOpen(true)}
                        color="primary"
                        appearance="primary"
                        title={i18n.t('Setup your business')}
                        testID="SETUP_BUSINESS"
                      />
                      <CloseableModal
                        isVisible={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                      >
                        <CreateBusiness
                          onCompleted={async business => {
                            await setCurrentBusiness(business);

                            navigate('OnboardingLocationCreation');
                          }}
                        />
                      </CloseableModal>
                    </SectionWrapper>
                  </Container>
                </ScrollView>
              );
            }

            return (
              <CreateBusiness
                onCompleted={async business => {
                  await setCurrentBusiness(business);

                  navigate('OnboardingLocationCreation');
                }}
              />
            );
          }}
        </CurrentUserInvitationsQuery>
      </ScreenWrapper>
    </CurrentUser>
  );
};
