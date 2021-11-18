import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import {
  CalendarEventRecurrenceFrequency,
  CalendarEventRecurrenceInput,
} from '@kedul/common-utils';
import { addMonths } from 'date-fns';
import faker from 'faker';

import {
  AppointmentServiceInput,
  createAppointmentByMember,
  CreateAppointmentInput,
} from './AppointmentMutations';
import { findActiveAppointments } from './AppointmentQueries';

jest.mock('@kedul/service-permission');

const knex = makeKnex();

const makeAppointmentService = (
  input?: Partial<AppointmentServiceInput>,
): AppointmentServiceInput => ({
  clientId: faker.random.uuid(),
  clientNumber: 1,
  duration: 1,
  isEmployeeRequestedByClient: faker.random.boolean(),
  order: 1,
  serviceId: faker.random.uuid(),
  employeeId: faker.random.uuid(),
  startDate: new Date(2019, 1, 2, 12),
  ...input,
});

const makeCreateInput = (
  input?: Partial<CreateAppointmentInput>,
): CreateAppointmentInput => {
  return {
    recurrence: makeRecurrenceInput(),
    services: [makeAppointmentService()],

    locationId: faker.random.uuid(),
    internalNotes: faker.random.word(),
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

test('should filter by start Date', async () => {
  const input = makeCreateInput({
    recurrence: makeRecurrenceInput({
      frequency: CalendarEventRecurrenceFrequency.MONTHLY,
      until: new Date(2019, 6, 2, 15),
    }),
  });

  await createAppointmentByMember(input, makeContext());

  const allAppointments = await findActiveAppointments({}, makeContext());
  expect(allAppointments).toHaveLength(6);

  const appointments = await findActiveAppointments(
    {
      filter: { startDate: addMonths(input.services[0].startDate, 4) },
    },
    makeContext(),
  );

  expect(appointments).toHaveLength(2);
});
