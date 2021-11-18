import { useI18n, Header } from '@kedul/common-client';
import { Container, ListItem } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import {
  CurrentUserInvitationsQuery,
  CurrentBusinessFragment,
} from '../generated/MutationsAndQueries';
import { SectionTitle } from '../components/SectionTitle';
import { SectionWrapper } from '../components/SectionWrapper';
import { useCurrentBusiness } from '../components/CurrentBusinessProvider';
import { EmployeeInvitation } from '../components/EmployeeInvitation';
import { useCurrentLocation } from '../components/CurrentLocationProvider';
import { CurrentUser } from '../components/CurrentUser';
import { Link } from '../components/Link';
import {
  LocationSelect,
  LocationSelectProps,
} from '../components/LocationSelect';
import { ScreenTitle } from '../components/ScreenTitle';
import {
  BusinessSelect,
  BusinessSelectProps,
} from '../components/BusinessSelect';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useNavigation } from '../components/useNavigation';
import { HeaderLogOutButton } from '../components/HeaderLogOutButton';
import { HeaderGoToProfileButton } from '../components/HeaderGoToProfileButton';
import { getImageSource } from '../components/ImageUtils';

export const BusinessAndLocationSelectionScreen = () => {
  const { currentBusiness } = useCurrentBusiness();
  const { currentLocation } = useCurrentLocation();
  const i18n = useI18n();

  return (
    <CurrentUser>
      {currentUser => (
        <ScreenWrapper>
          <Header
            left={<HeaderLogOutButton />}
            right={<HeaderGoToProfileButton />}
          />
          <ScrollView>
            <Container>
              <ScreenTitle>{i18n.t('Workspace')}</ScreenTitle>
              <EmployeeInvitationsSection />
              {!currentBusiness && (
                <BusinessSelectSection currentUser={currentUser} />
              )}
              {currentBusiness && (
                <CurrentBusinessSection currentBusiness={currentBusiness} />
              )}
              {currentBusiness && !currentLocation && (
                <LocationSelectSection currentBusiness={currentBusiness} />
              )}
            </Container>
          </ScrollView>
        </ScreenWrapper>
      )}
    </CurrentUser>
  );
};

export const EmployeeInvitationsSection = () => {
  const i18n = useI18n();

  return (
    <CurrentUserInvitationsQuery>
      {data =>
        data.currentUser &&
        data.currentUser.employeeInvitations &&
        data.currentUser.employeeInvitations.length > 0 ? (
          <SectionWrapper>
            <SectionTitle title={i18n.t('Invitations')} />
            {data.currentUser &&
              data.currentUser.employeeInvitations.map(invitation => (
                <EmployeeInvitation
                  key={invitation.id}
                  invitation={invitation}
                />
              ))}
          </SectionWrapper>
        ) : (
          <></>
        )
      }
    </CurrentUserInvitationsQuery>
  );
};

export const BusinessSelectSection = (props: BusinessSelectProps) => {
  const { currentUser } = props;
  const i18n = useI18n();

  return (
    <SectionWrapper>
      <SectionTitle title={i18n.t('Select business')} />
      <BusinessSelect currentUser={currentUser} />
    </SectionWrapper>
  );
};

interface CurrentBusinessSectionProps {
  currentBusiness: CurrentBusinessFragment;
}

export const CurrentBusinessSection = (props: CurrentBusinessSectionProps) => {
  const { currentBusiness } = props;
  const { unsetCurrentBusiness } = useCurrentBusiness();
  const i18n = useI18n();

  return (
    <SectionWrapper>
      <SectionTitle
        title={i18n.t('Current business')}
        right={
          <Link onPress={() => unsetCurrentBusiness()} testID="CHANGE">
            {i18n.t('Change')}
          </Link>
        }
      />
      <ListItem
        title={currentBusiness.name}
        overrides={{
          Avatar: {
            props: {
              source: getImageSource(currentBusiness.logoImage),
              name: currentBusiness.name,
            },
          },
        }}
      />
    </SectionWrapper>
  );
};

export const LocationSelectSection = (props: LocationSelectProps) => {
  const { currentBusiness } = props;
  const i18n = useI18n();
  const { navigate } = useNavigation();

  return (
    <SectionWrapper>
      <SectionTitle title={i18n.t('Select location')} />
      <LocationSelect
        currentBusiness={currentBusiness}
        onCompleted={() => navigate('CalendarOverview')}
      />
    </SectionWrapper>
  );
};
