import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import {
  CalendarEventRecurrenceFrequency,
  CalendarEventRecurrenceInput,
  makeRecurringCalendarEvent,
} from '@kedul/common-utils';
import { addDays, addHours } from 'date-fns';
import faker from 'faker';

import { enhance } from './RequestContext';
import {
  ApplyRecurrence,
  cancelShift,
  CancelShiftInput,
  createShift,
  CreateShiftInput,
  updateShift,
  UpdateShiftInput,
} from './ShiftMutations';
import { ShiftRecurrence, ShiftStatus } from './ShiftTypes';

jest.mock('@kedul/service-permission');

const knex = makeKnex();

const serviceRequestContext = enhance(makeContext());
const shiftRepository = serviceRequestContext.repositories.shiftRepository;

const makeCreateInput = (
  input?: Partial<CreateShiftInput>,
): CreateShiftInput => {
  return {
    endDate: new Date(2019, 4, 5, 18),
    recurrence: makeRecurrenceInput(),
    employeeId: faker.random.uuid(),
    startDate: new Date(2019, 4, 5, 13),

    locationId: faker.random.uuid(),
    notes: faker.random.word(),
    ...input,
  };
};

const makeRecurrenceInput = (
  input?: Partial<CalendarEventRecurrenceInput>,
): CalendarEventRecurrenceInput => ({
  byHour: null,
  byMinute: null,
  byMonth: null,
  byMonthDay: null,
  bySecond: null,
  bySetPosition: null,
  byWeekDay: null,
  byWeekNumber: null,
  byYearDay: null,
  count: null,
  frequency: CalendarEventRecurrenceFrequency.MONTHLY,
  interval: null,
  timezoneId: null,
  until: null,
  weekStart: null,
  ...input,
});

const checkShiftRecurrence = async (recurrence: ShiftRecurrence) => {
  const dates = makeRecurringCalendarEvent(recurrence.recurrence);
  const shifts = await shiftRepository.findManyByShiftRecurrenceId(
    recurrence.id,
  );

  expect(shifts.length).toBe(dates.length);
  expect(shifts[0].startDate).toEqual(dates[0].startDate);
  expect(shifts[1].startDate).toEqual(dates[1].startDate);
};

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

describe('create', () => {
  test('should create monthly recurring shift with single service happy path', async () => {
    const input = makeCreateInput();

    const result = await createShift(input, makeContext());

    expect(result.shift!.recurrence).toBeTruthy();

    await checkShiftRecurrence(result.shift!.recurrence!);
  });

  test.todo('ensure amount of shifts created is correct');
});

// eslint-disable-next-line
describe('update', () => {
  test('should update only one shift given applyRecurrence=ONLY_THIS_ONE despite RECURRENCE object in input', async () => {
    const context = makeContext();
    const { shift: previousShift } = await createShift(
      makeCreateInput(),
      context,
    );

    const input: UpdateShiftInput = {
      applyRecurrence: ApplyRecurrence.ONLY_THIS_ONE,
      id: previousShift!.id,
      notes: faker.random.words(),

      recurrence: makeRecurrenceInput({
        frequency: CalendarEventRecurrenceFrequency.WEEKLY,
      }),
    };
    const result = await updateShift(input, context);

    expect(result.shift!.notes).toBe(input.notes);

    const recurringShifts = await shiftRepository.findManyByShiftRecurrenceId(
      previousShift!.recurrence!.id,
    );

    expect(recurringShifts[2].notes).not.toBe(input.notes);
  });

  test('changing status should apply only to one event despite ALL', async () => {
    const context = makeContext();
    const { shift } = await createShift(makeCreateInput(), context);

    const input: UpdateShiftInput = {
      id: shift!.id,

      applyRecurrence: ApplyRecurrence.THIS_AND_FOLLOWING,
      status: ShiftStatus.CONFIRMED,
    };

    const result = await updateShift(input, context);

    expect(result.shift!.status).toBe(input.status);

    const recurringShifts = await shiftRepository.findManyByShiftRecurrenceId(
      shift!.recurrence!.id,
    );

    expect(recurringShifts[2].status).not.toBe(input.status);
  });

  test('should create recurring shifts when updating recurrence with no existing recurrence (MUST BE coupled with applyChanges=ALL)', async () => {
    const context = makeContext();
    const { shift } = await createShift(
      makeCreateInput({ recurrence: null }),
      context,
    );

    const input: UpdateShiftInput = {
      id: shift!.id,

      applyRecurrence: ApplyRecurrence.THIS_AND_FOLLOWING,
      notes: faker.random.words(),

      recurrence: makeRecurrenceInput({
        frequency: CalendarEventRecurrenceFrequency.MONTHLY,
      }),
    };

    const result = await updateShift(input, context);

    expect(result.shift!.notes).toBe(input.notes);

    await checkShiftRecurrence(result.shift!.recurrence!);
  });

  test('changing startDate and other data should retain ids in shifts', async () => {
    const context = makeContext();
    const { shift } = await createShift(makeCreateInput(), context);

    const input: UpdateShiftInput = {
      id: shift!.id,

      applyRecurrence: ApplyRecurrence.ALL,
      notes: faker.random.words(),
      startDate: addHours(shift!.startDate, 2),
    };

    const previousShifts = await shiftRepository.findManyByShiftRecurrenceId(
      shift!.recurrence!.id,
    );
    const result = await updateShift(input, context);

    const nextShifts = await shiftRepository.findManyByShiftRecurrenceId(
      shift!.recurrence!.id,
    );

    expect(shift!.id).toBe(result.shift!.id);
    expect(input.startDate).toEqual(result.shift!.startDate);

    await checkShiftRecurrence(result.shift!.recurrence!);

    expect(previousShifts[0].id).toBe(nextShifts[0].id);

    expect(previousShifts[0].startDate).not.toBe(nextShifts[0].startDate);
    expect(nextShifts[0].notes).toBe(input.notes);

    expect(previousShifts[1].id).toBe(nextShifts[1].id);
    expect(previousShifts[1].startDate).not.toEqual(nextShifts[1].startDate);

    expect(nextShifts[1].notes).toBe(input.notes);
  });

  test('changing start date DAY should reset following shifts (new ids)', async () => {
    const context = makeContext();
    const { shift } = await createShift(makeCreateInput(), context);

    const input: UpdateShiftInput = {
      id: shift!.id,

      startDate: addDays(shift!.startDate, 2),

      applyRecurrence: ApplyRecurrence.THIS_AND_FOLLOWING,
    };

    const previousShifts = await shiftRepository.findManyByShiftRecurrenceId(
      shift!.recurrence!.id,
    );
    const result = await updateShift(input, context);
    expect(shift!.id).toBe(result.shift!.id);

    await checkShiftRecurrence(result.shift!.recurrence!);

    const nextShifts = await shiftRepository.findManyByShiftRecurrenceId(
      shift!.recurrence!.id,
    );

    expect(previousShifts[1].id).not.toBe(nextShifts[1].id);
    expect(previousShifts[2].id).not.toBe(nextShifts[2].id);
  });

  test('changing nth occurrence and updating frequency should detach all previous shifts', async () => {
    const context = makeContext();
    const { shift } = await createShift(
      makeCreateInput({
        recurrence: makeRecurrenceInput({
          frequency: CalendarEventRecurrenceFrequency.WEEKLY,
          until: new Date(2020, 1, 4, 16),
        }),
      }),
      context,
    );

    const previousShifts = await shiftRepository.findManyByShiftRecurrenceId(
      shift!.recurrence!.id,
    );

    const input = {
      applyRecurrence: ApplyRecurrence.THIS_AND_FOLLOWING,
      id: previousShifts[2].id,
      recurrence: makeRecurrenceInput({
        frequency: CalendarEventRecurrenceFrequency.MONTHLY,
        until: new Date(2020, 1, 4, 16),
      }),
    };

    await updateShift(input, context);

    const nextShifts = await shiftRepository.findManyByShiftRecurrenceId(
      shift!.recurrence!.id,
    );

    expect(previousShifts.length > nextShifts.length).toBeTruthy();

    const firstShift = await shiftRepository.findById(previousShifts[0].id);
    expect(firstShift!.recurrence).toBeNull();

    const secondShift = await shiftRepository.findById(previousShifts[1].id);
    expect(secondShift!.recurrence).toBeNull();

    const thirdShift = await shiftRepository.findById(previousShifts[2].id);

    expect(thirdShift!.recurrence).not.toBeNull();
  });
});

describe('cancel', () => {
  test('should cancel single shift happy path', async () => {
    const context = makeContext();
    const { shift } = await createShift(
      makeCreateInput({ recurrence: null }),
      context,
    );

    const input: CancelShiftInput = {
      applyRecurrence: ApplyRecurrence.ONLY_THIS_ONE,
      id: shift!.id,
    };

    const result = await cancelShift(input, context);

    expect(result.shift!.recurrence).toBeFalsy();
    expect(result.shift!.canceledAt).toBeTruthy();
  });

  test('should cancel recurring shift happy path', async () => {
    const context = makeContext();
    const { shift } = await createShift(makeCreateInput({}), context);

    const input: CancelShiftInput = {
      applyRecurrence: ApplyRecurrence.THIS_AND_FOLLOWING,
      id: shift!.id,
    };

    await cancelShift(input, context);

    const canceledShifts = await shiftRepository.findManyByShiftRecurrenceId(
      shift!.recurrence!.id,
    );

    expect(canceledShifts.every(apt => !!apt.canceledAt)).toBeTruthy();
  });
});
