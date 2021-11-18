import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import faker from 'faker';

import { UserErrorCode } from './AuthConstants';
import * as FacebookAPI from './FacebookAPI';
import {
  disconnectFacebook,
  linkFacebookAccount,
  logInFacebook,
} from './FacebookMutations';
import { enhance } from './RequestContext';
import { verifyAccessToken } from './TokenUtils';
import { makeUser } from './UserMutations';

jest.mock('axios');
jest.mock('./FacebookAPI');

const knex = makeKnex();
// anything as we mock
const facebookAccessToken = 'asdfxcvzz';
const userServiceRequestContext = enhance(makeContext());
const getFacebookProfileMock = jest.spyOn(FacebookAPI, 'getFacebookProfile');
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

describe('logInFacebook', () => {
  test('should create new user when not logged in and signing up with Facebook for the first time', async () => {
    const facebookProfile = {
      email: 'asdfasdf@gmail.com',
      id: '123123123',
      name: faker.name.firstName(),
    };

    getFacebookProfileMock.mockImplementation(async () => facebookProfile);

    const result = await logInFacebook({ facebookAccessToken }, makeContext());

    expect(result.accessToken).toBeTruthy();
  });

  test('should log in user if there is existing user account with same email', async () => {
    const existingUserEmail = faker.internet.email();
    const user = makeUser({ account: { email: existingUserEmail } });
    await userRepository.save(user);

    const facebookProfile = {
      email: existingUserEmail,
      id: '111112',
      name: faker.name.firstName(),
    };

    getFacebookProfileMock.mockImplementation(async () => facebookProfile);

    const result = await logInFacebook({ facebookAccessToken }, makeContext());

    expect(result.isSuccessful).toBeTruthy();
  });

  test('should succeed even if facebook user does not have email', async () => {
    const facebookProfile = {
      id: '11111321',
      name: faker.name.firstName(),
    };

    getFacebookProfileMock.mockImplementation(async () => facebookProfile);

    const result = await logInFacebook({ facebookAccessToken }, makeContext());
    expect(result.isSuccessful).toBeTruthy();
  });

  test('should return user when not logged in but previously signed in with facebook', async () => {
    const facebookProfile = {
      email: faker.internet.email(),
      id: '111111',
      name: faker.name.firstName(),
    };

    getFacebookProfileMock.mockImplementation(async () => facebookProfile);

    await logInFacebook({ facebookAccessToken }, makeContext());

    const result = await logInFacebook({ facebookAccessToken }, makeContext());

    expect(result.accessToken).toBeTruthy();
  });
});

describe('linkFacebookAccount', () => {
  test('should merge the current user with facebook profile if not logged in with facebook previously', async () => {
    const user = makeUser({ account: { email: 'chansss@hotmail.com' } });
    await userRepository.save(user);
    const facebookProfile = {
      email: 'chansss@hotmail.com',
      id: '117775765',
      name: faker.name.firstName(),
    };

    getFacebookProfileMock.mockImplementation(async () => facebookProfile);

    const result = await linkFacebookAccount(
      {
        facebookAccessToken,
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

  test('should throw error of someone else has logged in with the same facebook account', async () => {
    const facebookProfile = {
      email: 'anyemailss@hotmail.com',
      id: '111165',
      name: faker.name.firstName(),
    };

    getFacebookProfileMock.mockImplementation(async () => facebookProfile);

    const firstLogInResult = await logInFacebook(
      { facebookAccessToken },
      makeContext(),
    );
    const verifiedToken = await verifyAccessToken(
      firstLogInResult.accessToken!,
    );

    const result = await linkFacebookAccount(
      {
        facebookAccessToken,
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
      UserErrorCode.FACEBOOK_ACCOUNT_ALREADY_USED,
    );
  });
});

describe('disconnectFacebook', () => {
  test('should remove facebook identity associated with user account', async () => {
    const facebookProfile = {
      email: 'asdfasdf2@gmail.com',
      id: '123123123',
      name: faker.name.firstName(),
    };

    getFacebookProfileMock.mockImplementation(async () => facebookProfile);

    const { accessToken } = await logInFacebook(
      { facebookAccessToken },
      makeContext(),
    );

    const payload = await verifyAccessToken(accessToken!);

    const result = await disconnectFacebook(
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

  test('should throw error if someone else has logged in with the same facebook account', async () => {
    const existingUserEmail = faker.internet.email();
    const user = makeUser({ account: { email: existingUserEmail } });

    await userRepository.save(user);

    const result = await disconnectFacebook(
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
