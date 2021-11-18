import {
  Header,
  useI18n,
  SubmitBottomBar,
  CloseableModal,
} from '@kedul/common-client';
import { Container, Box, FormField, TextInput, Spacing } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';
import { FormikProps } from 'formik';

import { AvatarProfile } from '../components/AvatarProfile';
import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { SectionWrapper } from '../components/SectionWrapper';
import {
  BusinessFragment,
  useUpdateBusinessForm,
  UpdateBusinessInput,
} from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { Link } from '../components/Link';
import { ScreenTitle } from '../components/ScreenTitle';
import { AvatarEdit } from '../components/AvatarEdit';

export const BusinessProfileScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUserBusinessAndLocation>
      {({ currentBusiness }) => (
        <ScreenWrapper>
          <Header
            left={<BackButton to="BusinessSettings" />}
            title={i18n.t('Business settings')}
          />
          <ScrollView>
            <Container>
              <BusinessProfileSection business={currentBusiness} />
            </Container>
          </ScrollView>
        </ScreenWrapper>
      )}
    </CurrentUserBusinessAndLocation>
  );
};

export interface BusinessSectionProps {
  business: BusinessFragment;
}

const BusinessProfileSection = (props: BusinessSectionProps) => {
  const { business } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <SectionWrapper>
      <SectionTitle
        title={i18n.t('Profile')}
        right={
          <Link
            onPress={() => setIsModalOpen(true)}
            testID="EDIT_BUSINESS_PROFILE"
          >
            {i18n.t('Edit')}
          </Link>
        }
      />
      <AvatarProfile
        name={business.name}
        image={business.logoImage}
        description={i18n.t('View profile')}
      />
      {isModalOpen && (
        <CloseableModal isVisible onRequestClose={() => setIsModalOpen(false)}>
          <BusinessProfileEdit
            business={business}
            onCompleted={() => setIsModalOpen(true)}
          />
        </CloseableModal>
      )}
    </SectionWrapper>
  );
};

interface BusinessProfileEditProps {
  business: BusinessFragment;
  onCompleted?: () => void;
}

const BusinessProfileEdit = (props: BusinessProfileEditProps) => {
  const { business, onCompleted } = props;
  const i18n = useI18n();

  const form = useUpdateBusinessForm({
    initialValues: {
      id: business.id,
      name: business.name || '',
      logoImageId: (business.logoImage && business.logoImage.id) || '',
    },

    onCompleted,
  });

  return (
    <>
      <ScrollView>
        <Container>
          <ScreenTitle title={i18n.t('Edit profile')} />
          <BusinessEditForm form={form} />
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

interface BusinessEditFormProps {
  form: FormikProps<UpdateBusinessInput>;
}

const BusinessEditForm = (props: BusinessEditFormProps) => {
  const { form } = props;
  const { values, touched, errors, setFieldValue } = form;
  const { name, logoImageId } = values;
  const i18n = useI18n();

  return (
    <>
      <Box alignItems="center">
        <AvatarEdit
          imageId={logoImageId}
          name={values.name || ''}
          onChange={imageId => setFieldValue('logoImageId', imageId)}
        />
      </Box>
      <Spacing size="large" />
      <FormField
        label={i18n.t('Business name')}
        error={touched.name && errors.name}
      >
        <TextInput
          value={name || ''}
          onValueChange={name => setFieldValue('name', name)}
          textContentType="organizationName"
          testID="BUSINESS_NAME_INPUT"
        />
      </FormField>
    </>
  );
};
