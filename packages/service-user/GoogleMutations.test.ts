import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import faker from 'faker';

import { UserErrorCode } from './AuthConstants';
import * as GoogleAPI from './GoogleAPI';
import {
  disconnectGoogle,
  linkGoogleAccount,
  logInGoogle,
} from './GoogleMutations';
import { enhance } from './RequestContext';
import { verifyAccessToken } from './TokenUtils';
import { makeUser } from './UserMutations';

jest.mock('axios');
jest.mock('./GoogleAPI');

const knex = makeKnex();
// anything as we mock
const googleIdToken = 'asdfxcvzz';
const getGoogleProfileMock = jest.spyOn(GoogleAPI, 'getGoogleProfile');

const userServiceRequestContext = enhance(makeContext());
const userRepository = userServiceRequestContext.repositories.userRepository;

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

describe('logInGoogle', () => {
  test('should create new user when not logged in and signing up with Google for the first time', async () => {
    const googleProfile = {
      aud: 'a',
      email: 'asdfasdf@gmail.com',
      exp: 2,
      iat: 1,
      iss: 'a',
      name: faker.name.firstName(),
      sub: '123123123',
    };

    getGoogleProfileMock.mockImplementation(async () => googleProfile);

    const result = await logInGoogle({ googleIdToken }, makeContext());

    expect(result.accessToken).toBeTruthy();
  });

  test('should log in user if there is existing user account with same email', async () => {
    const existingUserEmail = faker.internet.email();
    const user = makeUser({ account: { email: existingUserEmail } });
    await userRepository.save(user);

    const googleProfile = {
      aud: 'a',
      email: existingUserEmail,
      exp: 2,
      iat: 1,
      iss: 'a',
      name: faker.name.firstName(),
      sub: '111112',
    };

    getGoogleProfileMock.mockImplementation(async () => googleProfile);

    const result = await logInGoogle({ googleIdToken }, makeContext());

    expect(result.isSuccessful).toBeTruthy();
  });

  test('should succeed even if google user does not have email', async () => {
    const googleProfile = {
      aud: 'a',
      exp: 2,
      iat: 1,
      iss: 'a',
      name: faker.name.firstName(),
      sub: '11111321',
    };

    getGoogleProfileMock.mockImplementation(async () => googleProfile);

    const result = await logInGoogle({ googleIdToken }, makeContext());
    expect(result.isSuccessful).toBeTruthy();
  });

  test('should return user when not logged in but previously signed in with google', async () => {
    const googleProfile = {
      aud: 'a',
      email: faker.internet.email(),
      exp: 2,
      iat: 1,
      iss: 'a',
      name: faker.name.firstName(),
      sub: '111111',
    };

    getGoogleProfileMock.mockImplementation(async () => googleProfile);

    await logInGoogle({ googleIdToken }, makeContext());
    const result = await logInGoogle({ googleIdToken }, makeContext());
    expect(result.accessToken).toBeTruthy();
  });
});

describe('linkGoogleAccount', () => {
  test('should merge the current user with google profile if not logged in with google previously', async () => {
    const user = makeUser({ account: { email: 'chansss@hotmail.com' } });
    await userRepository.save(user);
    const googleProfile = {
      aud: 'a',
      email: 'chansss@hotmail.com',
      exp: 2,
      iat: 1,
      iss: 'a',
      name: faker.name.firstName(),
      sub: '117775765',
    };

    getGoogleProfileMock.mockImplementation(async () => googleProfile);

    const result = await linkGoogleAccount(
      {
        googleIdToken,
        userId: user.id,
      },
      makeContext({
        actor: {
          userId: user.id,
        },
      }),
    );
    expect(result.isSuccessful).toBeTruthy();
  });

  test('should throw error of someone else has logged in with the same google account', async () => {
    const googleProfile = {
      aud: 'a',
      email: 'anyemailss@hotmail.com',
      exp: 2,
      iat: 1,
      iss: 'a',
      name: faker.name.firstName(),
      sub: '111165',
    };

    getGoogleProfileMock.mockImplementation(async () => googleProfile);

    const firstLogInResult = await logInGoogle(
      { googleIdToken },
      makeContext(),
    );
    const verifiedToken = await verifyAccessToken(
      firstLogInResult.accessToken!,
    );

    const result = await linkGoogleAccount(
      {
        googleIdToken,
        userId: verifiedToken.tokenPayload!.userId,
      },
      makeContext({
        actor: {
          userId: verifiedToken.tokenPayload!.userId,
        },
      }),
    );

    expect(result.isSuccessful).toBeFalsy();
    expect(result.userError!.code).toBe(
      UserErrorCode.GOOGLE_ACCOUNT_ALREADY_USED,
    );
  });
});

describe('disconnectGoogle', () => {
  test('should remove google identity associated with user account', async () => {
    const googleProfile = {
      aud: 'a',
      email: 'asdfasdf2@gmail.com',
      exp: 2,
      iat: 1,
      iss: 'a',
      name: faker.name.firstName(),
      sub: '123123123',
    };

    getGoogleProfileMock.mockImplementation(async () => googleProfile);

    const { accessToken } = await logInGoogle({ googleIdToken }, makeContext());

    const payload = await verifyAccessToken(accessToken!);

    const result = await disconnectGoogle(
      {
        userId: payload.tokenPayload!.userId,
      },
      makeContext({
        actor: {
          userId: payload.tokenPayload!.userId,
        },
      }),
    );

    expect(result.isSuccessful).toBeTruthy();
  });

  test('should throw error of someone else has logged in with the same google account', async () => {
    const existingUserEmail = faker.internet.email();
    const user = makeUser({ account: { email: existingUserEmail } });

    await userRepository.save(user);

    const result = await disconnectGoogle(
      {
        userId: user.id,
      },
      makeContext({
        actor: {
          userId: user.id,
        },
      }),
    );
    expect(result.isSuccessful).toBeFalsy();
  });
});
