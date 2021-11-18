import { Header, SubmitBottomBar, useI18n } from '@kedul/common-client';
import { Box, Container, FormField, TextInput } from 'paramount-ui';
import React from 'react';
import { FormikProps } from 'formik';

import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import {
  useUpdateClientForm,
  UpdateClientInput,
} from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { SegmentedControls } from '../components/SegmentedControls';

export const ManageClientMembershipScreen = () => {
  const i18n = useI18n();

  const form = useUpdateClientForm({
    initialValues: {
      id: '0',
      discount: 0,
    },
    onCompleted: () => {},
  });

  return (
    <CurrentUserBusinessAndLocation>
      <ScreenWrapper>
        <Header
          left={<BackButton to="ManageClients" />}
          title={i18n.t('Client membership')}
        />
        <Container>
          <NavBar />
          <ClientMembershipEditForm form={form} />
        </Container>
        <SubmitBottomBar
          isLoading={form.isSubmitting}
          onPress={form.submitForm}
          title={i18n.t('Save')}
          testID="SAVE"
        />
      </ScreenWrapper>
    </CurrentUserBusinessAndLocation>
  );
};

const NavBar = () => {
  const i18n = useI18n();
  return (
    <Box paddingBottom={24}>
      <SegmentedControls
        value="ManageClientMembership"
        data={[
          {
            label: i18n.t('Profile'),
            value: 'ManageClientProfile',
          },
          {
            label: i18n.t('Membership'),
            value: 'ManageClientMembership',
          },
        ]}
      />
    </Box>
  );
};

export interface ClientMembershipEditFormProps {
  form: FormikProps<UpdateClientInput>;
}

export const ClientMembershipEditForm = (
  props: ClientMembershipEditFormProps,
) => {
  const { form } = props;
  const { values, touched, errors, setFieldValue, submitForm } = form;
  const { discount, notes } = values;
  const i18n = useI18n();
  return (
    <>
      <FormField
        label={i18n.t('Discount')}
        error={touched.discount && errors.discount}
      >
        <TextInput
          textContentType="none"
          value={(discount && discount.toString()) || ''}
          onValueChange={discount =>
            setFieldValue('discount', parseFloat(discount))
          }
        />
      </FormField>
      <FormField label={i18n.t('Notes')} error={touched.notes && errors.notes}>
        <TextInput
          textContentType="none"
          value={(discount && discount.toString()) || ''}
          onValueChange={discount =>
            setFieldValue('discount', parseFloat(discount))
          }
        />
      </FormField>
    </>
  );
};
