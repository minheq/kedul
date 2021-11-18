import {
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';

import { EmailVerificationCode } from './AuthTypes';
import { EmailVerificationCodeDbObject, Table } from './Database';
import { User } from './UserTypes';

export interface EmailVerificationCodeRepository {
  findActiveByState(state: string): Promise<EmailVerificationCode | null>;
  findActiveByUserId(userId: string): Promise<EmailVerificationCode | null>;
  findLatest(): Promise<EmailVerificationCode>;
  findManyByIds(ids: string[]): Promise<(EmailVerificationCode | null)[]>;
  remove(code: EmailVerificationCode): Promise<void>;
  removeByUser(user: User): Promise<void>;
  save(code: EmailVerificationCode): Promise<void>;
}

const toEntity = (
  emailVerificationCode: EmailVerificationCodeDbObject,
): EmailVerificationCode => {
  return emailVerificationCode;
};

const fromEntity = (
  emailVerificationCode: EmailVerificationCode,
): EmailVerificationCodeDbObject => {
  return {
    code: emailVerificationCode.code,
    email: emailVerificationCode.email,
    expiredAt: emailVerificationCode.expiredAt,
    id: emailVerificationCode.id,
    state: emailVerificationCode.state,
    type: emailVerificationCode.type,
    userId: emailVerificationCode.userId,
  };
};

export const save = (context: RequestContext) => async (
  emailVerificationCode: EmailVerificationCode,
) => {
  const { knex } = context.dependencies;

  await knex
    .insert(fromEntity(emailVerificationCode))
    .into(Table.EMAIL_VERIFICATION_CODE);
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const emailVerificationCodes = (await knex
    .select()
    .where('id', ids)
    .where('expiredAt', '>', new Date())
    .from(Table.EMAIL_VERIFICATION_CODE)) as EmailVerificationCodeDbObject[];

  return upholdDataLoaderConstraints(emailVerificationCodes.map(toEntity), ids);
};

export const findActiveByUserId = (context: RequestContext) => async (
  userId: string,
): Promise<EmailVerificationCode | null> => {
  const { knex } = context.dependencies;

  const emailVerificationCode = await knex
    .select()
    .where({ userId })
    .where('expiredAt', '>', new Date())
    .from(Table.EMAIL_VERIFICATION_CODE)
    .first();

  return emailVerificationCode ? toEntity(emailVerificationCode) : null;
};

export const findActiveByState = (context: RequestContext) => async (
  state: string,
): Promise<EmailVerificationCode | null> => {
  const { knex } = context.dependencies;

  const emailVerificationCode = await knex
    .select()
    .where({ state })
    .where('expiredAt', '>', new Date())
    .from(Table.EMAIL_VERIFICATION_CODE)
    .first();

  return emailVerificationCode ? toEntity(emailVerificationCode) : null;
};

const remove = (context: RequestContext) => async (
  emailVerificationCode: EmailVerificationCode,
) => {
  const { knex } = context.dependencies;

  await knex(Table.EMAIL_VERIFICATION_CODE)
    .where({ id: emailVerificationCode.id })
    .del();
};

const findLatest = (context: RequestContext) => async () => {
  const { knex } = context.dependencies;

  const emailVerificationCode = await knex
    .select()
    .from(Table.EMAIL_VERIFICATION_CODE)
    .orderBy('expiredAt', 'desc')
    .first();

  return toEntity(emailVerificationCode);
};

const removeByUser = (context: RequestContext) => async (user: User) => {
  const { knex } = context.dependencies;

  await knex(Table.EMAIL_VERIFICATION_CODE)
    .where({ userId: user.id })
    .del();
};

export const makeEmailVerificationCodeRepository = (
  context: RequestContext,
): EmailVerificationCodeRepository => ({
  findManyByIds: findManyByIds(context),
  findActiveByState: findActiveByState(context),
  findActiveByUserId: findActiveByUserId(context),
  findLatest: findLatest(context),
  remove: remove(context),
  removeByUser: removeByUser(context),
  save: save(context),
});
