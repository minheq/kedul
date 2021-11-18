import { ActorType, publish, RequestContext } from '@kedul/common-server';
import {
  normalizeInputWithEmail,
  normalizeInputWithPhoneNumber,
  UserError,
  validateInputWithEmail,
  validateInputWithPhoneNumber,
} from '@kedul/common-utils';
import { DeepPartial } from 'ts-essentials';
import uuidv4 from 'uuid/v4';

import {
  generateEmailVerificationCode,
  sendVerificationCodeToEmail,
} from './EmailMutations';
import {
  generatePhoneVerificationCode,
  sendVerificationCodeToPhone,
} from './PhoneMutations';
import { enhance } from './RequestContext';
import { LoginType, userErrors, UserEvent } from './UserConstants';
import { User, UserProfile } from './UserTypes';

export interface UpdateUserPayload {
  user?: User | null;
  isSuccessful: boolean;
  userError?: UserError | null;
}

export const authorizeOwner = (user: User, context: RequestContext) => {
  if (!context.actor) {
    throw new Error('Unauthenticated');
  }
  if (context.actor.type !== ActorType.USER) {
    throw new Error('Unauthorized, auth context is not User');
  }

  if (user.id === context.actor.userId) {
    return;
  }

  throw new Error(`Unauthorized access`);
};

const makeSuccessPayload = (user: User): UpdateUserPayload => ({
  isSuccessful: true,
  user,
  userError: null,
});

const makeErrorPayload = (error: UserError) => ({
  isSuccessful: false,
  user: null,
  userError: error,
});

const publishEvent = (event: UserEvent, user: User, context: RequestContext) =>
  publish(event, {
    aggregateId: user.id,
    aggregateType: 'USER',
    data: user,
    context,
  });

export const makeUser = (userInput: DeepPartial<User> = {}): User => {
  const userId = uuidv4();

  return {
    createdAt: new Date(),
    id: userInput.id || userId,

    isActive: userInput.isActive || false,

    account: {
      ...userInput.account,
      isEmailVerified: false,
      isPhoneVerified: false,
      logins: [],
      socialIdentities: [],
    },
    updatedAt: new Date(),
  };
};

export const createNewEmailUser = async (
  input: { email: string },
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const existingUser = await userRepository.findByEmail(input.email);
  if (existingUser) throw new Error('User already exist');

  const user = makeUser({ account: normalizeInputWithEmail(input) });

  await userRepository.save(user);

  return user;
};

export const createNewPhoneUser = async (
  input: { countryCode: string; phoneNumber: string },
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const existingUser = await userRepository.findByPhoneNumber(
    input.phoneNumber,
  );
  if (existingUser) throw new Error('User already exist');

  const user = makeUser({
    account: normalizeInputWithPhoneNumber(input),
  });

  await userRepository.save(user);

  return user;
};

const updateEmailChangeset = (
  user: User,
  input: UpdateUserEmailVerifyInput,
): User => {
  return {
    ...user,
    account: {
      ...user.account,
      email: input.email,
    },
  };
};

const updatePhoneChangeset = (
  user: User,
  input: UpdateUserPhoneVerifyInput,
): User => {
  return {
    ...user,
    account: {
      ...user.account,
      countryCode: input.countryCode,
      phoneNumber: input.phoneNumber,
    },
  };
};

const updateUserProfileChangeset = (
  user: User,
  input: UpdateUserProfileInput,
): User => {
  if (!input.profile) return user;

  return { ...user, profile: { ...user.profile, ...input.profile } };
};

const validateUpdateUserEmailStart = async (
  input: UpdateUserEmailStartInput,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const userErrorExtra = await validateInputWithEmail(input);
  if (userErrorExtra) return userErrorExtra;

  const existingUser = await userRepository.findByEmail(input.email);
  if (existingUser) return userErrors.userAlreadyExist();

  return null;
};

export interface UpdateUserEmailStartInput {
  id: string;
  email: string;
}

export const updateUserEmailStart = async (
  input: UpdateUserEmailStartInput,
  context: RequestContext,
): Promise<UpdateUserPayload> => {
  const { userRepository } = enhance(context).repositories;

  const normalizedInput = normalizeInputWithEmail(input);
  const error = await validateUpdateUserEmailStart(normalizedInput, context);
  if (error) return makeErrorPayload(error);

  const user = await userRepository.getById(normalizedInput.id);
  const updatedUser: User = {
    ...user,
    account: { ...user.account, email: normalizedInput.email },
  };
  const emailVerificationCode = await generateEmailVerificationCode(
    updatedUser,
    context,
  );

  await sendVerificationCodeToEmail(emailVerificationCode, context);

  publishEvent(UserEvent.USER_EMAIL_UPDATE_STARTED, user, context);

  return makeSuccessPayload(user);
};

const validateUserEmailVerify = async (
  input: UpdateUserEmailVerifyInput,
  context: RequestContext,
) => {
  const { userRepository, emailVerificationCodeRepository } = enhance(
    context,
  ).repositories;

  const user = await userRepository.getById(input.id);

  const emailVerificationCode = await emailVerificationCodeRepository.findActiveByUserId(
    user.id,
  );

  const existingUser = await userRepository.findByEmail(input.email);
  if (existingUser) return userErrors.userAlreadyExist();

  if (!emailVerificationCode || emailVerificationCode.code !== input.code) {
    return userErrors.wrongEmailVerificationCode();
  }

  return null;
};

export interface UpdateUserEmailVerifyInput {
  id: string;
  code: string;
  email: string;
}

export const updateUserEmailVerify = async (
  input: UpdateUserEmailVerifyInput,
  context: RequestContext,
): Promise<UpdateUserPayload> => {
  const { userRepository, emailVerificationCodeRepository } = enhance(
    context,
  ).repositories;

  const error = await validateUserEmailVerify(input, context);
  if (error) return makeErrorPayload(error);

  const user = await userRepository.getById(input.id);

  authorizeOwner(user, context);

  await emailVerificationCodeRepository.removeByUser(user);

  const updatedUser = updateEmailChangeset(user, input);
  await userRepository.update(updatedUser);

  publishEvent(UserEvent.USER_EMAIL_UPDATE_VERIFIED, updatedUser, context);

  return makeSuccessPayload(updatedUser);
};

const validateUpdateUserPhoneStart = async (
  input: UpdateUserPhoneStartInput,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const error = await validateInputWithPhoneNumber(input);
  if (error) return error;

  const existingUser = await userRepository.findByPhoneNumber(
    input.phoneNumber,
  );
  if (existingUser) return userErrors.userAlreadyExist();

  return null;
};

export interface UpdateUserPhoneStartInput {
  countryCode: string;
  phoneNumber: string;
  id: string;
}

export const updateUserPhoneStart = async (
  input: UpdateUserPhoneStartInput,
  context: RequestContext,
): Promise<UpdateUserPayload> => {
  const { userRepository } = enhance(context).repositories;

  const normalizedInput = normalizeInputWithPhoneNumber(input);
  const error = await validateUpdateUserPhoneStart(normalizedInput, context);
  if (error) return makeErrorPayload(error);

  const { id, countryCode, phoneNumber } = normalizedInput;
  const user = await userRepository.getById(id);

  authorizeOwner(user, context);

  const updatedUser: User = {
    ...user,
    account: { ...user.account, countryCode, phoneNumber },
  };
  const phoneNumberVerificationCode = await generatePhoneVerificationCode(
    updatedUser,
    context,
  );

  await sendVerificationCodeToPhone(phoneNumberVerificationCode, context);

  publishEvent(UserEvent.USER_PHONE_UPDATE_STARTED, updatedUser, context);

  return makeSuccessPayload(updatedUser);
};

const validateUserPhoneVerify = async (
  input: UpdateUserPhoneVerifyInput,
  context: RequestContext,
) => {
  const { userRepository, phoneVerificationCodeRepository } = enhance(
    context,
  ).repositories;
  const user = await userRepository.getById(input.id);

  const phoneNumberVerificationCode = await phoneVerificationCodeRepository.findActiveByUserId(
    user.id,
  );

  const existingUser = await userRepository.findByPhoneNumber(
    input.phoneNumber,
  );
  if (existingUser) return userErrors.userAlreadyExist();

  if (
    !phoneNumberVerificationCode ||
    phoneNumberVerificationCode.code !== input.code
  ) {
    return userErrors.wrongPhoneVerificationCode();
  }

  return null;
};

export interface UpdateUserPhoneVerifyInput {
  id: string;
  code: string;
  countryCode: string;
  phoneNumber: string;
}

export const updateUserPhoneVerify = async (
  input: UpdateUserPhoneVerifyInput,
  context: RequestContext,
): Promise<UpdateUserPayload> => {
  const { userRepository, phoneVerificationCodeRepository } = enhance(
    context,
  ).repositories;

  const error = await validateUserPhoneVerify(input, context);
  if (error) return makeErrorPayload(error);

  const user = await userRepository.getById(input.id);

  authorizeOwner(user, context);

  await phoneVerificationCodeRepository.removeByUser(user);

  const updatedUser = updatePhoneChangeset(user, input);
  await userRepository.update(updatedUser);

  publishEvent(UserEvent.USER_PHONE_UPDATE_VERIFIED, updatedUser, context);

  return makeSuccessPayload(updatedUser);
};

export interface UpdateUserProfileInput {
  id: string;
  profile?: UserProfile | null;
}

export const updateUserProfile = async (
  input: UpdateUserProfileInput,
  context: RequestContext,
): Promise<UpdateUserPayload> => {
  const { userRepository } = enhance(context).repositories;

  const user = await userRepository.getById(input.id);

  authorizeOwner(user, context);

  const updatedUser = updateUserProfileChangeset(user, input);
  await userRepository.update(updatedUser);

  publishEvent(UserEvent.USER_PROFILE_UPDATED, updatedUser, context);

  return makeSuccessPayload(updatedUser);
};

export interface DeactivateUserInput {
  id: string;
}

export const deactivateUser = async (
  input: DeactivateUserInput,
  context: RequestContext,
): Promise<UpdateUserPayload> => {
  const { userRepository } = enhance(context).repositories;

  const user = await userRepository.getById(input.id);

  authorizeOwner(user, context);

  await userRepository.remove(user);

  publishEvent(UserEvent.USER_DEACTIVATED, user, context);

  return makeSuccessPayload(user);
};

export const checkOtherExistingLoginOptions = async (
  userId: string,
  provider: LoginType,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const user = await userRepository.getById(userId);

  const hasOtherSocialIdentityProvider = user.account.socialIdentities.some(
    sid => sid.provider !== provider,
  );

  return (
    user.account.email ||
    user.account.phoneNumber ||
    hasOtherSocialIdentityProvider
  );
};
