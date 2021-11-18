import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import {
  normalizeEmail,
  normalizePhoneNumber,
  randomString,
} from '@kedul/common-utils';
import * as Mail from '@kedul/service-mail';
import * as Phone from '@kedul/service-phone';
import { subMinutes } from 'date-fns';
import faker from 'faker';

import { EmailVerificationCode, PhoneVerificationCode } from './AuthTypes';
import { Table } from './Database';
import { logInEmailStart, logInEmailVerify } from './EmailMutations';
import { logInPhoneStart, logInPhoneVerify } from './PhoneMutations';
import { enhance } from './RequestContext';
import {
  deactivateUser,
  makeUser,
  updateUserEmailStart,
  updateUserEmailVerify,
  updateUserPhoneStart,
  updateUserPhoneVerify,
  updateUserProfile,
} from './UserMutations';
import { PersonGender, User } from './UserTypes';

const knex = makeKnex();
jest.mock('@kedul/service-mail');
jest.mock('@kedul/service-phone');

const sendEmailVerificationCodeMock = jest.spyOn(Mail, 'sendVerificationCode');
const sendPhoneVerificationCodeMock = jest.spyOn(Phone, 'sendVerificationCode');

const userServiceRequestContext = enhance(makeContext());
const userRepository = userServiceRequestContext.repositories.userRepository;
const emailVerificationCodeRepository =
  userServiceRequestContext.repositories.emailVerificationCodeRepository;
const phoneVerificationCodeRepository =
  userServiceRequestContext.repositories.phoneVerificationCodeRepository;
export const findLatestEmailVerificationCode = async (): Promise<
  EmailVerificationCode
> => {
  return knex
    .select()
    .from(Table.EMAIL_VERIFICATION_CODE)
    .orderBy('expiredAt', 'desc')
    .first();
};

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

export const findLatestPhoneVerificationCode = async (): Promise<
  PhoneVerificationCode & { id: number }
> => {
  return knex
    .select()
    .from(Table.PHONE_VERIFICATION_CODE)
    .orderBy('expiredAt', 'desc')
    .first();
};

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

describe('updateUserEmailStart', () => {
  test('should send verification number happy path', async () => {
    const oldEmail = 'test2@kedul.com';

    const user = makeUser({
      account: { email: normalizeEmail(oldEmail) },
    });
    await userRepository.save(user);
    const email = 'test@kedul.com';

    const result = await updateUserEmailStart(
      { email, id: user.id },
      makeContext({ actor: { userId: user.id } }),
    );
    expect(sendEmailVerificationCodeMock).toHaveBeenCalled();

    expect(result.isSuccessful).toBeTruthy();
  });

  test('should resend new code if requested within time frame', async () => {
    const email = 'test5@kedul.com';
    const oldEmail = 'test123244@kedul.com';

    const user = makeUser({
      account: { email: normalizeEmail(oldEmail) },
    });
    await userRepository.save(user);

    await updateUserEmailStart(
      { email, id: user.id },
      makeContext({ actor: { userId: user.id } }),
    );
    const originalVerificationCode = await findLatestEmailVerificationCode();
    await updateUserEmailStart(
      { email, id: user.id },
      makeContext({ actor: { userId: user.id } }),
    );
    const nextVerificationCode = await findLatestEmailVerificationCode();

    expect(sendEmailVerificationCodeMock).toHaveBeenCalled();
    expect(nextVerificationCode.code).not.toBe(originalVerificationCode.code);
    expect(nextVerificationCode.email).toBe(originalVerificationCode.email);
    expect(nextVerificationCode.id).not.toBe(originalVerificationCode.id);
  });

  test('should resend the new code if requested outside time frame', async () => {
    const email = 'test7@kedul.com';
    const oldEmail = 'test12324423@kedul.com';

    const user = makeUser({
      account: { email: normalizeEmail(oldEmail) },
    });
    await userRepository.save(user);
    const code = '222333';

    const originalVerificationCode = await createExpiredEmailVerificationCode(
      user,
      code,
    );

    await updateUserEmailStart(
      {
        email,
        id: user.id,
      },
      makeContext({ actor: { userId: user.id } }),
    );

    const nextVerificationCode = await findLatestEmailVerificationCode();

    expect(nextVerificationCode.id).not.toBe(originalVerificationCode.id);
  });

  test('should return error if there is user account with existing email', async () => {
    const oldEmail = 'test1234411244@kedul.com';

    const user = makeUser({ account: { email: normalizeEmail(oldEmail) } });
    await userRepository.save(user);

    const existingEmail = 'test442@kedul.com';

    await userRepository.save(
      makeUser({ account: { email: normalizeEmail(existingEmail) } }),
    );

    const result = await updateUserEmailStart(
      {
        email: existingEmail,
        id: user.id,
      },
      makeContext({ actor: { userId: user.id } }),
    );
    expect(result.isSuccessful).toBeFalsy();
  });
});

describe('updateUserEmailVerify', () => {
  test('should successfully update user account email', async () => {
    const oldEmail = 'test44@kedul.com';

    const user = makeUser({ account: { email: normalizeEmail(oldEmail) } });
    await userRepository.save(user);

    const newEmail = 'test2321@kedul.com';

    await updateUserEmailStart(
      { email: newEmail, id: user.id },
      makeContext({ actor: { userId: user.id } }),
    );
    const latestVerificationCode = await emailVerificationCodeRepository.findActiveByUserId(
      user.id,
    );

    const result = await updateUserEmailVerify(
      {
        code: latestVerificationCode!.code,
        email: newEmail,
        id: user.id,
      },
      makeContext({ actor: { userId: user.id } }),
    );

    expect(result.user!.account.email).toBe(newEmail);
  });

  test('should return error given invalid verification code', async () => {
    const oldEmail = 'test6465546@kedul.com';

    const user = makeUser({ account: { email: normalizeEmail(oldEmail) } });
    await userRepository.save(user);

    const result = await updateUserEmailVerify(
      {
        code: 'aaaaaa',
        email: 'test22112@kedul.com',
        id: user.id,
      },
      makeContext({ actor: { userId: user.id } }),
    );

    expect(result.isSuccessful).toBeFalsy();
  });

  test('should return error if there is newly create account that was created meanwhile updating', async () => {
    const oldEmail = 'test146@kedul.com';

    const user = makeUser({ account: { email: normalizeEmail(oldEmail) } });
    await userRepository.save(user);

    const newEmail = 'test4@kedul.com';
    await updateUserEmailStart(
      {
        email: newEmail,
        id: user.id,
      },
      makeContext({ actor: { userId: user.id } }),
    );

    // Initiate a login under same email while update is happening
    const { state } = await logInEmailStart({ email: newEmail }, makeContext());

    const latestVerificationCode = await findLatestEmailVerificationCode();

    // New account created
    await logInEmailVerify(
      {
        code: latestVerificationCode.code,
        state: state!,
      },
      makeContext(),
    );

    const result = await updateUserEmailVerify(
      {
        code: latestVerificationCode.code,
        email: newEmail,
        id: user.id,
      },
      makeContext({ actor: { userId: user.id } }),
    );

    expect(result.isSuccessful).toBeFalsy();
  });
});

describe('updateUserPhoneStart', () => {
  test('should send verification number happy path', async () => {
    const oldPhone = '909111223';

    const user = makeUser({
      account: {
        countryCode: 'VN',
        phoneNumber: normalizePhoneNumber(oldPhone),
      },
    });
    await userRepository.save(user);
    const phoneNumber = '909111233';

    const result = await updateUserPhoneStart(
      {
        countryCode: 'VN',
        id: user.id,
        phoneNumber,
      },
      makeContext({ actor: { userId: user.id } }),
    );
    expect(sendPhoneVerificationCodeMock).toHaveBeenCalled();

    expect(result.isSuccessful).toBeTruthy();
  });

  test('should resend new code if requested within time frame', async () => {
    const oldPhone = '909111225';
    const phoneNumber = '909111235';

    const user = makeUser({
      account: {
        countryCode: 'VN',
        phoneNumber: normalizePhoneNumber(oldPhone),
      },
    });
    await userRepository.save(user);

    await updateUserPhoneStart(
      {
        countryCode: 'VN',
        id: user.id,
        phoneNumber,
      },
      makeContext({ actor: { userId: user.id } }),
    );
    const originalVerificationCode = await findLatestPhoneVerificationCode();
    await updateUserPhoneStart(
      {
        countryCode: 'VN',
        id: user.id,
        phoneNumber,
      },
      makeContext({ actor: { userId: user.id } }),
    );
    const nextVerificationCode = await findLatestPhoneVerificationCode();

    expect(sendPhoneVerificationCodeMock).toHaveBeenCalled();
    expect(nextVerificationCode.code).not.toBe(originalVerificationCode.code);
    expect(nextVerificationCode.phoneNumber).toBe(
      originalVerificationCode.phoneNumber,
    );
    expect(nextVerificationCode.id).not.toBe(originalVerificationCode.id);
  });

  test('should resend the new code if requested outside time frame', async () => {
    const oldPhone = '909111226';
    const phoneNumber = '909111236';

    const user = makeUser({
      account: {
        countryCode: 'VN',
        phoneNumber: normalizePhoneNumber(oldPhone),
      },
    });
    await userRepository.save(user);
    const code = '222333';

    const originalVerificationCode = await createExpiredPhoneVerificationCode(
      user,
      code,
    );

    await updateUserPhoneStart(
      {
        countryCode: 'VN',
        id: user.id,
        phoneNumber,
      },
      makeContext({ actor: { userId: user.id } }),
    );

    const nextVerificationCode = await findLatestPhoneVerificationCode();

    expect(nextVerificationCode.id).not.toBe(originalVerificationCode.id);
  });

  test('should return error if there is user account with existing phoneNumber', async () => {
    const oldPhone = '909111227';

    const user = makeUser({
      account: {
        countryCode: 'VN',
        phoneNumber: normalizePhoneNumber(oldPhone),
      },
    });
    await userRepository.save(user);

    const existingPhone = '909111228';

    await userRepository.save(
      makeUser({
        account: {
          phoneNumber: normalizePhoneNumber(existingPhone),
        },
      }),
    );

    const result = await updateUserPhoneStart(
      {
        countryCode: 'VN',
        id: user.id,
        phoneNumber: existingPhone,
      },
      makeContext({ actor: { userId: user.id } }),
    );
    expect(result.isSuccessful).toBeFalsy();
  });
});

describe('updateUserPhoneVerify', () => {
  test('should successfully update user account phoneNumber', async () => {
    const oldPhone = '909111229';

    const user = makeUser({
      account: {
        countryCode: 'VN',
        phoneNumber: normalizePhoneNumber(oldPhone),
      },
    });
    await userRepository.save(user);

    const newPhone = '909111239';

    await updateUserPhoneStart(
      {
        countryCode: 'VN',
        id: user.id,
        phoneNumber: newPhone,
      },
      makeContext({ actor: { userId: user.id } }),
    );
    const latestVerificationCode = await phoneVerificationCodeRepository.findActiveByUserId(
      user.id,
    );

    const result = await updateUserPhoneVerify(
      {
        code: latestVerificationCode!.code,
        countryCode: 'VN',
        id: user.id,
        phoneNumber: newPhone,
      },
      makeContext({ actor: { userId: user.id } }),
    );

    expect(result.user!.account.phoneNumber).toBe(newPhone);
  });

  test('should return error given invalid verification code', async () => {
    const oldPhone = '909111321';

    const user = makeUser({
      account: {
        countryCode: 'VN',
        phoneNumber: normalizePhoneNumber(oldPhone),
      },
    });
    await userRepository.save(user);

    const result = await updateUserPhoneVerify(
      {
        code: 'aaaaaa',
        countryCode: 'VN',
        id: user.id,
        phoneNumber: '909111331',
      },
      makeContext({ actor: { userId: user.id } }),
    );

    expect(result.isSuccessful).toBeFalsy();
  });

  test('should return error if there is newly create account that was created meanwhile updating', async () => {
    const oldPhone = '909111322';

    const user = makeUser({
      account: {
        countryCode: 'VN',
        phoneNumber: normalizePhoneNumber(oldPhone),
      },
    });
    await userRepository.save(user);

    const newPhone = '909111332';
    await updateUserPhoneStart(
      {
        countryCode: 'VN',
        id: user.id,
        phoneNumber: newPhone,
      },
      makeContext({ actor: { userId: user.id } }),
    );

    // Initiate a login under same phoneNumber while update is happening
    const { state } = await logInPhoneStart(
      {
        countryCode: 'VN',
        phoneNumber: newPhone,
      },
      makeContext(),
    );

    const latestVerificationCode = await findLatestPhoneVerificationCode();

    // New account created
    await logInPhoneVerify(
      {
        code: latestVerificationCode.code,
        state: state!,
      },
      makeContext(),
    );

    const result = await updateUserPhoneVerify(
      {
        code: latestVerificationCode.code,
        countryCode: 'VN',
        id: user.id,
        phoneNumber: newPhone,
      },
      makeContext({ actor: { userId: user.id } }),
    );

    expect(result.isSuccessful).toBeFalsy();
  });
});

describe('updateUserProfile', () => {
  test('updateUserProfile happy path', async () => {
    const user = makeUser({});
    await userRepository.save(user);

    const input = {
      id: user.id,
      profile: {
        fullName: faker.name.firstName(),
        gender: PersonGender.FEMALE,
        birthday: null,
      },
    };

    const result = await updateUserProfile(
      input,
      makeContext({ actor: { userId: user.id } }),
    );

    expect(result.user!.profile).toMatchObject(input.profile!);
  });
});

describe('deactivateUser', () => {
  test('should delete user', async () => {
    const user = makeUser({});
    await userRepository.save(user);

    const input = {
      id: user.id,
    };

    const result = await deactivateUser(
      input,
      makeContext({ actor: { userId: user.id } }),
    );

    expect(result.isSuccessful).toBeTruthy();

    const deletedUser = await userRepository.findById(user.id);
    expect(deletedUser).toBeFalsy();
  });
});
