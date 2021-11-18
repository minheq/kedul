import {
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';

import { PhoneVerificationCode } from './AuthTypes';
import { PhoneVerificationCodeDbObject, Table } from './Database';
import { User } from './UserTypes';

export interface PhoneVerificationCodeRepository {
  findActiveByState(state: string): Promise<PhoneVerificationCode | null>;
  findActiveByUserId(userId: string): Promise<PhoneVerificationCode | null>;
  findLatest(): Promise<PhoneVerificationCode>;
  findManyByIds(ids: string[]): Promise<(PhoneVerificationCode | null)[]>;
  remove(code: PhoneVerificationCode): Promise<void>;
  removeByUser(user: User): Promise<void>;
  save(code: PhoneVerificationCode): Promise<void>;
}

const toEntity = (
  phoneNumberVerificationCode: PhoneVerificationCodeDbObject,
): PhoneVerificationCode => {
  return phoneNumberVerificationCode;
};

const fromEntity = (
  phoneNumberVerificationCode: PhoneVerificationCode,
): PhoneVerificationCodeDbObject => {
  return {
    code: phoneNumberVerificationCode.code,
    countryCode: phoneNumberVerificationCode.countryCode,
    expiredAt: phoneNumberVerificationCode.expiredAt,
    id: phoneNumberVerificationCode.id,
    phoneNumber: phoneNumberVerificationCode.phoneNumber,
    state: phoneNumberVerificationCode.state,
    type: phoneNumberVerificationCode.type,
    userId: phoneNumberVerificationCode.userId,
  };
};

const save = (context: RequestContext) => async (
  phoneNumberVerificationCode: PhoneVerificationCode,
) => {
  const { knex } = context.dependencies;

  await knex
    .insert(fromEntity(phoneNumberVerificationCode))
    .into(Table.PHONE_VERIFICATION_CODE);
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const phoneNumberVerificationCodes = (await knex
    .select()
    .where('id', ids)
    .where('expiredAt', '>', new Date())
    .from(Table.PHONE_VERIFICATION_CODE)) as PhoneVerificationCodeDbObject[];

  return upholdDataLoaderConstraints(
    phoneNumberVerificationCodes.map(toEntity),
    ids,
  );
};

const findActiveByUserId = (context: RequestContext) => async (
  userId: string,
) => {
  const { knex } = context.dependencies;

  const phoneNumberVerificationCode = await knex
    .select()
    .where({ userId })
    .where('expiredAt', '>', new Date())
    .from(Table.PHONE_VERIFICATION_CODE)
    .first();

  return phoneNumberVerificationCode
    ? toEntity(phoneNumberVerificationCode)
    : null;
};

const findActiveByState = (context: RequestContext) => async (
  state: string,
) => {
  const { knex } = context.dependencies;

  const phoneNumberVerificationCode = await knex
    .select()
    .where({ state })
    .where('expiredAt', '>', new Date())
    .from(Table.PHONE_VERIFICATION_CODE)
    .first();

  return phoneNumberVerificationCode
    ? toEntity(phoneNumberVerificationCode)
    : null;
};

const remove = (context: RequestContext) => async (
  phoneVerificationCode: PhoneVerificationCode,
) => {
  const { knex } = context.dependencies;

  await knex(Table.PHONE_VERIFICATION_CODE)
    .where({ id: phoneVerificationCode.id })
    .del();
};

const findLatest = (context: RequestContext) => async () => {
  const { knex } = context.dependencies;

  const phoneNumberVerificationCode = await knex
    .select()
    .from(Table.PHONE_VERIFICATION_CODE)
    .orderBy('expiredAt', 'desc')
    .first();

  return toEntity(phoneNumberVerificationCode);
};

const removeByUser = (context: RequestContext) => async (user: User) => {
  const { knex } = context.dependencies;

  await knex(Table.PHONE_VERIFICATION_CODE)
    .where({ userId: user.id })
    .del();
};

export const makePhoneVerificationCodeRepository = (
  context: RequestContext,
): PhoneVerificationCodeRepository => ({
  findActiveByState: findActiveByState(context),
  findManyByIds: findManyByIds(context),
  findActiveByUserId: findActiveByUserId(context),
  findLatest: findLatest(context),
  remove: remove(context),
  removeByUser: removeByUser(context),
  save: save(context),
});
