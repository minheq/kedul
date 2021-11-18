import { publish, RequestContext } from '@kedul/common-server';
import {
  normalizeInputWithPhoneNumber,
  randomDigits,
  randomString,
  validateInputWithPhoneNumber,
} from '@kedul/common-utils';
import { sendVerificationCode } from '@kedul/service-phone';
import { addMinutes } from 'date-fns';
import uuidv4 from 'uuid/v4';

import {
  authErrors,
  AuthEvent,
  VALID_CODE_DURATION_MIN,
} from './AuthConstants';
import {
  AuthResultPayload,
  AuthStartPayload,
  PhoneVerificationCode,
} from './AuthTypes';
import {
  makeErrorStartPayload,
  makeErrorVerifyPayload,
  makeSuccessStartPayload,
  makeSuccessVerifyPayload,
} from './AuthUtils';
import { enhance } from './RequestContext';
import { createAccessToken } from './TokenUtils';
import { LoginType } from './UserConstants';
import { createNewPhoneUser } from './UserMutations';
import { AccountLogin, User } from './UserTypes';

const makePhoneVerificationCode = async (
  user: User,
  type = 'LOGIN',
): Promise<PhoneVerificationCode> => {
  if (!user.account.phoneNumber || !user.account.countryCode) {
    throw new Error('makePhoneVerificationCode failed. Supposed to have email');
  }

  const code = randomDigits();

  return {
    code,
    countryCode: user.account.countryCode,
    expiredAt: addMinutes(new Date(), VALID_CODE_DURATION_MIN),
    id: uuidv4(),
    phoneNumber: user.account.phoneNumber,
    state: randomString(),
    type,
    userId: user.id,
  };
};

export const generatePhoneVerificationCode = async (
  user: User,
  context: RequestContext,
) => {
  const { phoneVerificationCodeRepository } = enhance(context).repositories;

  await phoneVerificationCodeRepository.removeByUser(user);

  const phoneNumberVerificationCode = await makePhoneVerificationCode(user);

  await phoneVerificationCodeRepository.save(phoneNumberVerificationCode);

  return phoneNumberVerificationCode;
};

export const sendVerificationCodeToPhone = async (
  phoneNumberVerificationCode: PhoneVerificationCode,
  context: RequestContext,
) => {
  await sendVerificationCode(
    phoneNumberVerificationCode.phoneNumber,
    {
      code: phoneNumberVerificationCode.code,
    },
    context,
  );
};

const verifyChangeset = (user: User): User => {
  return {
    ...user,
    account: {
      ...user.account,
      isPhoneVerified: true,
    },
    isActive: true,
  };
};

const publishEvent = (
  event: AuthEvent,
  user: User,
  context: RequestContext,
) => {
  publish(event, {
    aggregateId: user.id,
    aggregateType: 'USER',
    data: user,
    context,
  });
};

const makeLoginEntry = (user: User): AccountLogin => {
  if (!user.account.phoneNumber) throw new Error('Expected phoneNumber');

  return {
    claim: user.account.phoneNumber,
    createdAt: new Date(),
    key: user.id,
    name: LoginType.PHONE,
  };
};

export interface LogInPhoneStartInput {
  phoneNumber: string;
  countryCode: string;
}

export const logInPhoneStart = async (
  input: LogInPhoneStartInput,
  context: RequestContext,
): Promise<AuthStartPayload> => {
  const { userRepository } = enhance(context).repositories;

  const error = await validateInputWithPhoneNumber(input);
  if (error) return makeErrorStartPayload(error);

  const normalizedInput = normalizeInputWithPhoneNumber(input);
  const existingUser = await userRepository.findByPhoneNumber(
    normalizedInput.phoneNumber,
  );

  const user =
    existingUser || (await createNewPhoneUser(normalizedInput, context));

  const verificationCode = await generatePhoneVerificationCode(user, context);
  await sendVerificationCodeToPhone(verificationCode, context);

  publishEvent(AuthEvent.USER_PHONE_LOGIN_STARTED, user, context);

  return makeSuccessStartPayload(verificationCode.state);
};

export interface LogInPhoneVerifyInput {
  code: string;
  state: string;
}

export const logInPhoneVerify = async (
  input: LogInPhoneVerifyInput,
  context: RequestContext,
): Promise<AuthResultPayload> => {
  const { userRepository, phoneVerificationCodeRepository } = enhance(
    context,
  ).repositories;

  const verificationCode = await phoneVerificationCodeRepository.findActiveByState(
    input.state,
  );

  if (!verificationCode || verificationCode.code !== input.code) {
    const error = authErrors.wrongPhoneVerificationCode();
    return makeErrorVerifyPayload(error);
  }

  const user = await userRepository.getById(verificationCode.userId);

  await phoneVerificationCodeRepository.remove(verificationCode);
  await userRepository.addLoginEntry(user, makeLoginEntry(user));

  if (!user.isActive) {
    const verifiedUser = verifyChangeset(user);
    await userRepository.update(verifiedUser);
  }

  publishEvent(AuthEvent.USER_PHONE_LOGIN_VERIFIED, user, context);

  return makeSuccessVerifyPayload(createAccessToken(user));
};
