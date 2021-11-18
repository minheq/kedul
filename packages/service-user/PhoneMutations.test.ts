import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import { normalizePhoneNumber, randomString } from '@kedul/common-utils';
import * as Phone from '@kedul/service-phone';
import { subMinutes } from 'date-fns';

import { PhoneVerificationCode } from './AuthTypes';
import { logInPhoneStart, logInPhoneVerify } from './PhoneMutations';
import { enhance } from './RequestContext';
import { makeUser } from './UserMutations';
import { User } from './UserTypes';

jest.mock('axios');
jest.mock('@kedul/service-phone');

const knex = makeKnex();
const userServiceRequestContext = enhance(makeContext());
const userRepository = userServiceRequestContext.repositories.userRepository;
const phoneVerificationCodeRepository =
  userServiceRequestContext.repositories.phoneVerificationCodeRepository;
const sendVerificationCodeMock = jest.spyOn(Phone, 'sendVerificationCode');

export const createExpiredPhoneVerificationCode = async (
  user: User,
  code = '123456',
): Promise<PhoneVerificationCode> => {
  if (!user.account.phoneNumber || !user.account.countryCode) {
    throw new Error(
      'createExpiredPhoneVerificationCode: user account needs phoneNumber and countryCode',
    );
  }
  const phoneVerificationCode = {
    code,
    countryCode: user.account.countryCode,
    expiredAt: subMinutes(new Date(), 11),
    id: '123',
    phoneNumber: user.account.phoneNumber,
    state: randomString(),
    type: 'any',
    userId: user.id,
  };

  await phoneVerificationCodeRepository.save(phoneVerificationCode);

  return phoneVerificationCode;
};

beforeAll(async () => {
  await knex.migrate.latest({
    directory: path.resolve(__dirname, './migrations'),
  });
});

afterAll(async () => {
  await knex.destroy();
});

describe('logInPhoneStart', () => {
  test('should send verification number happy path', async () => {
    const input = {
      countryCode: 'VN',
      phoneNumber: '909111222',
    };

    const result = await logInPhoneStart(input, makeContext());
    expect(sendVerificationCodeMock).toHaveBeenCalled();

    expect(result.isSuccessful).toBeTruthy();
  });

  test('should resend new code if requested within time frame', async () => {
    const input = {
      countryCode: 'VN',
      phoneNumber: '909111223',
    };

    await logInPhoneStart(input, makeContext());
    const originalVerificationCode = await phoneVerificationCodeRepository.findLatest();

    await logInPhoneStart(input, makeContext());
    const nextVerificationCode = await phoneVerificationCodeRepository.findLatest();

    expect(sendVerificationCodeMock).toHaveBeenCalled();
    expect(nextVerificationCode.code).not.toBe(originalVerificationCode.code);
    expect(nextVerificationCode.phoneNumber).toBe(
      originalVerificationCode.phoneNumber,
    );
    expect(nextVerificationCode.id).not.toBe(originalVerificationCode.id);
  });

  test('should resend new code if requested outside time frame', async () => {
    const input = {
      countryCode: 'VN',
      phoneNumber: '909111224',
    };
    const code = '222333';

    const user = makeUser({
      account: {
        countryCode: input.countryCode,
        phoneNumber: normalizePhoneNumber(input.phoneNumber, input.countryCode),
      },
    });
    await userRepository.save(user);

    const originalVerificationCode = await createExpiredPhoneVerificationCode(
      user,
      code,
    );

    await logInPhoneStart(input, makeContext());

    const nextVerificationCode = await phoneVerificationCodeRepository.findLatest();

    expect(nextVerificationCode.id).not.toBe(originalVerificationCode.id);
  });
});

describe('logInPhoneVerify', () => {
  test('should log in existing user', async () => {
    const input = {
      countryCode: 'VN',
      phoneNumber: '0909 11 1225',
    };

    const user = makeUser({
      account: {
        countryCode: input.countryCode,
        phoneNumber: normalizePhoneNumber(input.phoneNumber, input.countryCode),
      },
    });
    await userRepository.save(user);

    const existingUserAccount = await userRepository.findByPhoneNumber(
      normalizePhoneNumber(input.phoneNumber),
    );

    expect(existingUserAccount).toBeTruthy();

    const { state } = await logInPhoneStart(input, makeContext());

    const latestVerificationCode = await phoneVerificationCodeRepository.findLatest();

    const result = await logInPhoneVerify(
      {
        code: latestVerificationCode.code,
        state: state!,
      },
      makeContext(),
    );

    expect(result.accessToken).toBeTruthy();
  });

  test('should create and log in user', async () => {
    const input = {
      countryCode: 'VN',
      phoneNumber: '909111226',
    };

    const existingUserAccount = await userRepository.findByPhoneNumber(
      input.phoneNumber,
    );
    expect(existingUserAccount).toBeFalsy();

    const { state } = await logInPhoneStart(input, makeContext());

    const latestVerificationCode = await phoneVerificationCodeRepository.findLatest();

    const result = await logInPhoneVerify(
      {
        code: latestVerificationCode.code,
        state: state!,
      },
      makeContext(),
    );

    const newUserAccount = await userRepository.findByPhoneNumber(
      input.phoneNumber,
    );

    expect(newUserAccount).toBeTruthy();
    expect(result.accessToken).toBeTruthy();
  });

  test('should return error given invalid verification code', async () => {
    const input = {
      countryCode: 'VN',
      phoneNumber: '909111227',
    };

    const { state } = await logInPhoneStart(input, makeContext());

    const latestVerificationCode = await phoneVerificationCodeRepository.findLatest();

    expect(latestVerificationCode.phoneNumber).toBe(input.phoneNumber);
    expect(latestVerificationCode.countryCode).toBe(input.countryCode);

    const result = await logInPhoneVerify(
      {
        code: 'aaaaaa',
        state: state!,
      },
      makeContext(),
    );

    expect(result.isSuccessful).toBeFalsy();
  });

  test('should return error given invalid state', async () => {
    const input = {
      countryCode: 'VN',
      phoneNumber: '909111228',
    };

    await logInPhoneStart(input, makeContext());

    const latestVerificationCode = await phoneVerificationCodeRepository.findLatest();

    expect(latestVerificationCode.phoneNumber).toBe(input.phoneNumber);
    expect(latestVerificationCode.countryCode).toBe(input.countryCode);

    const result = await logInPhoneVerify(
      {
        code: latestVerificationCode.code,
        state: '1234',
      },
      makeContext(),
    );

    expect(result.isSuccessful).toBeFalsy();
  });
});
