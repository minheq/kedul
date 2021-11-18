import { useI18n } from '@kedul/common-client';
import { FormikProps } from 'formik';
import { FormField, TextInput } from 'paramount-ui';
import React from 'react';

export type LocationNameEditForm = FormikProps<{ name: string }>;

export interface LocationNameEditFormProps {
  form: FormikProps<{ name: string }>;
}

export const LocationNameEditForm = (props: LocationNameEditFormProps) => {
  const { form } = props;
  const { values, touched, errors, setFieldValue, submitForm } = form;
  const { name } = values;
  const i18n = useI18n();

  return (
    <>
      <FormField
        label={i18n.t('Location name')}
        error={touched.name && errors.name}
      >
        <TextInput
          value={name || ''}
          onValueChange={name => setFieldValue('name', name)}
          textContentType="organizationName"
          testID="LOCATION_NAME_INPUT"
          onSubmitEditing={submitForm}
        />
      </FormField>
    </>
  );
};
