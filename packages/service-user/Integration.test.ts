import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import faker from 'faker';

import { AuthResultPayload } from './AuthTypes';
import { logInEmailStart, logInEmailVerify } from './EmailMutations';
import * as FacebookAPI from './FacebookAPI';
import { disconnectFacebook, logInFacebook } from './FacebookMutations';
import * as GoogleAPI from './GoogleAPI';
import { disconnectGoogle, logInGoogle } from './GoogleMutations';
import { logInPhoneStart, logInPhoneVerify } from './PhoneMutations';
import { enhance } from './RequestContext';
import { verifyAccessToken } from './TokenUtils';
import { UserErrorCode } from './UserConstants';
import {
  deactivateUser,
  updateUserEmailStart,
  updateUserEmailVerify,
  updateUserPhoneStart,
} from './UserMutations';

const knex = makeKnex();
const userServiceRequestContext = enhance(makeContext());
const userRepository = userServiceRequestContext.repositories.userRepository;
const emailVerificationCodeRepository =
  userServiceRequestContext.repositories.emailVerificationCodeRepository;
const phoneVerificationCodeRepository =
  userServiceRequestContext.repositories.phoneVerificationCodeRepository;

jest.mock('axios');
jest.mock('@kedul/service-phone');
jest.mock('@kedul/service-mail');
jest.mock('./FacebookAPI');
jest.mock('./GoogleAPI');

const socialToken = 'asdfxcvzz';
const getGoogleProfileMock = jest.spyOn(GoogleAPI, 'getGoogleProfile');
const getFacebookProfileMock = jest.spyOn(FacebookAPI, 'getFacebookProfile');

const logInGoogleWithEmail = async (email: string, id: number) => {
  const googleProfile = {
    aud: 'a',
    email,
    exp: 2,
    iat: 1,
    iss: 'a',
    name: faker.name.firstName(),
    sub: String(id),
  };

  getGoogleProfileMock.mockImplementation(async () => googleProfile);

  return logInGoogle({ googleIdToken: socialToken }, makeContext());
};

const logInFacebookWithEmail = async (id: string, email?: string) => {
  const googleProfile = {
    email,
    id,
    name: faker.name.firstName(),
  };

  getFacebookProfileMock.mockImplementation(async () => googleProfile);

  return logInFacebook({ facebookAccessToken: socialToken }, makeContext());
};

const logInPasswordlessWithEmail = async (email: string) => {
  const { state } = await logInEmailStart({ email }, makeContext());

  const latestVerificationCode = await emailVerificationCodeRepository.findLatest();

  return logInEmailVerify(
    {
      code: latestVerificationCode.code,
      state: state!,
    },
    makeContext(),
  );
};

const logInPasswordlessWithPhone = async (phoneNumber: string) => {
  const { state } = await logInPhoneStart(
    {
      countryCode: 'VN',
      phoneNumber,
    },
    makeContext(),
  );

  const latestVerificationCode = await phoneVerificationCodeRepository.findLatest();

  return logInPhoneVerify(
    {
      code: latestVerificationCode.code,
      state: state!,
    },
    makeContext(),
  );
};

const updateUserEmail = async (email: string, userId: string) => {
  await updateUserEmailStart(
    {
      email,
      id: userId,
    },
    makeContext({ actor: { userId } }),
  );

  const latestVerificationCode = await emailVerificationCodeRepository.findActiveByUserId(
    userId,
  );

  await updateUserEmailVerify(
    {
      code: latestVerificationCode!.code,
      email,
      id: userId,
    },
    makeContext({ actor: { userId } }),
  );

  return userRepository.getById(userId);
};

const getUserIdFromAccessToken = async (accessToken: string) => {
  const accessTokenPayload = await verifyAccessToken(accessToken);

  return accessTokenPayload.tokenPayload!.userId;
};

beforeAll(async () => {
  await knex.migrate.latest({
    directory: path.resolve(__dirname, './migrations'),
  });
});

afterAll(async () => {
  await knex.destroy();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('Scenario 1', () => {
  const emailA = 'asdfasdf@gmail.com';
  const googleUserId = 123123123;
  let googleLoginResult: AuthResultPayload;
  let emailLoginResult: AuthResultPayload;
  let userIdA: string;

  test('user A logging in with Google with email A', async () => {
    googleLoginResult = await logInGoogleWithEmail(emailA, googleUserId);
  });

  test('user A logging in with email with email A', async () => {
    emailLoginResult = await logInPasswordlessWithEmail(emailA);
  });

  test('should authenticate the same user account A', async () => {
    const googleLoginAccessToken = googleLoginResult.accessToken;
    const emailLoginAccessToken = emailLoginResult.accessToken;

    const googleUserId = await getUserIdFromAccessToken(
      googleLoginAccessToken!,
    );
    const emailUserId = await getUserIdFromAccessToken(emailLoginAccessToken!);

    expect(googleUserId).toBe(emailUserId);

    userIdA = googleUserId;
  });

  const emailB = 'asdfasdf1@gmail.com';

  test('user A updates his user account A from email A to email B', async () => {
    const updatedUser = await updateUserEmail(emailB, userIdA);
    expect(updatedUser.account.email).toBe(emailB);
  });

  test('user A logging in with Google with email A should authenticate the same user account A despite him/her updated to email B', async () => {
    const result = await logInGoogleWithEmail(emailA, googleUserId);

    const userId = await getUserIdFromAccessToken(result.accessToken!);

    expect(userId).toBe(userIdA);
  });

  test('user A logging in with email with email B should authenticate the same user account A', async () => {
    const result = await logInPasswordlessWithEmail(emailB);
    const emailUserId = await getUserIdFromAccessToken(result.accessToken!);

    expect(emailUserId).toBe(userIdA);
  });

  test('user A disconnects Google account from user account A, frees up email A', async () => {
    const result = await disconnectGoogle(
      { userId: userIdA },
      makeContext({ actor: { userId: userIdA } }),
    );

    expect(result.isSuccessful).toBeTruthy();
  });

  test('user A log in with Google/email with email A created new user account B', async () => {
    const result = await logInGoogleWithEmail(emailA, googleUserId);

    const userId = await getUserIdFromAccessToken(result.accessToken!);

    expect(userId).not.toBe(userIdA);
  });
});

describe('Scenario 2', () => {
  const emailA = 'asdfasdfee@gmail.com';
  const googleUserId = 444222;
  const phoneNumber = '909111224';
  let userIdB: string;

  test('user A logging in with Google with email A', async () => {
    await logInGoogleWithEmail(emailA, googleUserId);
  });

  test('user B logging in with phone with phone number A', async () => {
    const result = await logInPasswordlessWithPhone(phoneNumber);
    userIdB = await getUserIdFromAccessToken(result.accessToken!);
  });

  test('user B update email to email A should fail, as it was already used by user A', async () => {
    const result = await updateUserEmailStart(
      {
        email: emailA,
        id: userIdB,
      },
      makeContext({ actor: { userId: userIdB } }),
    );

    expect(result.userError!.code).toBe(UserErrorCode.USER_ALREADY_EXIST);
  });
});

describe('Scenario 3', () => {
  const emailA = 'asdfasdfgg@gmail.com';
  const phoneNumber = '909111223';
  let userIdB: string;

  test('user A logging in with phone with phone number A', async () => {
    await logInPasswordlessWithPhone(phoneNumber);
  });

  test('user B logging in with passwordless email with email A', async () => {
    const result = await logInPasswordlessWithEmail(emailA);
    userIdB = await getUserIdFromAccessToken(result.accessToken!);
  });

  test('user B update phone number to phone number A should fail, as it was already used by user A', async () => {
    const result = await updateUserPhoneStart(
      {
        countryCode: 'VN',
        id: userIdB,
        phoneNumber,
      },
      makeContext({ actor: { userId: userIdB } }),
    );

    expect(result.userError!.code).toBe(UserErrorCode.USER_ALREADY_EXIST);
  });
});

describe('Scenario 4', () => {
  const emailA = 'asdgg@gmail.com';
  const facebookUserId = '12322';
  let userId: string;

  test('user A logging in with Facebook with no email', async () => {
    const result = await logInFacebookWithEmail(facebookUserId);
    userId = await getUserIdFromAccessToken(result.accessToken!);
  });

  test('user A disconnecting Facebook should fail because it is only login option', async () => {
    const result = await disconnectFacebook(
      { userId },
      makeContext({ actor: { userId } }),
    );
    expect(result.isSuccessful).toBeFalsy();
  });

  test('user A updates user account with email A', async () => {
    await updateUserEmail(emailA, userId);
  });

  test('user A disconnecting Facebook should work', async () => {
    const result = await disconnectFacebook(
      { userId },
      makeContext({ actor: { userId } }),
    );
    expect(result.isSuccessful).toBeTruthy();
  });

  test('user A logging in with email A should authenticate user', async () => {
    const result = await logInPasswordlessWithEmail(emailA);
    expect(result.isSuccessful).toBeTruthy();
  });

  test('user A logging in with Facebook with no email should create new user account B', async () => {
    const result = await logInFacebookWithEmail(facebookUserId);
    const userIdB = await getUserIdFromAccessToken(result.accessToken!);

    expect(userIdB).not.toBe(userId);
  });
});

describe('Scenario 5', () => {
  const emailA = 'asga@gmail.com';
  const emailB = 'asgb@gmail.com';
  const emailC = 'asgc@gmail.com';
  const googleUserId = 1232555;
  let userIdA: string;

  test('user A logging in with Google with email A and id A', async () => {
    const result = await logInGoogleWithEmail(emailA, googleUserId);
    userIdA = await getUserIdFromAccessToken(result.accessToken!);
  });

  test('user A logging in again with Google with email B and id A should authenticate the same user', async () => {
    const result = await logInGoogleWithEmail(emailB, googleUserId);
    const sameUserId = await getUserIdFromAccessToken(result.accessToken!);

    expect(sameUserId).toBe(userIdA);
  });

  test('user A updates user account email to email C', async () => {
    const updatedUser = await updateUserEmail(emailC, userIdA);

    expect(updatedUser.account.email).toBe(emailC);
    expect(updatedUser.id).toBe(userIdA);
  });
});

describe('Scenario 6', () => {
  const emailA = 'asgacz@gmail.com';
  const phoneNumber = '909111876';
  const googleUserId = 1232566;
  let userIdB: string;

  test('user A logging in with Google with email A', async () => {
    await logInGoogleWithEmail(emailA, googleUserId);
  });

  test('user B logging in with phone with phone number A', async () => {
    const result = await logInPasswordlessWithPhone(phoneNumber);
    userIdB = await getUserIdFromAccessToken(result.accessToken!);
  });

  test('user B update email to email A should fail, as it was already used by user A', async () => {
    const result = await updateUserEmailStart(
      {
        email: emailA,
        id: userIdB,
      },
      makeContext({ actor: { userId: userIdB } }),
    );

    expect(result.userError!.code).toBe(UserErrorCode.USER_ALREADY_EXIST);
  });
});

describe('Scenario 7', () => {
  const emailA = 'asgsaakggka@gmail.com';
  const phoneNumber = '909111266';
  const googleUserId = 1232577;
  let userIdB: string;

  test('user A logging in with phone with phone number A', async () => {
    await logInPasswordlessWithPhone(phoneNumber);
  });

  test('user B logging in with Google with email A', async () => {
    const result = await logInGoogleWithEmail(emailA, googleUserId);
    userIdB = await getUserIdFromAccessToken(result.accessToken!);
  });

  test('user B update phone number to phone number A should fail, as it was already used by user A', async () => {
    const result = await updateUserPhoneStart(
      {
        countryCode: 'VN',
        id: userIdB,
        phoneNumber,
      },
      makeContext({ actor: { userId: userIdB } }),
    );

    expect(result.userError!.code).toBe(UserErrorCode.USER_ALREADY_EXIST);
  });
});

describe('Scenario 8', () => {
  const emailA = 'kggka@gmail.com';
  let userIdA: string;
  let userIdB: string;

  test('user A creates user account A which has email A and then deactivates it', async () => {
    const result = await logInPasswordlessWithEmail(emailA);
    userIdA = await getUserIdFromAccessToken(result.accessToken!);
    await deactivateUser(
      { id: userIdA },
      makeContext({ actor: { userId: userIdA } }),
    );
  });

  test('user B logging in with email A should create a new user account B and then deactivates it', async () => {
    const result = await logInPasswordlessWithEmail(emailA);
    userIdB = await getUserIdFromAccessToken(result.accessToken!);

    expect(userIdA).not.toBe(userIdB);

    await deactivateUser(
      { id: userIdB },
      makeContext({ actor: { userId: userIdB } }),
    );
  });

  test('user C logging in with email A should create a new user account C', async () => {
    const result = await logInPasswordlessWithEmail(emailA);
    const userIdC = await getUserIdFromAccessToken(result.accessToken!);

    expect(userIdC).not.toBe(userIdA);
    expect(userIdC).not.toBe(userIdB);
  });

  test('user account A and user account B should not exist anymore in database', async () => {
    const userA = await userRepository.findById(userIdA);
    const userB = await userRepository.findById(userIdB);

    expect(userA).toBeFalsy();
    expect(userB).toBeFalsy();
  });
});

describe('Scenario 9', () => {
  const emailA = 'asga@gmail.com';
  const googleUserId = 1232555;
  let userIdA: string;

  test('user A logging in with Google with email A and id A and then deactivates it', async () => {
    const result = await logInGoogleWithEmail(emailA, googleUserId);

    userIdA = await getUserIdFromAccessToken(result.accessToken!);

    await deactivateUser(
      { id: userIdA },
      makeContext({ actor: { userId: userIdA } }),
    );
  });

  test('user A re-log in with Google with email A should work and have different user id', async () => {
    const result = await logInGoogleWithEmail(emailA, googleUserId);
    const userId = await getUserIdFromAccessToken(result.accessToken!);

    expect(userId).not.toBe(userIdA);
  });
});
