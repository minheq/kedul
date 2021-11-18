import {
  useI18n,
  PhoneNumberInput,
  SubmitBottomBar,
  CloseableModal,
} from '@kedul/common-client';
import { PolicyAction, PolicyEntity } from '@kedul/service-permission';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  FormField,
  Spacing,
  TextInput,
} from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';
import { FormikProps } from 'formik';

import { AppBottomNavigationBar } from '../components/AppBottomNavigationBar';
import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import {
  BusinessFragment,
  ClientFragment,
  ClientsQuery,
  CreateClientInput,
  useClientsQuery,
  useCreateClientForm,
} from '../generated/MutationsAndQueries';
import {
  ManageNavigationTabs,
  ManageTab,
} from '../components/ManageNavigationTabs';
import { AddLink } from '../components/AddLink';
import { ListItemLink } from '../components/ListItemLink';
import { usePermissions } from '../components/PermissionsProvider';
import { getUserAvatar } from '../components/UserProfileUtils';
import { toContactDetailsInitialValues } from '../components/ContactDetailsForm';
import { toUserProfileInitialValues } from '../components/UserProfileEditForm';
import { ScreenTitle } from '../components/ScreenTitle';
import { useNavigation } from '../components/useNavigation';

export const ManageClientListScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUserBusinessAndLocation>
      {({ currentBusiness }) => (
        <ScreenWrapper>
          <ManageNavigationTabs tab={ManageTab.CLIENTS} />

          <ScrollView>
            <Container>
              <Box paddingBottom={24}>
                <Heading size="large">{i18n.t('Clients')}</Heading>
              </Box>
              <Box paddingBottom={24}>
                <Text size="medium">
                  {i18n.t('Clients are shared across locations')}
                </Text>
              </Box>
              <ManageClientList business={currentBusiness} />
            </Container>
          </ScrollView>

          <AppBottomNavigationBar />
        </ScreenWrapper>
      )}
    </CurrentUserBusinessAndLocation>
  );
};

export interface ManageClientListProps {
  business: BusinessFragment;
}

export const ManageClientList = (props: ManageClientListProps) => {
  const i18n = useI18n();
  const { business } = props;
  const { check } = usePermissions();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const resource = {
    entityId: '*',
    entity: PolicyEntity.CLIENT,
    businessId: business.id,
  };

  const canCreate = check(PolicyAction.CREATE_CLIENT, resource);

  return (
    <ClientsQuery variables={{ businessId: business.id }}>
      {({ clients }) => (
        <>
          {canCreate && clients.length > 0 && (
            <Box paddingBottom={24}>
              <AddLink
                onPress={() => {
                  setIsModalOpen(true);
                }}
              >
                {i18n.t('Add client')}
              </AddLink>
            </Box>
          )}
          {canCreate && clients.length === 0 && (
            <EmptyState business={business} />
          )}
          {clients.map(client => (
            <ClientListItemLink key={client.id} client={client} />
          ))}
          <CloseableModal
            isVisible={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
          >
            <ManageClientCreate business={business} />
          </CloseableModal>
        </>
      )}
    </ClientsQuery>
  );
};

interface ClientEmptyStateProps {
  business: BusinessFragment;
}

const EmptyState = (props: ClientEmptyStateProps) => {
  const { business } = props;
  const i18n = useI18n();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <Box paddingVertical={56}>
      <Text>{i18n.t('There are no clients added yet.')}</Text>
      <Spacing />
      <Button
        color="primary"
        title={i18n.t('Add client')}
        onPress={e => {
          e.preventDefault();

          setIsModalOpen(true);
        }}
      />
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <ManageClientCreate business={business} />
      </CloseableModal>
    </Box>
  );
};

interface ClientListItemLinkProps {
  client: ClientFragment;
}

const ClientListItemLink = (props: ClientListItemLinkProps) => {
  const { client } = props;

  return (
    <ListItemLink
      key={client.id}
      to="ManageClientProfile"
      params={{ client: client.id }}
      title={client.profile.fullName}
      overrides={{
        Avatar: {
          props: getUserAvatar(client.profile),
        },
      }}
    />
  );
};

interface ManageClientCreateProps {
  business: BusinessFragment;
}

const ManageClientCreate = (props: ManageClientCreateProps) => {
  const { business } = props;
  const i18n = useI18n();
  const { navigate } = useNavigation();

  const { refetch } = useClientsQuery({
    variables: { businessId: business.id },
  });

  const form = useCreateClientForm({
    initialValues: {
      contactDetails: toContactDetailsInitialValues(),
      profile: toUserProfileInitialValues(),
    },
    onCompleted: async data => {
      if (!data.createClient || !data.createClient.client) {
        throw new Error('Expectect client');
      }

      navigate('ManageClientProfile', {
        clientId: data.createClient.client.id,
      });

      await refetch();
    },
  });

  return (
    <>
      <ScrollView>
        <Container>
          <ScreenTitle title={i18n.t('Add client')} />
          <ClientCreateForm form={form} />
        </Container>
      </ScrollView>
      <SubmitBottomBar
        isLoading={form.isSubmitting}
        onPress={form.submitForm}
        title={i18n.t('Create')}
        testID="Create"
      />
    </>
  );
};

export interface ClientCreateFormProps {
  form: FormikProps<CreateClientInput>;
}

export const ClientCreateForm = (props: ClientCreateFormProps) => {
  const { form } = props;
  const { values, setFieldValue } = form;
  const { contactDetails, profile } = values;
  const { fullName } = profile;
  const { phoneNumber, countryCode } = contactDetails;
  const i18n = useI18n();

  return (
    <>
      <FormField label={i18n.t('Full name')}>
        <TextInput
          value={fullName || ''}
          onValueChange={fullName => {
            setFieldValue('profile', { ...profile, fullName });
          }}
        />
      </FormField>
      <FormField label={i18n.t('Phone number')}>
        <PhoneNumberInput
          onChangeCountryCode={cc => {
            setFieldValue('contactDetails', {
              ...contactDetails,
              countryCode: cc,
            });
          }}
          onChangePhoneNumber={pn => {
            setFieldValue('contactDetails', {
              ...contactDetails,
              phoneNumber: pn,
            });
          }}
          phoneNumber={phoneNumber || ''}
          countryCode={countryCode || 'VN'}
          onSubmitEditing={form.submitForm}
          isClearable
          onClear={() => form.resetForm()}
          testID="PHONE_NUMBER_INPUT"
        />
      </FormField>
    </>
  );
};
