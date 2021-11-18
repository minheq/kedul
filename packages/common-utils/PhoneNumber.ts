import libphonenumber from 'google-libphonenumber';
import { trim } from 'validator';
import { mixed, ValidationError } from 'yup';

import { validateForUserError } from './Validator';

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

export interface BasePhoneNumberInput {
  phoneNumber: string;
  countryCode: string;
}

export const isValidPhoneNumber = ({
  phoneNumber,
  countryCode = 'VN',
}: BasePhoneNumberInput) => {
  try {
    const phone = phoneUtil.parse(phoneNumber, countryCode);

    return !!phoneUtil.isValidNumber(phone);
  } catch (e) {
    return false;
  }
};

export const normalizePhoneNumber = (
  phoneNumber: string,
  countryCode = 'VN',
) => {
  return phoneUtil.format(
    phoneUtil.parse(phoneNumber, countryCode),
    libphonenumber.PhoneNumberFormat.INTERNATIONAL,
  );
};

export const phoneNumberValidator: any = mixed().test(
  'is-phone-number',
  'invalid phone number',
  <TInput extends BasePhoneNumberInput = any>(value: TInput) => {
    const isValid = isValidPhoneNumber(value);

    if (!isValid) {
      return new ValidationError(
        'Invalid phone number',
        value.phoneNumber,
        'phoneNumber',
      );
    }

    return true;
  },
);

export const normalizeInputWithPhoneNumber = <
  TInput extends BasePhoneNumberInput = any
>(
  input: TInput,
  countryCode = 'VN',
): TInput => {
  return Object.assign(input, {
    phoneNumber:
      normalizePhoneNumber(trim(input.phoneNumber), countryCode) ||
      trim(input.phoneNumber),
  });
};

export const validateInputWithPhoneNumber = <
  TInput extends BasePhoneNumberInput = any
>(
  input: TInput,
) => validateForUserError(phoneNumberValidator)(input);
