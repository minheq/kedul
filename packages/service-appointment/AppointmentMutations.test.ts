import path from 'path';

import { SourceContext } from '@kedul/common-server';
import { makeContext, makeKnex } from '@kedul/common-test-utils';
import {
  CalendarEventRecurrenceFrequency,
  CalendarEventRecurrenceInput,
  makeRecurringCalendarEvent,
} from '@kedul/common-utils';
import { addDays, addHours, addMonths, addYears } from 'date-fns';
import faker from 'faker';

import {
  ApplyRecurrence,
  AppointmentServiceInput,
  cancelAppointmentByMember,
  CancelAppointmentInput,
  checkOutAppointment,
  createAppointmentByClient,
  updateAppointmentByClient,
  createAppointmentByMember,
  cancelAppointmentByClient,
  CreateAppointmentInput,
  markNoShowAppointment,
  updateAppointmentByMember,
  UpdateAppointmentInput,
} from './AppointmentMutations';
import {
  makeAppointmentRepository,
  appointmentQuery,
} from './AppointmentRepository';
import {
  Appointment,
  AppointmentRecurrence,
  AppointmentStatus,
} from './AppointmentTypes';
import { enhance } from './RequestContext';

jest.mock('@kedul/service-permission');

const knex = makeKnex();
const context = enhance(makeContext());
const appointmentRepository = makeAppointmentRepository(context);

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

const checkAppointmentRecurrence = async (
  recurrence: AppointmentRecurrence,
) => {
  const dates = makeRecurringCalendarEvent(recurrence.recurrence);
  const appointments = await appointmentRepository.findManyByAppointmentRecurrenceId(
    recurrence.id,
  );

  expect(appointments.length).toBe(dates.length);

  const servicesPerAppointmentCount = appointments[0].services.length;

  const appointmentServices = await appointmentQuery(knex).where({
    appointmentRecurrenceId: recurrence.id,
  });

  expect(appointmentServices.length).toBe(
    dates.length * servicesPerAppointmentCount,
  );
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
  test('should create monthly recurring appointment with single service happy path', async () => {
    const input = makeCreateInput({
      services: [
        makeAppointmentService({ startDate: new Date(2019, 1, 2, 12) }),
      ],

      recurrence: makeRecurrenceInput({
        frequency: CalendarEventRecurrenceFrequency.MONTHLY,
      }),
    });

    const result = await createAppointmentByMember(input, context);
    expect(result.appointment!.services.length).toBe(input.services.length);
    expect(result.appointment!.recurrence).toBeTruthy();

    await checkAppointmentRecurrence(result.appointment!.recurrence!);
  });

  test('should create monthly recurring appointment with multiple services happy path', async () => {
    const input = makeCreateInput({
      services: [
        makeAppointmentService({ startDate: new Date(2019, 1, 2, 12) }),
        makeAppointmentService({ startDate: new Date(2019, 1, 2, 13) }),
      ],

      recurrence: makeRecurrenceInput({
        frequency: CalendarEventRecurrenceFrequency.MONTHLY,
      }),
    });

    const result = await createAppointmentByMember(input, context);
    expect(result.appointment!.services.length).toBe(input.services.length);
    expect(result.appointment!.recurrence).toBeTruthy();

    await checkAppointmentRecurrence(result.appointment!.recurrence!);
  });

  test.todo('resolve 31 of the month');
  test.todo('ensure Los angeles timezone works as intended');
  test.todo('resolve midnight timing');
  test.todo('ensure amount of appointments created is correct');
});

// eslint-disable-next-line
describe('update', () => {
  test('should update only one appointment given applyRecurrence=ONLY_THIS_ONE despite RECURRENCE object in input', async () => {
    const {
      appointment: previousAppointment,
    } = await createAppointmentByMember(makeCreateInput(), context);

    const input: UpdateAppointmentInput = {
      applyRecurrence: ApplyRecurrence.ONLY_THIS_ONE,
      id: previousAppointment!.id,
      internalNotes: faker.random.words(),

      recurrence: makeRecurrenceInput({
        frequency: CalendarEventRecurrenceFrequency.WEEKLY,
      }),
    };
    const result = await updateAppointmentByMember(input, context);

    expect(result.appointment!.internalNotes).toBe(input.internalNotes);

    const recurringAppointments = await appointmentRepository.findManyByAppointmentRecurrenceId(
      previousAppointment!.recurrence!.id,
    );

    expect(recurringAppointments[2].internalNotes).not.toBe(
      input.internalNotes,
    );
  });

  test('changing status should apply only to one event despite ALL', async () => {
    const { appointment } = await createAppointmentByMember(
      makeCreateInput(),
      context,
    );

    const input: UpdateAppointmentInput = {
      id: appointment!.id,

      applyRecurrence: ApplyRecurrence.THIS_AND_FOLLOWING,
      status: AppointmentStatus.CONFIRMED,
    };

    const result = await updateAppointmentByMember(input, context);

    expect(result.appointment!.status).toBe(input.status);

    const recurringAppointments = await appointmentRepository.findManyByAppointmentRecurrenceId(
      appointment!.recurrence!.id,
    );

    expect(recurringAppointments[2].status).not.toBe(input.status);
  });

  test('should create recurring appointments when updating recurrence with no existing recurrence (MUST BE coupled with applyChanges=ALL)', async () => {
    const { appointment } = await createAppointmentByMember(
      makeCreateInput(),
      context,
    );

    const input: UpdateAppointmentInput = {
      id: appointment!.id,

      applyRecurrence: ApplyRecurrence.THIS_AND_FOLLOWING,
      internalNotes: faker.random.words(),

      recurrence: makeRecurrenceInput({
        frequency: CalendarEventRecurrenceFrequency.MONTHLY,
      }),
    };

    const result = await updateAppointmentByMember(input, context);
    expect(result.appointment!.internalNotes).toBe(input.internalNotes);

    await checkAppointmentRecurrence(result.appointment!.recurrence!);
  });

  test('changing START_DATE_HOUR and other data should retain references in appointments', async () => {
    const { appointment } = await createAppointmentByMember(
      makeCreateInput(),
      context,
    );

    const input: UpdateAppointmentInput = {
      id: appointment!.id,
      services: appointment!.services.map(s => ({
        ...s,
        clientId: faker.random.uuid(),
        startDate: addHours(s.startDate, 2),
      })),

      applyRecurrence: ApplyRecurrence.THIS_AND_FOLLOWING,
    };

    const previousAppointments = await appointmentRepository.findManyByAppointmentRecurrenceId(
      appointment!.recurrence!.id,
    );
    const result = await updateAppointmentByMember(input, context);

    const nextAppointments = await appointmentRepository.findManyByAppointmentRecurrenceId(
      appointment!.recurrence!.id,
    );

    expect(appointment!.reference).toBe(result.appointment!.reference);
    expect(input.services![0].startDate).toEqual(
      result.appointment!.services[0].startDate,
    );

    await checkAppointmentRecurrence(result.appointment!.recurrence!);

    expect(previousAppointments[0].reference).toBe(
      nextAppointments[0].reference,
    );

    expect(previousAppointments[0].services[0].startDate).not.toEqual(
      nextAppointments[0].services[0].startDate,
    );
    expect(nextAppointments[0].services[0].clientId).toBe(
      input.services![0].clientId,
    );

    expect(previousAppointments[1].reference).toBe(
      nextAppointments[1].reference,
    );
    expect(previousAppointments[1].services[0].startDate).not.toEqual(
      nextAppointments[1].services[0].startDate,
    );

    expect(nextAppointments[1].services[0].clientId).toBe(
      input.services![0].clientId,
    );
  });

  test('changing start date DAY should reset following appointments (new references)', async () => {
    const { appointment } = await createAppointmentByMember(
      makeCreateInput(),
      context,
    );

    const input: UpdateAppointmentInput = {
      id: appointment!.id,
      services: appointment!.services.map(s => ({
        ...s,
        clientId: faker.random.uuid(),
        startDate: addDays(s.startDate, 2),
      })),

      applyRecurrence: ApplyRecurrence.THIS_AND_FOLLOWING,
    };

    const previousAppointments = await appointmentRepository.findManyByAppointmentRecurrenceId(
      appointment!.recurrence!.id,
    );
    const result = await updateAppointmentByMember(input, context);
    expect(appointment!.reference).toBe(result.appointment!.reference);

    await checkAppointmentRecurrence(result.appointment!.recurrence!);

    const nextAppointments = await appointmentRepository.findManyByAppointmentRecurrenceId(
      appointment!.recurrence!.id,
    );

    expect(previousAppointments[1].reference).not.toBe(
      nextAppointments[1].reference,
    );
    expect(previousAppointments[2].reference).not.toBe(
      nextAppointments[2].reference,
    );
  });

  test('changing nth occurrence and updating frequency should detach all previous appointments', async () => {
    const { appointment } = await createAppointmentByMember(
      makeCreateInput({
        recurrence: makeRecurrenceInput({
          frequency: CalendarEventRecurrenceFrequency.WEEKLY,
          until: new Date(2020, 1, 4, 16),
        }),
      }),
      context,
    );

    const previousAppointments = await appointmentRepository.findManyByAppointmentRecurrenceId(
      appointment!.recurrence!.id,
    );

    const input = {
      applyRecurrence: ApplyRecurrence.THIS_AND_FOLLOWING,
      id: previousAppointments[2].id,
      recurrence: makeRecurrenceInput({
        frequency: CalendarEventRecurrenceFrequency.MONTHLY,
        until: new Date(2020, 1, 4, 16),
      }),
    };

    await updateAppointmentByMember(input, context);

    const nextAppointments = await appointmentRepository.findManyByAppointmentRecurrenceId(
      appointment!.recurrence!.id,
    );

    expect(previousAppointments.length > nextAppointments.length).toBeTruthy();

    const firstAppointment = await appointmentRepository.findById(
      previousAppointments[0].id,
    );
    expect(firstAppointment!.recurrence).toBeNull();

    const secondAppointment = await appointmentRepository.findById(
      previousAppointments[1].id,
    );
    expect(secondAppointment!.recurrence).toBeNull();

    const thirdAppointment = await appointmentRepository.findById(
      previousAppointments[2].id,
    );

    expect(thirdAppointment!.recurrence).not.toBeNull();
  });
});

describe('cancel', () => {
  test('should cancel single appointment happy path', async () => {
    const { appointment } = await createAppointmentByMember(
      makeCreateInput({
        recurrence: null,
        services: [
          makeAppointmentService({
            startDate: addYears(new Date(2019, 1, 2, 12), 1),
          }),
        ],
      }),
      context,
    );

    const input: CancelAppointmentInput = {
      applyRecurrence: ApplyRecurrence.ONLY_THIS_ONE,
      cancellationReason: 'Any reason',
      id: appointment!.id,
    };

    const result = await cancelAppointmentByMember(input, context);

    expect(result.appointment!.recurrence).toBeFalsy();
    expect(result.appointment!.canceledAt).toBeTruthy();
  });

  test('should cancel recurring appointment happy path', async () => {
    const { appointment } = await createAppointmentByMember(
      makeCreateInput({
        services: [
          makeAppointmentService({
            startDate: addYears(new Date(2019, 1, 2, 12), 1),
          }),
        ],
      }),
      context,
    );

    const input: CancelAppointmentInput = {
      applyRecurrence: ApplyRecurrence.THIS_AND_FOLLOWING,
      cancellationReason: 'Any reason',
      id: appointment!.id,
    };

    await cancelAppointmentByMember(input, context);

    const canceledAppointments = await appointmentRepository.findManyByAppointmentRecurrenceId(
      appointment!.recurrence!.id,
    );

    expect(canceledAppointments.every(apt => !!apt.canceledAt)).toBeTruthy();
  });
});

describe('checkOut', () => {
  test('should checkOut happy path', async () => {
    const { appointment } = await createAppointmentByMember(
      makeCreateInput(),
      context,
    );

    const input = {
      id: appointment!.id,
      invoiceId: faker.random.uuid(),
    };

    const result = await checkOutAppointment(input, context);
    expect(result.appointment!.recurrence).toBeFalsy();
    expect(result.appointment!.checkedOutAt).toBeTruthy();
  });
});

describe('markNoShow', () => {
  test('should mark no show happy path', async () => {
    const { appointment } = await createAppointmentByMember(
      makeCreateInput(),
      context,
    );

    const input = {
      id: appointment!.id,
    };

    const result = await markNoShowAppointment(input, context);
    expect(result.appointment!.recurrence).toBeFalsy();
    expect(result.appointment!.markedNoShowAt).toBeTruthy();
  });
});

describe('booking flow', () => {
  const clientId = faker.random.uuid();
  let appointment: Appointment;
  const clientContext = {
    ...makeContext(),
    source: SourceContext.BOOKING_SITE,
  };

  test('should book appointment happy path', async () => {
    const { services, locationId } = makeCreateInput({
      recurrence: null,
      services: [
        makeAppointmentService({ startDate: addMonths(new Date(), 5) }),
      ],
    });

    const result = await createAppointmentByClient(
      { locationId, services, clientId },
      clientContext,
    );

    expect(result.appointment!.services[0]).toMatchObject({
      ...services[0],
      clientId,
    });

    appointment = result.appointment!;
  });

  test('should update appointment happy path', async () => {
    const input = {
      id: appointment.id,

      clientNotes: faker.random.words(),
    };

    // @ts-ignore
    const result = await updateAppointmentByClient(input, clientContext);

    expect(result.appointment!.clientNotes).toBe(input.clientNotes);
  });

  test('should cancel appointment happy path', async () => {
    const input = {
      id: appointment.id,
    };

    // @ts-ignore
    const result = await cancelAppointmentByClient(input, clientContext);

    expect(result.appointment!.canceledAt).toBeTruthy();
  });
});
