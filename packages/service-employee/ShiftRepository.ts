import {
  parseJsonColumn,
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';
import Knex from 'knex';
import { chunk } from 'lodash';

import { ShiftDbObject, ShiftRecurrenceDbObject, Table } from './Database';
import { Shift, ShiftRecurrence, ShiftsFilter } from './ShiftTypes';

export interface ShiftRepository {
  findShiftRecurrenceById(
    recurrenceId: string,
  ): Promise<ShiftRecurrence | null>;
  findById(id: string): Promise<Shift | null>;
  findMany(filter?: ShiftsFilter): Promise<Shift[]>;
  findManyByIds(ids: string[]): Promise<(Shift | null)[]>;
  findManyByShiftRecurrenceId(shiftRecurrenceId: string): Promise<Shift[]>;
  getShiftRecurrenceById(id: string): Promise<ShiftRecurrence>;
  getById(id: string): Promise<Shift>;
  remove(shift: Shift): Promise<void>;
  save(shift: Shift): Promise<void>;
  saveShiftRecurrence(shiftRecurrence: ShiftRecurrence): Promise<void>;

  update(shift: Shift): Promise<void>;
  updateShiftRecurrence(shiftRecurrence: ShiftRecurrence): Promise<void>;

  saveMany(shifts: Shift[]): Promise<void>;
  updateMany(shifts: Shift[]): Promise<void>;
  removeMany(shifts: Shift[]): Promise<void>;
}

export interface ShiftDbQuery {
  shiftDbObject: ShiftDbObject;
  shiftRecurrenceDbObject: ShiftRecurrenceDbObject | null;
}

const SHIFT_ID_ALIAS = 'shiftId';
const SHIFT_START_DATE_ALIAS = 'shiftStartDate';
const SHIFT_CREATED_AT_ALIAS = 'shiftCreatedAt';
const SHIFT_UPDATED_AT_ALIAS = 'shiftUpdatedAt';
const SHIFT_RECURRENCE_ID_ALIAS = 'shiftRecurrenceId';
const SHIFT_RECURRENCE_CREATED_AT_ALIAS = 'shiftRecurrenceCreatedAt';
const SHIFT_RECURRENCE_UPDATED_AT_ALIAS = 'shiftRecurrenceUpdatedAt';
const SHIFT_RECURRENCE_RECURRENCE_ALIAS = 'shiftRecurrenceRecurrence';

const ALIASES = [
  `${Table.SHIFT}.id as ${SHIFT_ID_ALIAS}`,
  `${Table.SHIFT}.startDate as ${SHIFT_START_DATE_ALIAS}`,
  `${Table.SHIFT}.createdAt as ${SHIFT_CREATED_AT_ALIAS}`,
  `${Table.SHIFT}.updatedAt as ${SHIFT_UPDATED_AT_ALIAS}`,
  `${Table.SHIFT_RECURRENCE}.id as ${SHIFT_RECURRENCE_ID_ALIAS}`,
  `${Table.SHIFT_RECURRENCE}.createdAt as ${SHIFT_RECURRENCE_CREATED_AT_ALIAS}`,
  `${Table.SHIFT_RECURRENCE}.updatedAt as ${SHIFT_RECURRENCE_UPDATED_AT_ALIAS}`,
  `${
    Table.SHIFT_RECURRENCE
  }.recurrence as ${SHIFT_RECURRENCE_RECURRENCE_ALIAS}`,
];

type ShiftJoined = ShiftDbObject &
  ShiftRecurrenceDbObject & {
    shiftId: string;
    shiftRecurrenceRecurrence: string;
    shiftRecurrenceId: string;
    shiftRecurrenceCreatedAt: Date;
    shiftRecurrenceUpdatedAt: Date;
    shiftRecurrenceStartDate: Date;
    shiftCreatedAt: Date;
    shiftUpdatedAt: Date;
    shiftStartDate: Date;
  };

const extract = (shiftJoined: ShiftJoined): ShiftDbQuery => {
  return {
    shiftDbObject: {
      breakDuration: shiftJoined.breakDuration,
      businessId: shiftJoined.businessId,
      locationId: shiftJoined.locationId,
      canceledAt: shiftJoined.canceledAt,
      completedAt: shiftJoined.completedAt,
      endDate: shiftJoined.endDate,
      markedNoShowAt: shiftJoined.markedNoShowAt,
      notes: shiftJoined.notes,
      shiftRecurrenceId: shiftJoined.shiftRecurrenceId,
      employeeId: shiftJoined.employeeId,
      startedAt: shiftJoined.startedAt,
      status: shiftJoined.status,

      createdAt: shiftJoined.shiftCreatedAt,
      id: shiftJoined.shiftId,
      startDate: shiftJoined.shiftStartDate,
      updatedAt: shiftJoined.shiftUpdatedAt,
    },
    shiftRecurrenceDbObject: shiftJoined.shiftRecurrenceId
      ? {
          initialShiftId: shiftJoined.initialShiftId,
          recurrence: shiftJoined.shiftRecurrenceRecurrence,

          createdAt: shiftJoined.shiftRecurrenceCreatedAt,
          id: shiftJoined.shiftRecurrenceId,
          updatedAt: shiftJoined.shiftRecurrenceUpdatedAt,
        }
      : null,
  };
};

const toEntity = (shiftJoined: ShiftJoined): Shift => {
  const { shiftDbObject, shiftRecurrenceDbObject } = extract(shiftJoined);

  if (shiftRecurrenceDbObject) {
    return {
      ...shiftDbObject,
      startDate: new Date(shiftDbObject.startDate),
      endDate: new Date(shiftDbObject.endDate),
      recurrence: toShiftRecurrenceEntity(shiftRecurrenceDbObject),
    };
  }

  return {
    ...shiftDbObject,
    startDate: new Date(shiftDbObject.startDate),
    endDate: new Date(shiftDbObject.endDate),
    recurrence: null,
  };
};

const fromEntity = (context: RequestContext) => (
  shift: Shift,
): ShiftDbObject => {
  return {
    businessId: shift.businessId,
    locationId: shift.locationId,
    createdAt: shift.createdAt,
    endDate: shift.endDate,
    id: shift.id,
    employeeId: shift.employeeId,
    startDate: shift.startDate,
    status: shift.status,
    updatedAt: shift.updatedAt,

    breakDuration: shift.breakDuration || 0,
    canceledAt: shift.canceledAt || null,
    completedAt: shift.completedAt || null,
    markedNoShowAt: shift.markedNoShowAt || null,
    notes: shift.notes || null,
    shiftRecurrenceId: shift.recurrence ? shift.recurrence.id : null,
    startedAt: shift.startedAt || null,
  };
};

const toShiftRecurrenceEntity = (
  shiftRecurrence: ShiftRecurrenceDbObject,
): ShiftRecurrence => {
  const parsedRecurrence = parseJsonColumn(shiftRecurrence.recurrence);

  return {
    ...shiftRecurrence,
    recurrence: {
      ...parsedRecurrence,
      startDate: new Date(parsedRecurrence.startDate),
      until: parsedRecurrence.until ? new Date(parsedRecurrence.until) : null,
    },
  };
};

const fromShiftRecurrenceEntity = (context: RequestContext) => (
  shiftRecurrence: ShiftRecurrence,
): ShiftRecurrenceDbObject => {
  return {
    createdAt: shiftRecurrence.createdAt,
    id: shiftRecurrence.id,
    initialShiftId: shiftRecurrence.initialShiftId,
    recurrence: JSON.stringify(shiftRecurrence.recurrence),
    updatedAt: shiftRecurrence.updatedAt,
  };
};

const shiftQuery = (knex: Knex) => {
  return knex
    .from(Table.SHIFT)
    .leftJoin(
      Table.SHIFT_RECURRENCE,
      `${Table.SHIFT}.shiftRecurrenceId`,
      `${Table.SHIFT_RECURRENCE}.id`,
    )
    .select(['*', ...ALIASES]);
};

const findManyByShiftRecurrenceId = (context: RequestContext) => async (
  shiftRecurrenceId: string,
) => {
  const { knex } = context.dependencies;

  const shiftsJoined = (await shiftQuery(knex)
    .where(`${Table.SHIFT}.shiftRecurrenceId`, '=', shiftRecurrenceId)
    .andWhere({ canceledAt: null })) as ShiftJoined[];

  return shiftsJoined.map(toEntity);
};

const findById = (context: RequestContext) => async (id: string) => {
  const { knex } = context.dependencies;

  const shiftJoined = (await shiftQuery(knex)
    .where(`${Table.SHIFT}.id`, '=', id)
    .andWhere({ canceledAt: null })
    .first()) as ShiftJoined;

  return shiftJoined ? toEntity(shiftJoined) : null;
};

const findMany = (context: RequestContext) => async (
  filter: ShiftsFilter = {},
) => {
  const { knex } = context.dependencies;

  const shiftsJoined = (await shiftQuery(knex)
    .where({ canceledAt: null })
    .modify(builder => {
      if (filter) {
        const { startDate, endDate, ...restFilter } = filter;
        builder.andWhere(restFilter);

        if (startDate) {
          builder.andWhere(`${Table.SHIFT}.startDate`, '>=', startDate);
        }

        if (endDate) {
          builder.andWhere(`${Table.SHIFT}.startDate`, '<=', endDate);
        }
      }
    })
    .orderBy('startDate', 'asc')) as ShiftJoined[];

  return shiftsJoined.map(toEntity);
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const shiftsJoined = (await shiftQuery(knex).whereIn(
    `${Table.SHIFT}.id`,
    ids,
  )) as ShiftJoined[];

  return upholdDataLoaderConstraints(shiftsJoined.map(toEntity), ids);
};

const getById = (context: RequestContext) => async (id: string) => {
  const shift = await findById(context)(id);
  if (!shift) throw new Error(`${id} in ${Table.SHIFT}`);

  return shift;
};

const findShiftRecurrenceById = (context: RequestContext) => async (
  id: string,
) => {
  const { knex } = context.dependencies;

  const shiftRecurrence = (await knex
    .select()
    .where({ id })
    .from(Table.SHIFT_RECURRENCE)
    .first()) as ShiftRecurrenceDbObject;

  return shiftRecurrence ? toShiftRecurrenceEntity(shiftRecurrence) : null;
};

const getShiftRecurrenceById = (context: RequestContext) => async (
  id: string,
) => {
  const shiftRecurrence = await findShiftRecurrenceById(context)(id);
  if (!shiftRecurrence) {
    throw new Error(`${id} in ${Table.SHIFT_RECURRENCE}`);
  }

  return shiftRecurrence;
};

const save = (context: RequestContext) => async (shift: Shift) => {
  const { knex } = context.dependencies;

  await knex.insert(fromEntity(context)(shift)).into(Table.SHIFT);
};

const saveShiftRecurrence = (context: RequestContext) => async (
  shiftRecurrence: ShiftRecurrence,
) => {
  const { knex } = context.dependencies;

  await knex
    .insert(fromShiftRecurrenceEntity(context)(shiftRecurrence))
    .into(Table.SHIFT_RECURRENCE);
};

const updateShiftRecurrence = (context: RequestContext) => async (
  shiftRecurrence: ShiftRecurrence,
) => {
  const { knex } = context.dependencies;

  await knex(Table.SHIFT_RECURRENCE)
    .update({
      ...fromShiftRecurrenceEntity(context)(shiftRecurrence),
      updatedAt: new Date(),
    })
    .where({ id: shiftRecurrence.id });
};

const saveMany = (context: RequestContext) => async (shifts: Shift[]) => {
  const { knex } = context.dependencies;

  for (const shiftsChunk of chunk(shifts.map(fromEntity(context)), 10)) {
    await knex.batchInsert(Table.SHIFT, shiftsChunk);
  }
};

const updateMany = (context: RequestContext) => async (shifts: Shift[]) => {
  const { knex } = context.dependencies;

  for (const shift of shifts) {
    await knex(Table.SHIFT)
      .update(fromEntity(context)(shift))
      .where({ id: shift.id });
  }
};

const removeMany = (context: RequestContext) => async (shifts: Shift[]) => {
  const { knex } = context.dependencies;

  for (const shift of shifts) {
    await knex(Table.SHIFT)
      .del()
      .where({ id: shift.id });
  }
};

const update = (context: RequestContext) => async (shift: Shift) => {
  const { knex } = context.dependencies;

  const shiftDbObject = fromEntity(context)(shift);

  await knex(Table.SHIFT)
    .update(shiftDbObject)
    .where({ id: shift.id });
};

const remove = (context: RequestContext) => async (shift: Shift) => {
  const { knex } = context.dependencies;

  await knex(Table.SHIFT)
    .del()
    .where({ id: shift.id });
};

export const makeShiftRepository = (
  context: RequestContext,
): ShiftRepository => ({
  findById: findById(context),
  findMany: findMany(context),
  findManyByIds: findManyByIds(context),
  findManyByShiftRecurrenceId: findManyByShiftRecurrenceId(context),
  findShiftRecurrenceById: findShiftRecurrenceById(context),
  getById: getById(context),
  getShiftRecurrenceById: getShiftRecurrenceById(context),
  remove: remove(context),
  removeMany: removeMany(context),
  save: save(context),
  saveMany: saveMany(context),
  saveShiftRecurrence: saveShiftRecurrence(context),
  update: update(context),
  updateMany: updateMany(context),
  updateShiftRecurrence: updateShiftRecurrence(context),
});
