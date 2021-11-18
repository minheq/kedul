import { object, string } from 'yup';

import {
  validateForUserError,
  VALIDATION_ERROR,
  VALIDATION_ERROR_CODE,
} from './Validator';

test('should return null if input is valid', async () => {
  const validator = object().shape({
    email: string().required(),
    firstName: string(),
    password: string(),
  });

  const input = { email: 'asdf@axvzcx.com', firstName: '', password: '' };
  const result = await validateForUserError(validator, {
    abortEarly: true,
    context: { foo: 'bar' },
    recursive: true,
  })(input);

  expect(result).toBe(null);
});

test('should return error fields with code and message when invalid input', async () => {
  const validator = object().shape({
    email: string().required(),
    firstName: string(),
    password: string().required(),
  });

  const input = { firstName: 'lzkjxcnvkasd', password: '', email: '' };
  const result = await validateForUserError(validator, {
    strict: true,
    stripUnknown: true,
  })(input);

  const expectedErrors = [
    { field: 'email', message: 'email is a required field' },
    { field: 'password', message: 'password is a required field' },
  ];

  expect(result!.code).toBe(VALIDATION_ERROR_CODE);
  expect(result!.message).toBe(VALIDATION_ERROR);
  expect(result!.errors).toEqual(expect.arrayContaining(expectedErrors));
});
