import {
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';

import { BusinessMember } from './BusinessMemberTypes';
import {
  BusinessMemberDbObject,
  BusinessMemberInvitationDbObject,
  Table,
} from './Database';

export interface BusinessMemberRepository {
  findById: (id: string) => Promise<BusinessMember | null>;
  getById: (id: string) => Promise<BusinessMember>;
  save: (entity: BusinessMember) => Promise<void>;
  update: (entity: BusinessMember) => Promise<void>;
  remove: (entity: BusinessMember) => Promise<void>;
  saveOrUpdate: (businessMember: BusinessMember) => Promise<void>;
  findByUserIdAndBusinessId: (
    userId: string,
    businessId: string,
  ) => Promise<BusinessMember | null>;
  findManyByUserId: (userId: string) => Promise<BusinessMember[]>;
  findManyByBusinessId: (businessId: string) => Promise<BusinessMember[]>;
  findManyByIds: (ids: string[]) => Promise<(BusinessMember | null)[]>;
  findByToken: (token: string) => Promise<BusinessMember | null>;
  getByToken: (token: string) => Promise<BusinessMember>;
}

const toEntity = (
  businessMember: BusinessMemberDbObject & BusinessMemberInvitationDbObject,
): BusinessMember => {
  return {
    ...businessMember,
    invitation:
      businessMember.token && businessMember.expirationDate
        ? {
            businessMemberId: businessMember.businessMemberId,
            expirationDate: businessMember.expirationDate,
            token: businessMember.token,
          }
        : null,
  };
};

const fromEntity = (context: RequestContext) => (
  businessMember: BusinessMember,
): {
  businessMemberDbObject: BusinessMemberDbObject;
  businessMemberInvitationDbObject: BusinessMemberInvitationDbObject | null;
} => {
  return {
    businessMemberDbObject: {
      businessId: businessMember.businessId,
      id: businessMember.id,
      updatedAt: businessMember.updatedAt,

      acceptedAt: businessMember.acceptedAt || null,
      businessMemberRoleId: businessMember.businessMemberRoleId,
      createdAt: new Date(),
      userId: businessMember.userId,
    },
    businessMemberInvitationDbObject: businessMember.invitation
      ? {
          businessMemberId: businessMember.id,
          token: businessMember.invitation.token || null,
          expirationDate: businessMember.invitation.expirationDate || null,
        }
      : null,
  };
};

const findById = (context: RequestContext) => async (id: string) => {
  const { knex } = context.dependencies;

  const businessMember = await knex
    .select()
    .where({ id })
    .from(Table.BUSINESS_MEMBER)
    .first();

  return businessMember ? toEntity(businessMember) : null;
};

const findByUserIdAndBusinessId = (context: RequestContext) => async (
  userId: string,
  businessId: string,
) => {
  const { knex } = context.dependencies;

  const businessMember = (await knex
    .select()
    .from(Table.BUSINESS_MEMBER)
    .leftJoin(
      Table.BUSINESS_MEMBER_INVITATION,
      `${Table.BUSINESS_MEMBER}.id`,
      `${Table.BUSINESS_MEMBER_INVITATION}.businessMemberId`,
    )
    .where({ userId, businessId })
    .first()) as BusinessMemberDbObject & BusinessMemberInvitationDbObject;

  return businessMember ? toEntity(businessMember) : null;
};

const findManyByUserId = (context: RequestContext) => async (
  userId: string,
) => {
  const { knex } = context.dependencies;

  const businessMembers = (await knex
    .select()
    .from(Table.BUSINESS_MEMBER)
    .leftJoin(
      Table.BUSINESS_MEMBER_INVITATION,
      `${Table.BUSINESS_MEMBER}.id`,
      `${Table.BUSINESS_MEMBER_INVITATION}.businessMemberId`,
    )
    .where({ userId })) as (BusinessMemberDbObject &
    BusinessMemberInvitationDbObject)[];

  return businessMembers.map(toEntity);
};

const findManyByBusinessId = (context: RequestContext) => async (
  businessId: string,
): Promise<BusinessMember[]> => {
  const { knex } = context.dependencies;

  const businessMembers = (await knex
    .select()
    .from(Table.BUSINESS_MEMBER)
    .where({ businessId })
    .leftJoin(
      Table.BUSINESS_MEMBER_INVITATION,
      `${Table.BUSINESS_MEMBER}.id`,
      `${Table.BUSINESS_MEMBER_INVITATION}.businessMemberId`,
    )
    .andWhere({ deletedAt: null })) as (BusinessMemberDbObject &
    BusinessMemberInvitationDbObject)[];

  return businessMembers.map(toEntity);
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const businessMembers = (await knex
    .select()
    .from(Table.BUSINESS_MEMBER)
    .leftJoin(
      Table.BUSINESS_MEMBER_INVITATION,
      `${Table.BUSINESS_MEMBER}.id`,
      `${Table.BUSINESS_MEMBER_INVITATION}.businessMemberId`,
    )
    .whereIn('id', ids)
    .andWhere({ deletedAt: null })) as (BusinessMemberDbObject &
    BusinessMemberInvitationDbObject)[];

  return upholdDataLoaderConstraints(businessMembers.map(toEntity), ids);
};

const getById = (context: RequestContext) => async (id: string) => {
  const businessMember = await findById(context)(id);
  if (!businessMember) {
    throw new Error(`${id} in ${Table.BUSINESS_MEMBER}`);
  }

  return businessMember;
};

const findByToken = (context: RequestContext) => async (token: string) => {
  const { knex } = context.dependencies;

  const businessMember = (await knex
    .select()
    .leftJoin(
      Table.BUSINESS_MEMBER_INVITATION,
      `${Table.BUSINESS_MEMBER}.id`,
      `${Table.BUSINESS_MEMBER_INVITATION}.businessMemberId`,
    )
    .from(Table.BUSINESS_MEMBER)
    .andWhere({ deletedAt: null })
    .andWhere({ token })
    .first()) as BusinessMemberDbObject & BusinessMemberInvitationDbObject;

  return toEntity(businessMember);
};

const getByToken = (context: RequestContext) => async (token: string) => {
  const businessMember = await findByToken(context)(token);
  if (!businessMember) {
    throw new Error(`${token} in ${Table.BUSINESS_MEMBER}`);
  }

  return businessMember;
};

const save = (context: RequestContext) => async (
  businessMember: BusinessMember,
) => {
  const {
    businessMemberDbObject,
    businessMemberInvitationDbObject,
  } = fromEntity(context)(businessMember);
  const { knex } = context.dependencies;

  await knex.insert(businessMemberDbObject).into(Table.BUSINESS_MEMBER);

  if (businessMemberInvitationDbObject) {
    await knex
      .insert(businessMemberInvitationDbObject)
      .into(Table.BUSINESS_MEMBER_INVITATION);
  }
};

const saveOrUpdate = (context: RequestContext) => async (
  businessMember: BusinessMember,
) => {
  const exists = await findById(context)(businessMember.id);

  if (!exists) {
    await save(context)(businessMember);
    return;
  }

  await update(context)(businessMember);
};

const update = (context: RequestContext) => async (
  businessMember: BusinessMember,
) => {
  const { knex } = context.dependencies;
  const {
    businessMemberDbObject,
    businessMemberInvitationDbObject,
  } = fromEntity(context)(businessMember);

  await knex(Table.BUSINESS_MEMBER)
    .update({
      ...businessMemberDbObject,
      updatedAt: new Date(),
    })
    .where({ id: businessMember.id });

  if (businessMemberInvitationDbObject) {
    await knex
      .update(businessMemberInvitationDbObject)
      .where({ id: businessMember.id });
  }
};

const remove = (context: RequestContext) => async (
  businessMember: BusinessMember,
) => {
  const { knex } = context.dependencies;

  await knex(Table.BUSINESS_MEMBER)
    .del()
    .where({ id: businessMember.id });

  await knex(Table.BUSINESS_MEMBER_INVITATION)
    .del()
    .where({ businessMemberId: businessMember.id });
};

export const makeBusinessMemberRepository = (
  context: RequestContext,
): BusinessMemberRepository => ({
  findById: findById(context),
  findManyByIds: findManyByIds(context),
  findManyByBusinessId: findManyByBusinessId(context),
  findByToken: findByToken(context),
  findByUserIdAndBusinessId: findByUserIdAndBusinessId(context),
  findManyByUserId: findManyByUserId(context),
  getById: getById(context),
  saveOrUpdate: saveOrUpdate(context),
  getByToken: getByToken(context),
  remove: remove(context),
  save: save(context),
  update: update(context),
});
