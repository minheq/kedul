import { normalizeEmail as validatorNormalizeEmail, trim } from 'validator';
import { object, string } from 'yup';

import { validateForUserError } from './Validator';

export const normalizeEmail = (email: string) =>
  validatorNormalizeEmail(trim(email)) || trim(email);

export const normalizeInputWithEmail = <TInput extends { email: string } = any>(
  input: TInput,
): TInput =>
  Object.assign(input, {
    email: normalizeEmail(input.email),
  });

export const validateInputWithEmail = <TInput extends { email: string } = any>(
  input: TInput,
) => validateForUserError(object().shape({ email: string().email() }))(input);
