import { useI18n, SubmitBottomBar, CloseableModal } from '@kedul/common-client';
import { Column, Container, Spacing, Row, ListItem } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';
import { PolicyAction, PolicyEntity } from '@kedul/service-permission';

import {
  useCurrentBusinessQuery,
  useCreateLocationForm,
  CurrentBusinessFragment,
  LocationFragment,
} from '../generated/MutationsAndQueries';

import { useCurrentLocation } from './CurrentLocationProvider';
import { AddLink } from './AddLink';
import { usePermissions } from './PermissionsProvider';
import { LocationNameEditForm } from './LocationNameEditForm';
import { ScreenTitle } from './ScreenTitle';

export interface LocationSelectProps {
  currentBusiness: CurrentBusinessFragment;
  onCompleted?: () => void;
}

export const LocationSelect = (props: LocationSelectProps) => {
  const { currentBusiness, onCompleted = () => {} } = props;
  const i18n = useI18n();
  const { setCurrentLocation } = useCurrentLocation();
  const [isCreateLocationOpen, setIsCreateLocationOpen] = React.useState(false);
  const { check } = usePermissions();

  const canCreate = check(PolicyAction.CREATE_LOCATION, {
    entityId: '*',
    entity: PolicyEntity.LOCATION,
  });

  return (
    <>
      {canCreate && (
        <>
          <AddLink
            onPress={() => setIsCreateLocationOpen(true)}
            testID="CREATE_NEW_LOCATION"
          >
            {i18n.t('Create new location')}
          </AddLink>
          <Spacing />
        </>
      )}
      {currentBusiness.assignedLocations.map(location => (
        <ListItem
          key={location.id}
          title={location.name}
          onPress={async e => {
            e.preventDefault();

            await setCurrentLocation(location);

            onCompleted();
          }}
          testID="LOCATION_LIST_ITEM"
        />
      ))}
      <CloseableModal
        isVisible={isCreateLocationOpen}
        onRequestClose={() => setIsCreateLocationOpen(false)}
      >
        <CreateLocation
          onCompleted={location => {
            setIsCreateLocationOpen(false);

            if (!currentBusiness.assignedLocations.length) {
              setCurrentLocation(location);
            }
          }}
        />
      </CloseableModal>
    </>
  );
};

interface CreateLocationProps {
  onCompleted: (location: LocationFragment) => void;
}

const CreateLocation = (props: CreateLocationProps) => {
  const { onCompleted } = props;
  const i18n = useI18n();
  const { refetch } = useCurrentBusinessQuery();

  const form = useCreateLocationForm({
    initialValues: { name: '' },

    onCompleted: async data => {
      if (!data.createLocation || !data.createLocation.location) {
        throw new Error('Expected data');
      }

      await refetch();

      onCompleted(data.createLocation.location);
    },
  });

  return (
    <>
      <ScrollView>
        <Container size="small">
          <Row>
            <Column>
              <ScreenTitle>{i18n.t('Give your location a name')}</ScreenTitle>
              <LocationNameEditForm form={form as LocationNameEditForm} />
            </Column>
          </Row>
        </Container>
      </ScrollView>
      <SubmitBottomBar
        isLoading={form.isSubmitting}
        onPress={form.submitForm}
        title={i18n.t('Save')}
        testID="SAVE"
      />
    </>
  );
};
