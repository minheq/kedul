import { useI18n, SubmitBottomBar, CloseableModal } from '@kedul/common-client';
import {
  Column,
  Container,
  Spacing,
  Row,
  FormField,
  TextInput,
  ListItem,
} from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';
import { FormikProps } from 'formik';

import {
  useCurrentUserQuery,
  useCreateBusinessForm,
  CreateBusinessInput,
  CurrentUserFragment,
  BusinessFragment,
} from '../generated/MutationsAndQueries';

import { useCurrentBusiness } from './CurrentBusinessProvider';
import { useCurrentLocation } from './CurrentLocationProvider';
import { AddLink } from './AddLink';
import { ScreenTitle } from './ScreenTitle';
import { getImageSource } from './ImageUtils';

export interface BusinessSelectProps {
  currentUser: CurrentUserFragment;
  onCompleted?: (business: BusinessFragment) => void;
}

export const BusinessSelect = (props: BusinessSelectProps) => {
  const { currentUser, onCompleted = () => {} } = props;
  const i18n = useI18n();
  const { setCurrentBusiness } = useCurrentBusiness();
  const { unsetCurrentLocation } = useCurrentLocation();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <AddLink
        onPress={() => setIsModalOpen(true)}
        testID="CREATE_NEW_BUSINESS"
      >
        {i18n.t('Create new business')}
      </AddLink>
      <Spacing />
      {currentUser.businesses.map(business => (
        <ListItem
          key={business.id}
          title={business.name}
          onPress={async e => {
            e.preventDefault();

            await setCurrentBusiness(business);
            await unsetCurrentLocation();

            onCompleted(business);
          }}
          testID="BUSINESS_LIST_ITEM"
          overrides={{
            Avatar: {
              props: {
                source: getImageSource(business.logoImage),
                name: business.name,
              },
            },
          }}
        />
      ))}
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <CreateBusiness
          onCompleted={business => {
            setIsModalOpen(false);

            if (!currentUser.businesses.length) {
              setCurrentBusiness(business);
            }
          }}
        />
      </CloseableModal>
    </>
  );
};

export interface CreateBusinessProps {
  onCompleted: (business: BusinessFragment) => void;
}

export const CreateBusiness = (props: CreateBusinessProps) => {
  const { onCompleted } = props;
  const i18n = useI18n();

  const { refetch } = useCurrentUserQuery();

  const form = useCreateBusinessForm({
    initialValues: { name: '' },

    onCompleted: async data => {
      const business = data.createBusiness && data.createBusiness.business;
      if (!business) throw new Error('createBusiness');

      await refetch();

      onCompleted(business);
    },
  });

  return (
    <>
      <ScrollView>
        <Container size="small">
          <Row>
            <Column>
              <ScreenTitle>{i18n.t('Give your business a name')}</ScreenTitle>
              <BusinessIntroForm form={form} />
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

interface BusinessIntroFormProps {
  form: FormikProps<CreateBusinessInput>;
}

const BusinessIntroForm = (props: BusinessIntroFormProps) => {
  const { form } = props;
  const { values, touched, errors, setFieldValue, submitForm } = form;
  const i18n = useI18n();

  return (
    <>
      <FormField
        label={i18n.t('Business name')}
        error={touched.name && errors.name}
      >
        <TextInput
          value={values.name}
          onValueChange={name => setFieldValue('name', name)}
          textContentType="organizationName"
          onSubmitEditing={submitForm}
          testID="BUSINESS_NAME_INPUT"
        />
      </FormField>
    </>
  );
};
