import { useI18n } from '@kedul/common-client';
import { FormikProps, useFormik } from 'formik';
import { FormField, TextInput } from 'paramount-ui';
import React from 'react';

import { AddressInput } from '../generated/MutationsAndQueries';

export type AddressForm = FormikProps<{ address?: AddressInput | null }>;

export interface AddressFormProps {
  form: AddressForm;
}

export const toAddressInitialValues = (address?: AddressInput | null) => {
  return {
    streetAddressOne: (address && address.streetAddressOne) || '',
    streetAddressTwo: (address && address.streetAddressTwo) || '',
    postalCode: (address && address.postalCode) || '',
    city: (address && address.city) || '',
    country: (address && address.country) || '',
  };
};

export const AddressForm = (props: AddressFormProps) => {
  const { form } = props;
  const { values, setFieldValue } = form;
  const { address } = values;
  const i18n = useI18n();

  const addressForm = useFormik({
    initialValues: toAddressInitialValues(address),

    onSubmit: () => {},
  });

  return (
    <>
      <FormField label={i18n.t('Street Address')}>
        <TextInput
          value={addressForm.values.streetAddressOne}
          onValueChange={streetAddressOne => {
            setFieldValue('address', { ...address, streetAddressOne });
            addressForm.setFieldValue('streetAddressOne', streetAddressOne);
          }}
          textContentType="streetAddressLine1"
          testID="STREET_ADDRESS_LINE_1_INPUT"
        />
      </FormField>

      <FormField label={i18n.t('City')}>
        <TextInput
          value={addressForm.values.city}
          onValueChange={city => {
            setFieldValue('address', { ...address, city });
            addressForm.setFieldValue('city', city);
          }}
          textContentType="addressCity"
          testID="CITY_INPUT"
        />
      </FormField>

      <FormField label={i18n.t('Country')}>
        <TextInput
          value={addressForm.values.country}
          onValueChange={country => {
            setFieldValue('address', { ...address, country });
            addressForm.setFieldValue('country', country);
          }}
          textContentType="countryName"
          testID="COUNTRY_INPUT"
        />
      </FormField>
    </>
  );
};
