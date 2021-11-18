import { RequestContext } from '@kedul/common-server';
import { normalizePhoneNumber } from '@kedul/common-utils';

import { enhance } from './RequestContext';

export const findUserById = async (
  input: { id: string },
  context: RequestContext,
) => {
  const { usersLoader } = enhance(context).loaders;

  return usersLoader.load(input.id);
};

export const findUserByEmail = async (
  input: { email: string },
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  return userRepository.findByEmail(input.email);
};

export const findUserByPhoneNumber = async (
  input: { phoneNumber: string; countryCode: string },
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const phoneNumber = normalizePhoneNumber(
    input.phoneNumber,
    input.countryCode,
  );

  return userRepository.findByPhoneNumber(phoneNumber);
};
