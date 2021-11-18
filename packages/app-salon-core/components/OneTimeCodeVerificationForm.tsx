import { OneTimeCodeInput, useI18n } from '@kedul/common-client';
import { FormikProps } from 'formik';
import { FormField } from 'paramount-ui';
import React from 'react';

export interface OneTimeCodeVerificationFormValues {
  readonly code: string;
}

export interface OneTimeCodeVerificationFormProps {
  verifyForm: FormikProps<OneTimeCodeVerificationFormValues>;
}

export const OneTimeCodeVerificationForm = (
  props: OneTimeCodeVerificationFormProps,
) => {
  const { verifyForm } = props;
  const i18n = useI18n();

  return (
    <FormField
      label={i18n.t('Login code')}
      error={verifyForm.touched.code && verifyForm.errors.code}
    >
      <OneTimeCodeInput
        autoFocus
        value={verifyForm.values.code}
        onValueChange={code => {
          verifyForm.setFieldValue('code', code);
        }}
        onSubmitEditing={verifyForm.submitForm}
        isClearable
        testID="ONE_TIME_CODE_INPUT"
      />
    </FormField>
  );
};
