import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import {
  CalendarEventRecurrenceFrequency,
  CalendarEventRecurrenceInput,
} from '@kedul/common-utils';
import faker from 'faker';

import { createShift, CreateShiftInput } from './ShiftMutations';
import { findEmployeeShifts, findShiftById } from './ShiftQueries';

jest.mock('@kedul/service-permission');
const knex = makeKnex();

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

test('should filter by start date', async () => {
  const input = makeCreateInput({
    recurrence: makeRecurrenceInput({
      frequency: CalendarEventRecurrenceFrequency.MONTHLY,
      until: new Date(2019, 7, 2, 15),
    }),
  });

  await createShift(input, makeContext());

  const shifts = await findEmployeeShifts(
    {
      employeeId: input.employeeId,
      filter: {
        endDate: new Date(2019, 6, 29, 15),
        startDate: new Date(2019, 5, 29, 15),
      },
    },
    makeContext(),
  );
  expect(shifts).toHaveLength(1);
});

test('single shift', async () => {
  const result = await createShift(makeCreateInput(), makeContext());

  const shift = await findShiftById(
    {
      id: result.shift!.id,
    },
    makeContext(),
  );

  expect(shift).toBeTruthy();
});
