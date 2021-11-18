import {
  Header,
  useI18n,
  SubmitBottomBar,
  CloseableModal,
} from '@kedul/common-client';
import { PolicyAction, PolicyEntity } from '@kedul/service-permission';
import { Container, Text } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { AddressBasicInformation } from '../components/AddressBasicInformation';
import { AvatarProfile } from '../components/AvatarProfile';
import { ContactDetails } from '../components/ContactDetails';
import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { SectionWrapper } from '../components/SectionWrapper';
import {
  LocationFragment,
  useUpdateLocationForm,
} from '../generated/MutationsAndQueries';
import { LocationFromNavigationParam } from '../components/LocationFromNavigationParam';
import { AddLink } from '../components/AddLink';
import { BackButton } from '../components/BackButton';
import { Link } from '../components/Link';
import { usePermissions } from '../components/PermissionsProvider';
import { AddressForm, toAddressInitialValues } from '../components/AddressForm';
import { LocationNameEditForm } from '../components/LocationNameEditForm';
import {
  toContactDetailsInitialValues,
  ContactDetailsForm,
} from '../components/ContactDetailsForm';
import { ScreenTitle } from '../components/ScreenTitle';

export const LocationProfileScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUserBusinessAndLocation>
      <LocationFromNavigationParam>
        {location => (
          <ScreenWrapper>
            <Header
              left={<BackButton to="LocationSettings" />}
              title={i18n.t('Location')}
            />
            <LocationProfile location={location} />
          </ScreenWrapper>
        )}
      </LocationFromNavigationParam>
    </CurrentUserBusinessAndLocation>
  );
};

export interface LocationSectionProps {
  location: LocationFragment;
  canUpdate: boolean;
}

const LocationNameSection = (props: LocationSectionProps) => {
  const { location, canUpdate } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const form = useUpdateLocationForm({
    initialValues: {
      id: location.id,
      name: location.name,
    },

    onCompleted: () => setIsModalOpen(false),
  });

  return (
    <SectionWrapper>
      <SectionTitle
        title={i18n.t('Profile')}
        right={
          canUpdate && (
            <Link
              onPress={() => setIsModalOpen(true)}
              testID="EDIT_LOCATION_NAME"
            >
              {i18n.t('Edit')}
            </Link>
          )
        }
      />
      <AvatarProfile name={location.name} />
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <ScrollView>
          <Container>
            <ScreenTitle>{i18n.t('Edit name')}</ScreenTitle>
            <LocationNameEditForm form={form as LocationNameEditForm} />
          </Container>
        </ScrollView>
        <SubmitBottomBar
          isLoading={form.isSubmitting}
          onPress={form.submitForm}
          title={i18n.t('Save')}
          testID="SAVE"
        />
      </CloseableModal>
    </SectionWrapper>
  );
};

const AddressSection = (props: LocationSectionProps) => {
  const { location, canUpdate } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const form = useUpdateLocationForm({
    initialValues: {
      id: location.id,
      address: toAddressInitialValues(location.address),
    },
    onCompleted: () => setIsModalOpen(false),
  });

  return (
    <SectionWrapper>
      <SectionTitle
        title={i18n.t('Address')}
        right={
          location.address &&
          canUpdate && (
            <Link
              onPress={() => setIsModalOpen(true)}
              testID="EDIT_LOCATION_ADDRESS"
            >
              {i18n.t('Edit')}
            </Link>
          )
        }
      />
      {location.address && (
        <AddressBasicInformation address={location.address} />
      )}
      {!location.address && canUpdate && (
        <AddLink
          onPress={() => setIsModalOpen(true)}
          testID="ADD_LOCATION_ADDRESS"
        >
          {i18n.t('Add location address')}
        </AddLink>
      )}
      {!location.address && !canUpdate && (
        <Text>{i18n.t('Address has not been added')}</Text>
      )}
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <ScrollView>
          <Container>
            <ScreenTitle>{i18n.t('Edit address')}</ScreenTitle>
            <AddressForm form={form as AddressForm} />
          </Container>
        </ScrollView>
        <SubmitBottomBar
          isLoading={form.isSubmitting}
          onPress={form.submitForm}
          title={i18n.t('Save')}
          testID="SAVE"
        />
      </CloseableModal>
    </SectionWrapper>
  );
};

const ContactDetailsSection = (props: LocationSectionProps) => {
  const { location, canUpdate } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const form = useUpdateLocationForm({
    initialValues: {
      id: location.id,
      contactDetails: toContactDetailsInitialValues(location.contactDetails),
    },
    onCompleted: () => setIsModalOpen(false),
  });

  return (
    <SectionWrapper>
      <SectionTitle
        title={i18n.t('Contact details')}
        right={
          location.contactDetails &&
          canUpdate && (
            <Link
              onPress={() => setIsModalOpen(true)}
              testID="EDIT_LOCATION_CONTACT_DETAILS"
            >
              {i18n.t('Edit')}
            </Link>
          )
        }
      />
      {location.contactDetails && (
        <ContactDetails contactDetails={location.contactDetails} />
      )}
      {!location.contactDetails && canUpdate && (
        <AddLink
          onPress={() => setIsModalOpen(true)}
          testID="ADD_LOCATION_CONTACT_DETAILS"
        >
          {i18n.t('Add contact details')}
        </AddLink>
      )}
      {!location.contactDetails && !canUpdate && (
        <Text>{i18n.t('Contact details has not been added')}</Text>
      )}
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <ScrollView>
          <Container>
            <ScreenTitle>{i18n.t('Edit contact details')}</ScreenTitle>
            <ContactDetailsForm form={form as ContactDetailsForm} />
          </Container>
        </ScrollView>
        <SubmitBottomBar
          isLoading={form.isSubmitting}
          onPress={form.submitForm}
          title={i18n.t('Save')}
          testID="SAVE"
        />
      </CloseableModal>
    </SectionWrapper>
  );
};

interface LocationProfileProps {
  location: LocationFragment;
}

const LocationProfile = (props: LocationProfileProps) => {
  const { location } = props;
  const { check } = usePermissions();

  const canUpdate = check(PolicyAction.UPDATE_LOCATION, {
    entityId: location.id,
    entity: PolicyEntity.LOCATION,
    locationId: location.id,
  });

  return (
    <ScrollView>
      <Container>
        <LocationNameSection location={location} canUpdate={canUpdate} />
        <AddressSection canUpdate={canUpdate} location={location} />
        <ContactDetailsSection canUpdate={canUpdate} location={location} />
      </Container>
    </ScrollView>
  );
};
