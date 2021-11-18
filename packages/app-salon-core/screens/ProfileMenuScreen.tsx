import { Header, useI18n, CloseableModal } from '@kedul/common-client';
import { Column, Container, Row, Text } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { useCurrentBusiness } from '../components/CurrentBusinessProvider';
import { AppBottomNavigationBar } from '../components/AppBottomNavigationBar';
import { ScreenTitle } from '../components/ScreenTitle';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { SectionWrapper } from '../components/SectionWrapper';
import { CurrentUserFragment } from '../generated/MutationsAndQueries';
import { useCurrentLocation } from '../components/CurrentLocationProvider';
import { ListItemLink } from '../components/ListItemLink';
import { useNavigation } from '../components/useNavigation';
import { useCurrentUser } from '../components/CurrentUserProvider';
import { getUserAvatar } from '../components/UserProfileUtils';
import { Link } from '../components/Link';
import { LocationSelect } from '../components/LocationSelect';
import { BusinessSelect } from '../components/BusinessSelect';
import { CurrentUser } from '../components/CurrentUser';
import { getImageSource } from '../components/ImageUtils';

import { EditUserProfile } from './UserProfileScreen';

export const ProfileMenuScreen = () => {
  const i18n = useI18n();
  const { unsetUser } = useCurrentUser();
  const { navigate } = useNavigation();
  const { unsetCurrentBusiness } = useCurrentBusiness();
  const { unsetCurrentLocation } = useCurrentLocation();

  const handleLogOut = React.useCallback(async () => {
    await unsetCurrentBusiness();
    await unsetCurrentLocation();
    await unsetUser();

    navigate('Login');
  }, [navigate, unsetUser, unsetCurrentBusiness, unsetCurrentLocation]);

  return (
    <CurrentUser>
      {currentUser => (
        <ScreenWrapper>
          <ScrollView>
            <Header />
            <Container>
              <Row>
                <Column>
                  <ScreenTitle>{i18n.t('Profile')}</ScreenTitle>
                  <ProfileSection currentUser={currentUser} />
                  <AccountSettingsSection />
                  <SupportSection />
                  <LegalSection />
                  <SectionWrapper>
                    <Text onPress={handleLogOut} color="muted" testID="LOG_OUT">
                      {i18n.t('Log out')}
                    </Text>
                  </SectionWrapper>
                </Column>
              </Row>
            </Container>
          </ScrollView>
          <AppBottomNavigationBar />
        </ScreenWrapper>
      )}
    </CurrentUser>
  );
};

interface ProfileSectionProps {
  currentUser: CurrentUserFragment;
}

const ProfileSection = (props: ProfileSectionProps) => {
  const { currentUser } = props;

  return (
    <SectionWrapper>
      <CurrentUserListItemLink currentUser={currentUser} />
      <CurrentBusinessListItemLink currentUser={currentUser} />
      <CurrentLocationListItemLink />
    </SectionWrapper>
  );
};

const changeStyle = {
  height: '100%' as const,
  display: 'flex' as const,
  flexDirection: 'column' as const,
  justifyContent: 'center' as const,
};

interface CurrentBusinessListItemLinkProps {
  currentUser: CurrentUserFragment;
}

const CurrentBusinessListItemLink = (
  props: CurrentBusinessListItemLinkProps,
) => {
  const { currentUser } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { currentBusiness } = useCurrentBusiness();

  const Change = () => (
    <Link
      style={changeStyle}
      onPress={() => setIsModalOpen(true)}
      testID="CHANGE_BUSINESS"
    >
      {i18n.t('Change')}
    </Link>
  );

  return (
    <>
      {currentBusiness ? (
        <ListItemLink
          to="BusinessSettings"
          title={currentBusiness.name}
          testID="BUSINESS_SETTINGS"
          overrides={{
            Avatar: {
              props: {
                source: getImageSource(currentBusiness.logoImage),
                name: currentBusiness.name,
              },
            },
            Action: {
              component: Change,
            },
          }}
        />
      ) : (
        <ListItemLink
          onPress={() => setIsModalOpen(true)}
          title={i18n.t('Select business')}
          testID="SELECT_BUSINESS"
          overrides={{ Title: { props: { color: 'link' } } }}
        />
      )}
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <ScrollView>
          <Container>
            <ScreenTitle
              title={
                currentBusiness
                  ? i18n.t('Change business')
                  : i18n.t('Select business')
              }
            />
            <BusinessSelect
              currentUser={currentUser}
              onCompleted={() => setIsModalOpen(false)}
            />
          </Container>
        </ScrollView>
      </CloseableModal>
    </>
  );
};

const CurrentLocationListItemLink = () => {
  const i18n = useI18n();
  const { currentBusiness } = useCurrentBusiness();
  const { currentLocation } = useCurrentLocation();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (!currentBusiness) return null;

  const Change = () => (
    <Link
      style={changeStyle}
      onPress={() => setIsModalOpen(true)}
      testID="CHANGE_LOCATION"
    >
      {i18n.t('Change')}
    </Link>
  );

  return (
    <>
      {currentLocation ? (
        <ListItemLink
          to="LocationSettings"
          title={currentLocation.name}
          testID="LOCATION_SETTINGS"
          overrides={{
            Avatar: { props: { name: currentLocation.name } },
            Action: { component: Change },
          }}
        />
      ) : (
        <ListItemLink
          onPress={() => setIsModalOpen(true)}
          title={i18n.t('Select location')}
          testID="SELECT_LOCATION"
          overrides={{ Title: { props: { color: 'link' } } }}
        />
      )}
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <ScrollView>
          <Container>
            <ScreenTitle
              title={
                currentLocation
                  ? i18n.t('Change location')
                  : i18n.t('Select location')
              }
            />
            <LocationSelect
              currentBusiness={currentBusiness}
              onCompleted={() => setIsModalOpen(false)}
            />
          </Container>
        </ScrollView>
      </CloseableModal>
    </>
  );
};

interface CurrentUserListItemLinkProps {
  currentUser: CurrentUserFragment;
}

const CurrentUserListItemLink = (props: CurrentUserListItemLinkProps) => {
  const { currentUser } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (!currentUser.profile) {
    return (
      <>
        <ListItemLink
          testID="USER_PROFILE_SETUP"
          onPress={() => setIsModalOpen(true)}
          title={i18n.t('Setup profile')}
          overrides={{
            Title: {
              props: {
                color: 'link',
              },
            },
          }}
        />
        <CloseableModal
          isVisible={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
        >
          <EditUserProfile
            user={currentUser}
            onCompleted={() => setIsModalOpen(false)}
          />
        </CloseableModal>
      </>
    );
  }

  return (
    <>
      <ListItemLink
        to="UserProfile"
        title={currentUser.profile.fullName}
        testID="USER_PROFILE_VIEW"
        overrides={{
          Avatar: {
            props: getUserAvatar(currentUser.profile),
          },
        }}
      />
    </>
  );
};

const LegalSection = () => {
  const i18n = useI18n();
  return (
    <SectionWrapper>
      <SectionTitle title={i18n.t('Legal')} />
      <ListItemLink to="ProfileMenu" title={i18n.t('Terms')} />
      <ListItemLink to="ProfileMenu" title={i18n.t('Privacy')} />
    </SectionWrapper>
  );
};

const SupportSection = () => {
  const i18n = useI18n();

  return (
    <SectionWrapper>
      <SectionTitle title={i18n.t('Support')} />
      <ListItemLink to="ProfileMenu" title={i18n.t('Contact us')} />
    </SectionWrapper>
  );
};

const AccountSettingsSection = () => {
  const i18n = useI18n();
  return (
    <SectionWrapper>
      <SectionTitle title={i18n.t('Account settings')} />
      <ListItemLink
        to="UserAccountSettingsGeneral"
        title={i18n.t('General')}
        testID="USER_ACCOUNT_SETTINGS_GENERAL"
      />
    </SectionWrapper>
  );
};
