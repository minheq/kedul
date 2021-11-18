import { isEmpty } from 'lodash';
import { sentenceCase } from 'change-case';

export type Maybe<T> = T | null;

export interface UserError {
  // This is ValidationErrorCode, but we put any
  // because each service
  code: any;
  message: string;
  errors: UserValidationError[];
}

export interface UserValidationError {
  field: string;
  message: string;
}

export const VALIDATION_ERROR_CODE = 'ValidationError' as const;
export const VALIDATION_ERROR = 'Validation has failed' as const;

const unfoldYupValidationError = (error: any): UserValidationError[] => {
  return error.inner.map((validationError: any) => ({
    field: validationError.path,
    message: validationError.message,
  }));
};

export const wrappedYupValidate = <TInput = any>(
  validator: any,
  {
    strict = true,
    abortEarly = false,
    stripUnknown = true,
    recursive = true,
    context = {},
  }: any = {},
) => async (input: TInput) => {
  try {
    await validator.validate(input, {
      abortEarly,
      context,
      recursive,
      strict,
      stripUnknown,
    });
    return [];
  } catch (error) {
    return unfoldYupValidationError(error);
  }
};

export const makeValidationError = (errors: UserValidationError[]) => {
  return {
    code: VALIDATION_ERROR_CODE,
    errors,
    message: VALIDATION_ERROR,
  };
};

export const validateInputNotAllowedFields = <TInput = any>(
  input: TInput,
  notAllowedInput: string[],
) => {
  const notAllowedField = Object.keys(input).find(field => {
    if (notAllowedInput.includes(field)) {
      return true;
    }

    return false;
  });

  if (notAllowedField) {
    return makeValidationError([
      {
        field: notAllowedField,
        message: 'Not allowed field in input. Check the context',
      },
    ]);
  }

  return null;
};

export const makeUserError = (
  code: string,
  message?: string,
  validationErrors: UserValidationError[] = [],
): UserError => {
  return {
    code,
    message: message || sentenceCase(code),
    errors: validationErrors,
  };
};

export const validateForUserError = <TInput = any>(
  validator: any,
  // Using types from 'yup' causes errors in consumers
  options?: any,
) => async (input: TInput): Promise<null | UserError> => {
  const errors = await wrappedYupValidate(validator, options)(input);
  const isValid = isEmpty(errors);

  if (!isValid) return makeValidationError(errors);

  return null;
};

export const transformToErrorObject = (userError?: UserError) => {
  const errorObject: { [field: string]: string } = {};

  if (!userError) return errorObject;

  userError.errors.map(error => {
    errorObject[error.field] = error.message;
  });

  return errorObject;
};
