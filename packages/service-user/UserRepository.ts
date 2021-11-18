import {
  parseJsonColumn,
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';

import {
  AccountLoginDbObject,
  SocialIdentityDbObject,
  Table,
  UserAccountDbObject,
  UserDbObject,
} from './Database';
import { LoginType } from './UserConstants';
import { AccountLogin, SocialIdentity, User } from './UserTypes';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findManyByIds(ids: string[]): Promise<(User | null)[]>;
  findByEmail(email: string): Promise<User | null>;
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
  getById(id: string): Promise<User>;
  getByEmail(email: string): Promise<User>;
  getByPhoneNumber(phoneNumber: string): Promise<User>;
  findFacebookIdentity(facebookUserId: string): Promise<SocialIdentity | null>;
  findGoogleIdentity(googleUserId: string): Promise<SocialIdentity | null>;
  update(user: User): Promise<void>;
  remove(user: User): Promise<void>;
  save(user: User): Promise<void>;
  addLoginEntry(user: User, accountLogin: AccountLogin): Promise<void>;
  addSocialIdentity(user: User, socialIdentity: SocialIdentity): Promise<void>;
  removeSocialIdentity(socialIdentity: SocialIdentity): Promise<void>;
}

const toEntity = ({
  user,
  userAccount,
  logins,
  socialIdentities,
}: {
  user: UserDbObject;
  userAccount: UserAccountDbObject;
  logins: AccountLoginDbObject[];
  socialIdentities: SocialIdentityDbObject[];
}): User => {
  return {
    ...user,
    account: {
      ...userAccount,
      logins,
      socialIdentities,
    },
    profile: user.profile ? parseJsonColumn(user.profile) : null,
  };
};

const fromEntity = (
  user: User,
): {
  userDbObject: UserDbObject;
  userAccountDbObject: UserAccountDbObject;
  loginDbObjects: AccountLoginDbObject[];
  socialIdentityDbObjects: SocialIdentityDbObject[];
} => {
  return {
    loginDbObjects: user.account.logins.map(l => ({ ...l, userId: user.id })),
    socialIdentityDbObjects: user.account.socialIdentities.map(si => ({
      ...si,
      profileData: si.profileData ? JSON.stringify(si.profileData) : null,
    })),
    userAccountDbObject: {
      countryCode: user.account.countryCode || null,
      email: user.account.email || null,
      isEmailVerified: user.account.isEmailVerified,
      isPhoneVerified: user.account.isPhoneVerified,
      phoneNumber: user.account.phoneNumber || null,
      userId: user.id,
    },
    userDbObject: {
      createdAt: user.createdAt,
      id: user.id,
      isActive: user.isActive,
      profile: JSON.stringify(user.profile),
      updatedAt: user.updatedAt,
    },
  };
};

const getFullUser = (context: RequestContext) => async (user: UserDbObject) => {
  const { knex } = context.dependencies;

  const userAccount = (await knex
    .select()
    .where({ userId: user.id })
    .from(Table.USER_ACCOUNT)
    .first()) as UserAccountDbObject;

  const logins = (await knex
    .select()
    .where({ userId: user.id })
    .from(Table.ACCOUNT_LOGIN)) as AccountLoginDbObject[];

  const socialIdentities = (await knex
    .select()
    .where({ userId: user.id })
    .from(Table.SOCIAL_IDENTITY)) as SocialIdentityDbObject[];

  return toEntity({ user, userAccount, logins, socialIdentities });
};

const findById = (context: RequestContext) => async (id: string) => {
  const { knex } = context.dependencies;

  const user = (await knex
    .select()
    .where({ id })
    .from(Table.USER)
    .first()) as UserDbObject;

  if (!user) return null;

  return getFullUser(context)(user);
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const users = (await knex
    .select()
    .whereIn('id', ids)
    .from(Table.USER)) as UserDbObject[];

  const loadedUsers = await Promise.all(users.map(getFullUser(context)));

  return upholdDataLoaderConstraints(loadedUsers, ids);
};

const findByField = (context: RequestContext) => async (
  field: string,
  value: string,
) => {
  const { knex } = context.dependencies;

  const user = (await knex
    .select()
    .from(Table.USER)
    .leftJoin(
      Table.USER_ACCOUNT,
      `${Table.USER}.id`,
      `${Table.USER_ACCOUNT}.userId`,
    )
    .where(`${Table.USER_ACCOUNT}.${field}`, '=', value)
    .first()) as UserDbObject;

  if (!user) return null;

  return getFullUser(context)(user);
};

const findByEmail = (context: RequestContext) => async (email: string) =>
  findByField(context)('email', email);

const findByPhoneNumber = (context: RequestContext) => async (
  phoneNumber: string,
) => findByField(context)('phoneNumber', phoneNumber);

const getById = (context: RequestContext) => async (id: string) => {
  const user = await findById(context)(id);
  if (!user) throw new Error(`User does not exist id=${id}`);

  return user;
};

const getByEmail = (context: RequestContext) => async (email: string) => {
  const user = await findByEmail(context)(email);
  if (!user) throw new Error(`User does not exist email=${email}`);

  return user;
};

const getByPhoneNumber = (context: RequestContext) => async (
  phoneNumber: string,
) => {
  const user = await findByPhoneNumber(context)(phoneNumber);
  if (!user) throw new Error(`User does not exist phoneNumber=${phoneNumber}`);

  return user;
};

const findFacebookIdentity = (context: RequestContext) => async (
  facebookUserId: string,
) => {
  const { knex } = context.dependencies;

  return knex
    .select()
    .where({ providerUserId: facebookUserId, provider: LoginType.FACEBOOK })
    .from(Table.SOCIAL_IDENTITY)
    .first();
};

const findGoogleIdentity = (context: RequestContext) => async (
  googleUserId: string,
) => {
  const { knex } = context.dependencies;

  return knex
    .select()
    .where({ providerUserId: googleUserId, provider: LoginType.GOOGLE })
    .from(Table.SOCIAL_IDENTITY)
    .first();
};

const update = (context: RequestContext) => async (user: User) => {
  const { knex } = context.dependencies;

  const { userDbObject, userAccountDbObject } = fromEntity(user);

  await knex.transaction(trx => {
    return knex(Table.USER)
      .update(userDbObject)
      .where({ id: user.id })
      .transacting(trx)
      .then(() =>
        knex(Table.USER_ACCOUNT)
          .update(userAccountDbObject)
          .where({ userId: user.id })
          .transacting(trx),
      )
      .then(trx.commit)
      .catch(trx.rollback);
  });
};

const remove = (context: RequestContext) => async (user: User) => {
  const { knex } = context.dependencies;

  await knex(Table.USER)
    .del()
    .where({ id: user.id });

  await knex(Table.USER_ACCOUNT)
    .del()
    .where({ userId: user.id });

  await knex(Table.ACCOUNT_LOGIN)
    .del()
    .where({ userId: user.id });

  await knex(Table.SOCIAL_IDENTITY)
    .del()
    .where({ userId: user.id });
};

const save = (context: RequestContext) => async (user: User) => {
  const { knex } = context.dependencies;

  const { userDbObject, userAccountDbObject } = fromEntity(user);

  return knex.transaction(trx => {
    return knex
      .insert(userDbObject)
      .into(Table.USER)
      .transacting(trx)
      .then(() =>
        knex
          .insert(userAccountDbObject)
          .into(Table.USER_ACCOUNT)
          .transacting(trx),
      )
      .then(trx.commit)
      .catch(trx.rollback);
  });
};

const addLoginEntry = (context: RequestContext) => async (
  user: User,
  accountLogin: AccountLogin,
) => {
  const { knex } = context.dependencies;

  await knex
    .insert({ ...accountLogin, userId: user.id })
    .into(Table.ACCOUNT_LOGIN);
};

const addSocialIdentity = (context: RequestContext) => async (
  user: User,
  socialIdentity: SocialIdentity,
) => {
  const { knex } = context.dependencies;

  await knex
    .insert({ ...socialIdentity, userId: user.id })
    .into(Table.SOCIAL_IDENTITY);
};

const removeSocialIdentity = (context: RequestContext) => async (
  socialIdentity: SocialIdentity,
) => {
  const { knex } = context.dependencies;

  await knex(Table.SOCIAL_IDENTITY)
    .where({
      provider: socialIdentity.provider,
      providerUserId: socialIdentity.providerUserId,
      userId: socialIdentity.userId,
    })
    .del();
};

export const makeUserRepository = (
  context: RequestContext,
): UserRepository => ({
  addLoginEntry: addLoginEntry(context),
  addSocialIdentity: addSocialIdentity(context),
  findByEmail: findByEmail(context),
  findById: findById(context),
  findManyByIds: findManyByIds(context),
  findByPhoneNumber: findByPhoneNumber(context),
  findFacebookIdentity: findFacebookIdentity(context),
  findGoogleIdentity: findGoogleIdentity(context),
  getByEmail: getByEmail(context),
  getById: getById(context),
  getByPhoneNumber: getByPhoneNumber(context),
  remove: remove(context),
  removeSocialIdentity: removeSocialIdentity(context),
  save: save(context),
  update: update(context),
});
