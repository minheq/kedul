import { publish, RequestContext } from '@kedul/common-server';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';

import { authErrors, AuthEvent } from './AuthConstants';
import { AuthResultPayload } from './AuthTypes';
import { getGoogleProfile } from './GoogleAPI';
import { enhance } from './RequestContext';
import { createAccessToken } from './TokenUtils';
import { LoginType } from './UserConstants';
import {
  authorizeOwner,
  checkOtherExistingLoginOptions,
  makeUser,
} from './UserMutations';
import { AccountLogin, SocialIdentity, User } from './UserTypes';

export interface GoogleProfile extends TokenPayload {}

const publishEvent = async (
  event: AuthEvent,
  user: User,
  context: RequestContext,
) => {
  publish(event, {
    aggregateId: user.id,
    aggregateType: 'any',
    data: user,
    context,
  });
};

const normalizeGoogleProfileToUserProfile = (googleProfile: GoogleProfile) => ({
  firstName: googleProfile.given_name || null,
  fullName: googleProfile.name,
  lastName: googleProfile.family_name || null,
});

export interface LogInGoogleInput {
  googleIdToken: string;
}

export const logInGoogle = async (
  input: LogInGoogleInput,
  context: RequestContext,
): Promise<AuthResultPayload> => {
  const { userRepository } = enhance(context).repositories;

  const googleProfile = await getGoogleProfile(input.googleIdToken);

  const existingSocialIdentity = await userRepository.findGoogleIdentity(
    String(googleProfile.sub),
  );

  if (existingSocialIdentity) {
    return logInExistingGoogleAccount(
      input.googleIdToken,
      googleProfile,
      existingSocialIdentity,
      context,
    );
  } else if (googleProfile.email) {
    const existingUser = await userRepository.findByEmail(googleProfile.email);
    if (existingUser) {
      return linkSocialIdentityToUser(
        existingUser,
        googleProfile,
        input.googleIdToken,
        context,
      );
    }
  }

  return createNewUserFromGoogleProfile(
    input.googleIdToken,
    googleProfile,
    context,
  );
};

const makeGoogleLogin = (
  googleProfile: GoogleProfile,
  token: string,
): AccountLogin => {
  return {
    claim: token,
    createdAt: new Date(),
    key: String(googleProfile.sub),
    name: LoginType.GOOGLE,
  };
};

const logInExistingGoogleAccount = async (
  token: string,
  googleProfile: GoogleProfile,
  socialIdentity: SocialIdentity,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;
  const user = await userRepository.getById(socialIdentity.userId);

  const socialLogin = makeGoogleLogin(googleProfile, token);
  await userRepository.addLoginEntry(user, socialLogin);

  const accessToken = createAccessToken(user);

  publishEvent(AuthEvent.USER_LOGGED_IN_VIA_GOOGLE, user, context);

  return { accessToken, isSuccessful: true, userError: null };
};

const makeGoogleIdentity = (
  user: User,
  googleProfile: GoogleProfile,
): SocialIdentity => {
  return {
    profileData: JSON.stringify(googleProfile),
    provider: LoginType.GOOGLE,
    providerUserId: String(googleProfile.sub),
    userId: user.id,
  };
};

const createNewUserFromGoogleProfile = async (
  token: string,
  googleProfile: GoogleProfile,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const user = makeUser({
    account: {
      email: googleProfile.email || null,
      isEmailVerified: !!googleProfile.email,
    },
    isActive: true,
    profile: normalizeGoogleProfileToUserProfile(googleProfile),
  });

  await userRepository.save(user);
  await userRepository.addLoginEntry(
    user,
    makeGoogleLogin(googleProfile, token),
  );
  await userRepository.addSocialIdentity(
    user,
    makeGoogleIdentity(user, googleProfile),
  );

  const accessToken = createAccessToken(user);

  return { accessToken, isSuccessful: true, userError: null };
};

const linkSocialIdentityToUser = async (
  user: User,
  googleProfile: GoogleProfile,
  token: string,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;
  const socialLogin = makeGoogleLogin(googleProfile, token);

  await userRepository.addSocialIdentity(
    user,
    makeGoogleIdentity(user, googleProfile),
  );
  await userRepository.addLoginEntry(user, socialLogin);

  const accessToken = createAccessToken(user);

  return { accessToken, isSuccessful: true, userError: null };
};

export interface LinkGoogleAccountInput {
  googleIdToken: string;
  userId: string;
}

export const linkGoogleAccount = async (
  input: LinkGoogleAccountInput,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const googleProfile = await getGoogleProfile(input.googleIdToken);
  const existingSocialIdentity = await userRepository.findGoogleIdentity(
    String(googleProfile.sub),
  );

  if (existingSocialIdentity) {
    const error = authErrors.googleAccountAlreadyUsed();
    return {
      isSuccessful: false,
      userError: error,
    };
  }

  const user = await userRepository.getById(input.userId);

  authorizeOwner(user, context);

  await linkSocialIdentityToUser(
    user,
    googleProfile,
    input.googleIdToken,
    context,
  );

  publishEvent(AuthEvent.USER_LOGGED_IN_VIA_GOOGLE, user, context);

  return { isSuccessful: true, userError: null };
};

export interface DisconnectGoogleInput {
  userId: string;
}

export const disconnectGoogle = async (
  input: DisconnectGoogleInput,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const hasOtherLoginOptions = await checkOtherExistingLoginOptions(
    input.userId,
    LoginType.GOOGLE,
    context,
  );

  if (!hasOtherLoginOptions) {
    const error = authErrors.mustHaveOtherLoginOptions();
    return {
      isSuccessful: false,
      userError: error,
    };
  }

  const user = await userRepository.getById(input.userId);
  authorizeOwner(user, context);

  const googleIdentity = user.account.socialIdentities.find(
    si => si.provider === LoginType.GOOGLE,
  );

  if (!googleIdentity) {
    const error = authErrors.googleIdentityDoesNotExist();
    return {
      isSuccessful: false,
      userError: error,
    };
  }

  await userRepository.removeSocialIdentity(googleIdentity);

  publishEvent(AuthEvent.USER_DISCONNECTED_FACEBOOK_ACCOUNT, user, context);

  return { isSuccessful: true, userError: null };
};
