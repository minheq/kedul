import { PhoneNumberInput, useI18n } from '@kedul/common-client';
import { FormikProps } from 'formik';
import { Box, Button, FormField, Text } from 'paramount-ui';
import React from 'react';

import { Link } from './Link';
import { OneTimeCodeVerificationForm } from './OneTimeCodeVerificationForm';

export interface PhoneVerificationFormStartValues {
  readonly phoneNumber: string;
  readonly countryCode: string;
}

export interface PhoneVerificationFormVerifyValues {
  readonly code: string;
}

export interface PhoneVerificationFormProps {
  hasPhoneVerificationStarted: boolean;
  startForm: FormikProps<PhoneVerificationFormStartValues>;
  verifyForm: FormikProps<PhoneVerificationFormVerifyValues>;
}

export const PhoneVerificationForm = (props: PhoneVerificationFormProps) => {
  const { startForm, verifyForm, hasPhoneVerificationStarted } = props;
  const i18n = useI18n();

  return (
    <>
      <Box paddingBottom={24}>
        {!hasPhoneVerificationStarted ? (
          <FormField
            label={i18n.t('Enter your phone number')}
            description={i18n.t(`We'll send a text to verify your phone`)}
            error={
              startForm.touched.phoneNumber
                ? startForm.errors.phoneNumber
                : undefined
            }
          >
            <PhoneNumberInput
              onChangeCountryCode={cc =>
                startForm.setFieldValue('countryCode', cc)
              }
              onChangePhoneNumber={pn =>
                startForm.setFieldValue('phoneNumber', pn)
              }
              phoneNumber={startForm.values.phoneNumber}
              countryCode={startForm.values.countryCode}
              onSubmitEditing={startForm.submitForm}
              isClearable
              onClear={() => verifyForm.resetForm()}
            />
          </FormField>
        ) : (
          <Link onPress={() => verifyForm.resetForm()}>
            {i18n.t('Change phone number')}
          </Link>
        )}
      </Box>
      {!hasPhoneVerificationStarted && (
        <Box paddingBottom={24}>
          <Button
            color="secondary"
            title={i18n.t('Next')}
            onPress={startForm.submitForm}
            testID="CONTINUE"
          />
        </Box>
      )}
      {hasPhoneVerificationStarted && (
        <>
          <Box paddingBottom={24}>
            <Text>
              {i18n.t(
                'We have sent login code to {{phoneNumber}}. Use it to fill the field below',
                {
                  phoneNumber: startForm.values.phoneNumber,
                },
              )}
            </Text>
          </Box>
          <OneTimeCodeVerificationForm verifyForm={verifyForm} />
        </>
      )}
    </>
  );
};
