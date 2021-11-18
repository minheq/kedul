import { publish, RequestContext } from '@kedul/common-server';
import {
  normalizeInputWithEmail,
  randomDigits,
  randomString,
  validateInputWithEmail,
} from '@kedul/common-utils';
import { sendVerificationCode } from '@kedul/service-mail';
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
  EmailVerificationCode,
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
import { createNewEmailUser } from './UserMutations';
import { AccountLogin, User } from './UserTypes';

const makeEmailVerificationCode = async (
  user: User,
  type = 'LOGIN',
): Promise<EmailVerificationCode> => {
  if (!user.account.email) {
    throw new Error('makeEmailVerificationCode failed. Supposed to have email');
  }

  const code = randomDigits();

  return {
    code,
    email: user.account.email,
    expiredAt: addMinutes(new Date(), VALID_CODE_DURATION_MIN),
    id: uuidv4(),
    state: randomString(),
    type,
    userId: user.id,
  };
};

export const generateEmailVerificationCode = async (
  user: User,
  context: RequestContext,
) => {
  const { emailVerificationCodeRepository } = enhance(context).repositories;

  await emailVerificationCodeRepository.removeByUser(user);

  const emailVerificationCode = await makeEmailVerificationCode(user);

  await emailVerificationCodeRepository.save(emailVerificationCode);

  return emailVerificationCode;
};

export const sendVerificationCodeToEmail = async (
  emailVerificationCode: EmailVerificationCode,
  context: RequestContext,
) => {
  await sendVerificationCode(
    emailVerificationCode.email,
    {
      code: emailVerificationCode.code,
      state: emailVerificationCode.state,
    },
    context,
  );
};

const verifyChangeset = (user: User): User => {
  return {
    ...user,
    account: {
      ...user.account,
      isEmailVerified: true,
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
  if (!user.account.email) throw new Error('Expected email');

  return {
    claim: user.account.email,
    createdAt: new Date(),
    key: user.id,
    name: LoginType.EMAIL,
  };
};

export interface LogInEmailStartInput {
  email: string;
}

export const logInEmailStart = async (
  input: LogInEmailStartInput,
  context: RequestContext,
): Promise<AuthStartPayload> => {
  const { userRepository } = enhance(context).repositories;

  const error = await validateInputWithEmail(input);
  if (error) return makeErrorStartPayload(error);

  const normalizedInput = normalizeInputWithEmail(input);
  const existingUser = await userRepository.findByEmail(input.email);

  const user =
    existingUser || (await createNewEmailUser(normalizedInput, context));

  const verificationCode = await generateEmailVerificationCode(user, context);
  await sendVerificationCodeToEmail(verificationCode, context);

  publishEvent(AuthEvent.USER_EMAIL_LOGIN_STARTED, user, context);

  return makeSuccessStartPayload(verificationCode.state);
};

export interface LogInEmailVerifyInput {
  code: string;
  state: string;
}

export const logInEmailVerify = async (
  input: LogInEmailVerifyInput,
  context: RequestContext,
): Promise<AuthResultPayload> => {
  const { userRepository, emailVerificationCodeRepository } = enhance(
    context,
  ).repositories;

  const verificationCode = await emailVerificationCodeRepository.findActiveByState(
    input.state,
  );

  if (!verificationCode || verificationCode.code !== input.code) {
    const error = authErrors.wrongEmailVerificationCode();
    return makeErrorVerifyPayload(error);
  }

  const user = await userRepository.getById(verificationCode.userId);

  await emailVerificationCodeRepository.remove(verificationCode);

  await userRepository.addLoginEntry(user, makeLoginEntry(user));

  if (!user.isActive) {
    const verifiedUser = verifyChangeset(user);
    await userRepository.update(verifiedUser);
  }

  publishEvent(AuthEvent.USER_EMAIL_LOGIN_VERIFIED, user, context);

  return makeSuccessVerifyPayload(createAccessToken(user));
};
