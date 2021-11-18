import { EmailInput, useI18n } from '@kedul/common-client';
import { FormikProps } from 'formik';
import { Button, FormField, Spacing, Text } from 'paramount-ui';
import React from 'react';

import {
  OneTimeCodeVerificationForm,
  OneTimeCodeVerificationFormValues,
} from './OneTimeCodeVerificationForm';

export interface EmailVerificationFormStartValues {
  readonly email: string;
}

export interface EmailVerificationFormVerifyValues {
  readonly code: string;
}

export interface EmailVerificationFormProps {
  hasEmailVerificationStarted: boolean;
  startForm: FormikProps<EmailVerificationFormStartValues>;
  verifyForm: FormikProps<EmailVerificationFormVerifyValues>;
}

export const EmailVerificationForm = (props: EmailVerificationFormProps) => {
  const { startForm, verifyForm, hasEmailVerificationStarted } = props;
  const i18n = useI18n();

  return (
    <>
      <FormField
        label={i18n.t('Enter your email address')}
        error={startForm.errors.email}
      >
        <EmailInput
          autoFocus
          value={startForm.values.email}
          onValueChange={text => startForm.setFieldValue('email', text)}
          onSubmitEditing={startForm.submitForm}
          isClearable
          onClear={() => verifyForm.setFieldValue('code', '')}
        />
      </FormField>
      {!hasEmailVerificationStarted && (
        <>
          <Button
            color="secondary"
            title={i18n.t('Continue with email')}
            onPress={startForm.submitForm}
            testID="CONTINUE"
          />
          <Spacing size="large" />
        </>
      )}
      {hasEmailVerificationStarted && (
        <>
          <Text>
            {i18n.t(
              'We have sent you verification code to your email. Use it to fill the field below',
            )}
          </Text>
          <Spacing size="large" />
          <OneTimeCodeVerificationForm
            verifyForm={
              verifyForm as FormikProps<OneTimeCodeVerificationFormValues>
            }
          />
        </>
      )}
    </>
  );
};
