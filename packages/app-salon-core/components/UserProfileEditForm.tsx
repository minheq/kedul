import { useI18n } from '@kedul/common-client';
import { FormikProps, useFormik } from 'formik';
import { Box, FormField, TextInput } from 'paramount-ui';
import React from 'react';

import { UserProfileInput } from '../generated/MutationsAndQueries';

import { AvatarEdit } from './AvatarEdit';

export type UserProfileEditForm = FormikProps<{
  profile?: UserProfileInput | null;
}>;

export interface UserProfileEditFormProps {
  form: UserProfileEditForm;
}

export const toUserProfileInitialValues = (
  profile?: UserProfileInput | null,
) => {
  return {
    fullName: (profile && profile.fullName) || '',
    profileImageId: (profile && profile.profileImageId) || '',
  };
};

export const UserProfileEditForm = (props: UserProfileEditFormProps) => {
  const { form } = props;
  const { profile } = form.values;
  const i18n = useI18n();

  const { values, touched, errors, setFieldValue } = useFormik({
    initialValues: toUserProfileInitialValues(profile),

    onSubmit: () => {},
  });

  return (
    <>
      <Box paddingBottom={24} alignItems="center">
        <AvatarEdit
          imageId={values.profileImageId}
          name={values.fullName}
          onChange={profileImageId => {
            form.setFieldValue('profile', { ...profile, profileImageId });
            setFieldValue('profileImageId', profileImageId);
          }}
        />
      </Box>
      <FormField
        label={i18n.t('Full name')}
        error={touched.fullName && errors.fullName}
      >
        <TextInput
          value={values.fullName}
          onValueChange={fullName => {
            form.setFieldValue('profile', { ...profile, fullName });
            setFieldValue('fullName', fullName);
          }}
          textContentType="givenName"
          testID="FULL_NAME_INPUT"
          onSubmitEditing={form.submitForm}
        />
      </FormField>
    </>
  );
};
