import { RequestContext } from '@kedul/common-server';

import { AuthResultPayload } from './AuthTypes';
import { enhance } from './RequestContext';
import { createAccessToken } from './TokenUtils';
import { authorizeOwner } from './UserMutations';

export interface LogInSilentInput {
  userId: string;
}

export const logInSilent = async (
  input: LogInSilentInput,
  context: RequestContext,
): Promise<AuthResultPayload> => {
  const { userRepository } = enhance(context).repositories;

  const user = await userRepository.getById(input.userId);

  authorizeOwner(user, context);

  return {
    accessToken: createAccessToken(user),
    isSuccessful: true,
    userError: null,
  };
};
