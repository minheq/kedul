import { UserError } from '@kedul/common-utils';

import { AuthResultPayload, AuthStartPayload } from './AuthTypes';

export const makeSuccessStartPayload = (state: string): AuthStartPayload => ({
  isSuccessful: true,
  state,
  userError: null,
});

export const makeErrorStartPayload = (error: UserError): AuthStartPayload => ({
  isSuccessful: false,
  state: null,
  userError: error,
});

export const makeSuccessVerifyPayload = (
  accessToken: string,
): AuthResultPayload => ({
  isSuccessful: true,
  accessToken,
  userError: null,
});

export const makeErrorVerifyPayload = (
  error: UserError,
): AuthResultPayload => ({
  isSuccessful: false,
  accessToken: null,
  userError: error,
});
