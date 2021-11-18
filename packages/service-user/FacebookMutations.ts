import { publish, RequestContext } from '@kedul/common-server';

import { authErrors, AuthEvent } from './AuthConstants';
import { AuthResultPayload } from './AuthTypes';
import { getFacebookProfile } from './FacebookAPI';
import { enhance } from './RequestContext';
import { createAccessToken } from './TokenUtils';
import { LoginType } from './UserConstants';
import {
  authorizeOwner,
  checkOtherExistingLoginOptions,
  makeUser,
} from './UserMutations';
import { AccountLogin, PersonGender, SocialIdentity, User } from './UserTypes';

export interface FacebookProfile {
  email?: string;
  id: string;
  name: string;
  gender?: string;
  first_name?: string;
  last_name?: string;
}

const publishEvent = async (
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

export const normalizeFacebookProfileToUserProfile = (
  facebookProfile: FacebookProfile,
) => ({
  firstName: facebookProfile.first_name || null,
  fullName: facebookProfile.name,
  gender:
    facebookProfile.gender === 'male' ? PersonGender.MALE : PersonGender.FEMALE,
  lastName: facebookProfile.last_name || null,
  profileImage: null,
});

export interface LogInFacebookInput {
  facebookAccessToken: string;
}

export const logInFacebook = async (
  input: LogInFacebookInput,
  context: RequestContext,
): Promise<AuthResultPayload> => {
  const { userRepository } = enhance(context).repositories;

  const facebookProfile = await getFacebookProfile(input.facebookAccessToken);

  const existingSocialIdentity = await userRepository.findFacebookIdentity(
    facebookProfile.id,
  );

  if (existingSocialIdentity) {
    return logInExistingFacebookAccount(
      input.facebookAccessToken,
      facebookProfile,
      existingSocialIdentity,
      context,
    );
  } else if (facebookProfile.email) {
    const existingUser = await userRepository.findByEmail(
      facebookProfile.email,
    );
    if (existingUser) {
      return linkSocialIdentityToUser(
        existingUser,
        facebookProfile,
        input.facebookAccessToken,
        context,
      );
    }
  }

  return createNewUserFromFacebookProfile(
    input.facebookAccessToken,
    facebookProfile,
    context,
  );
};

const makeFacebookLogin = (
  facebookProfile: FacebookProfile,
  token: string,
): AccountLogin => {
  return {
    claim: token,
    createdAt: new Date(),
    key: facebookProfile.id,
    name: LoginType.FACEBOOK,
  };
};

const logInExistingFacebookAccount = async (
  token: string,
  facebookProfile: FacebookProfile,
  socialIdentity: SocialIdentity,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const user = await userRepository.getById(socialIdentity.userId);

  const socialLogin = makeFacebookLogin(facebookProfile, token);
  await userRepository.addLoginEntry(user, socialLogin);

  const accessToken = createAccessToken(user);

  publishEvent(AuthEvent.USER_LOGGED_IN_VIA_FACEBOOK, user, context);

  return { accessToken, isSuccessful: true, userError: null };
};

const makeFacebookIdentity = (
  user: User,
  facebookProfile: FacebookProfile,
): SocialIdentity => {
  return {
    profileData: JSON.stringify(facebookProfile),
    provider: LoginType.FACEBOOK,
    providerUserId: facebookProfile.id,
    userId: user.id,
  };
};

const createNewUserFromFacebookProfile = async (
  token: string,
  facebookProfile: FacebookProfile,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const user = makeUser({
    account: {
      email: facebookProfile.email || null,
      isEmailVerified: !!facebookProfile.email,
    },
    isActive: true,
    profile: normalizeFacebookProfileToUserProfile(facebookProfile),
  });

  await userRepository.save(user);
  await userRepository.addLoginEntry(
    user,
    makeFacebookLogin(facebookProfile, token),
  );
  await userRepository.addSocialIdentity(
    user,
    makeFacebookIdentity(user, facebookProfile),
  );

  const accessToken = createAccessToken(user);

  return { accessToken, isSuccessful: true, userError: null };
};

const linkSocialIdentityToUser = async (
  user: User,
  facebookProfile: FacebookProfile,
  token: string,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;
  const socialLogin = makeFacebookLogin(facebookProfile, token);

  await userRepository.addSocialIdentity(
    user,
    makeFacebookIdentity(user, facebookProfile),
  );
  await userRepository.addLoginEntry(user, socialLogin);

  const accessToken = createAccessToken(user);

  return { accessToken, isSuccessful: true, userError: null };
};

export interface LinkFacebookAccountInput {
  facebookAccessToken: string;
  userId: string;
}

export const linkFacebookAccount = async (
  input: LinkFacebookAccountInput,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const facebookProfile = await getFacebookProfile(input.facebookAccessToken);
  const existingSocialIdentity = await userRepository.findFacebookIdentity(
    facebookProfile.id,
  );

  if (existingSocialIdentity) {
    return {
      isSuccessful: false,
      userError: authErrors.facebookAccountAlreadyUsed(),
    };
  }

  const user = await userRepository.getById(input.userId);

  authorizeOwner(user, context);

  await linkSocialIdentityToUser(
    user,
    facebookProfile,
    input.facebookAccessToken,
    context,
  );

  publishEvent(AuthEvent.USER_LOGGED_IN_VIA_FACEBOOK, user, context);

  return { isSuccessful: true, userError: null };
};

export interface DisconnectFacebookInput {
  userId: string;
}

export const disconnectFacebook = async (
  input: DisconnectFacebookInput,
  context: RequestContext,
) => {
  const { userRepository } = enhance(context).repositories;

  const hasOtherLoginOptions = await checkOtherExistingLoginOptions(
    input.userId,
    LoginType.FACEBOOK,
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

  const facebookIdentity = user.account.socialIdentities.find(
    si => si.provider === LoginType.FACEBOOK,
  );

  if (!facebookIdentity) {
    const error = authErrors.facebookIdentityDoesNotExist();

    return {
      isSuccessful: false,
      userError: error,
    };
  }

  await userRepository.removeSocialIdentity(facebookIdentity);

  publishEvent(AuthEvent.USER_DISCONNECTED_FACEBOOK_ACCOUNT, user, context);

  return { isSuccessful: true, userError: null };
};
