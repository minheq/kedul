import { EmailInput, PhoneNumberInput, useI18n } from '@kedul/common-client';
import { FormikProps, useFormik } from 'formik';
import { FormField } from 'paramount-ui';
import React from 'react';

import { ContactDetailsInput } from '../generated/MutationsAndQueries';

export type ContactDetailsForm = FormikProps<{
  contactDetails?: ContactDetailsInput | null;
}>;

export interface ContactDetailsFormProps {
  form: ContactDetailsForm;
}

export const toContactDetailsInitialValues = (
  contactDetails?: ContactDetailsInput | null,
) => {
  return {
    phoneNumber: (contactDetails && contactDetails.phoneNumber) || '',
    countryCode: (contactDetails && contactDetails.countryCode) || 'VN',
    email: (contactDetails && contactDetails.email) || '',
  };
};

export const ContactDetailsForm = (props: ContactDetailsFormProps) => {
  const { form } = props;
  const { values, setFieldValue } = form;
  const { contactDetails } = values;

  const addressForm = useFormik({
    initialValues: toContactDetailsInitialValues(contactDetails),

    onSubmit: () => {},
  });

  const i18n = useI18n();

  return (
    <>
      <FormField
        label={i18n.t('Enter your phone number')}
        error={
          addressForm.touched.phoneNumber && addressForm.errors.phoneNumber
        }
      >
        <PhoneNumberInput
          onChangeCountryCode={countryCode => {
            setFieldValue('contactDetails', {
              ...contactDetails,
              countryCode,
            });

            addressForm.setFieldValue('countryCode', countryCode);
          }}
          onChangePhoneNumber={phoneNumber => {
            setFieldValue('contactDetails', {
              ...contactDetails,
              phoneNumber,
            });

            addressForm.setFieldValue('phoneNumber', phoneNumber);
          }}
          phoneNumber={addressForm.values.phoneNumber}
          countryCode={addressForm.values.countryCode}
          onSubmitEditing={addressForm.submitForm}
          isClearable
          onClear={() => addressForm.resetForm()}
        />
      </FormField>
      <FormField
        label={i18n.t('Email address')}
        error={addressForm.touched.email && addressForm.errors.email}
      >
        <EmailInput
          value={addressForm.values.email}
          onValueChange={email => {
            setFieldValue('contactDetails', { ...contactDetails, email });

            addressForm.setFieldValue('email', email);
          }}
          onSubmitEditing={addressForm.submitForm}
        />
      </FormField>
    </>
  );
};
