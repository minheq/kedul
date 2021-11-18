import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import { normalizeEmail, randomString } from '@kedul/common-utils';
import * as Mail from '@kedul/service-mail';
import { subMinutes } from 'date-fns';

import { EmailVerificationCode } from './AuthTypes';
import { logInEmailStart, logInEmailVerify } from './EmailMutations';
import { enhance } from './RequestContext';
import { makeUser } from './UserMutations';
import { User } from './UserTypes';

jest.mock('axios');
jest.mock('@kedul/service-mail');

const knex = makeKnex();
const sendVerificationCodeMock = jest.spyOn(Mail, 'sendVerificationCode');
const userServiceRequestContext = enhance(makeContext());
const userRepository = userServiceRequestContext.repositories.userRepository;
const emailVerificationCodeRepository =
  userServiceRequestContext.repositories.emailVerificationCodeRepository;

export const createExpiredEmailVerificationCode = async (
  user: User,
  code = '123456',
): Promise<EmailVerificationCode> => {
  if (!user.account.email) {
    throw new Error(
      'createExpiredEmailVerificationCode: user account needs email',
    );
  }
  const emailVerificationCode = {
    code,
    email: user.account.email,
    expiredAt: subMinutes(new Date(), 11),
    id: '123',
    state: randomString(),
    type: 'any',
    userId: user.id,
  };

  await emailVerificationCodeRepository.save(emailVerificationCode);

  return emailVerificationCode;
};

beforeAll(async () => {
  await knex.migrate.latest({
    directory: path.resolve(__dirname, './migrations'),
  });
});

afterAll(async () => {
  await knex.destroy();
});

describe('logInEmailStart', () => {
  test('should send verification number happy path', async () => {
    const email = 'test@kedul.com';

    const result = await logInEmailStart({ email }, makeContext());
    expect(sendVerificationCodeMock).toHaveBeenCalled();

    expect(result.isSuccessful).toBeTruthy();
  });

  test('should resend new code if requested within time frame', async () => {
    const email = 'test5@kedul.com';

    await logInEmailStart({ email }, makeContext());
    const originalVerificationCode = await emailVerificationCodeRepository.findLatest();
    await logInEmailStart({ email }, makeContext());
    const nextVerificationCode = await emailVerificationCodeRepository.findLatest();

    expect(sendVerificationCodeMock).toHaveBeenCalled();
    expect(nextVerificationCode.code).not.toBe(originalVerificationCode.code);
    expect(nextVerificationCode.email).toBe(originalVerificationCode.email);
    expect(nextVerificationCode.id).not.toBe(originalVerificationCode.id);
  });

  test('should resend new code if requested outside time frame', async () => {
    const email = 'test7@kedul.com';
    const code = '222333';

    const user = makeUser({
      account: { email: normalizeEmail(email) },
    });
    await userRepository.save(user);

    const originalVerificationCode = await createExpiredEmailVerificationCode(
      user,
      code,
    );

    await logInEmailStart({ email }, makeContext());

    const nextVerificationCode = await emailVerificationCodeRepository.findLatest();

    expect(nextVerificationCode.id).not.toBe(originalVerificationCode.id);
  });
});

describe('logInEmailVerify', () => {
  test('should log in existing user', async () => {
    const email = 'test2@kedul.com';

    const user = makeUser({
      account: { email: normalizeEmail(email) },
    });
    await userRepository.save(user);
    const existingUserAccount = await userRepository.findByEmail(email);

    expect(existingUserAccount).toBeTruthy();

    const { state } = await logInEmailStart({ email }, makeContext());

    const latestVerificationCode = await emailVerificationCodeRepository.findLatest();

    const result = await logInEmailVerify(
      {
        code: latestVerificationCode.code,
        state: state!,
      },
      makeContext(),
    );

    expect(result.accessToken).toBeTruthy();
  });

  test('should create and log in user', async () => {
    const email = 'test4@kedul.com';

    const existingUserAccount = await userRepository.findByEmail(email);
    expect(existingUserAccount).toBeFalsy();

    const { state } = await logInEmailStart({ email }, makeContext());

    const latestVerificationCode = await emailVerificationCodeRepository.findLatest();

    const result = await logInEmailVerify(
      {
        code: latestVerificationCode.code,
        state: state!,
      },
      makeContext(),
    );

    const newUserAccount = await userRepository.findByEmail(email);
    expect(newUserAccount).toBeTruthy();

    expect(result.accessToken).toBeTruthy();
  });

  test('should return error given invalid verification code', async () => {
    const email = 'test9@kedul.com';

    const { state } = await logInEmailStart({ email }, makeContext());

    const latestVerificationCode = await emailVerificationCodeRepository.findLatest();

    expect(latestVerificationCode.email).toBe(email);

    const result = await logInEmailVerify(
      {
        code: 'aaaaaa',
        state: state!,
      },
      makeContext(),
    );

    expect(result.isSuccessful).toBeFalsy();
  });

  test('should return error given invalid state', async () => {
    const email = 'test987@kedul.com';

    await logInEmailStart({ email }, makeContext());

    const latestVerificationCode = await emailVerificationCodeRepository.findLatest();

    expect(latestVerificationCode.email).toBe(email);

    const result = await logInEmailVerify(
      {
        code: latestVerificationCode.code,
        state: '1234',
      },
      makeContext(),
    );

    expect(result.isSuccessful).toBeFalsy();
  });
});
