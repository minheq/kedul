import { enhanceContext, RequestContext } from '@kedul/common-server';
import DataLoader from 'dataloader';

import { EmailVerificationCode, PhoneVerificationCode } from './AuthTypes';
import {
  EmailVerificationCodeRepository,
  makeEmailVerificationCodeRepository,
} from './EmailVerificationCodeRepository';
import {
  makePhoneVerificationCodeRepository,
  PhoneVerificationCodeRepository,
} from './PhoneVerificationCodeRepository';
import { makeUserRepository, UserRepository } from './UserRepository';
import { User } from './UserTypes';

export interface UserServiceRepositories {
  emailVerificationCodeRepository: EmailVerificationCodeRepository;
  phoneVerificationCodeRepository: PhoneVerificationCodeRepository;
  userRepository: UserRepository;
}

export const makeUserServiceRepositories = (
  context: RequestContext,
): UserServiceRepositories => {
  return {
    userRepository: makeUserRepository(context),
    emailVerificationCodeRepository: makeEmailVerificationCodeRepository(
      context,
    ),
    phoneVerificationCodeRepository: makePhoneVerificationCodeRepository(
      context,
    ),
  };
};

export interface UserServiceDataLoaders {
  usersLoader: DataLoader<string, User | null>;
  phoneVerificationCodesLoader: DataLoader<
    string,
    PhoneVerificationCode | null
  >;
  emailVerificationCodesLoader: DataLoader<
    string,
    EmailVerificationCode | null
  >;
}

export const makeUserServiceDataLoaders = (
  repositories: UserServiceRepositories,
): UserServiceDataLoaders => {
  const {
    userRepository,
    emailVerificationCodeRepository,
    phoneVerificationCodeRepository,
  } = repositories;

  return {
    usersLoader: new DataLoader(ids => userRepository.findManyByIds(ids)),
    emailVerificationCodesLoader: new DataLoader(ids =>
      emailVerificationCodeRepository.findManyByIds(ids),
    ),
    phoneVerificationCodesLoader: new DataLoader(ids =>
      phoneVerificationCodeRepository.findManyByIds(ids),
    ),
  };
};

export interface UserServiceRequestContext extends RequestContext {
  loaders: UserServiceDataLoaders;
  repositories: UserServiceRepositories;
}

export const enhance = (
  context: RequestContext | UserServiceRequestContext,
): UserServiceRequestContext => {
  const repositories = makeUserServiceRepositories(context);
  const loaders = makeUserServiceDataLoaders(repositories);

  return enhanceContext(context, repositories, loaders);
};
