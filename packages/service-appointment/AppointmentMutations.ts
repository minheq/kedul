import { publish, RequestContext } from '@kedul/common-server';
import {
  CalendarEventRecurrenceInput,
  makeRecurrence,
  makeRecurringCalendarEvent,
  randomString,
  segregateByOccurrence,
  segregateByStatus,
  UserError,
} from '@kedul/common-utils';
import {
  authorizeClient,
  authorizeMember,
  PolicyAction,
  PolicyEntity,
  PolicyResource,
} from '@kedul/service-permission';
import {
  getDayOfYear,
  getYear,
  isAfter,
  isBefore,
  setDayOfYear,
  setYear,
} from 'date-fns';
import uuidv4 from 'uuid/v4';

import { Event, userErrors } from './AppointmentConstants';
import {
  Appointment,
  AppointmentRecurrence,
  AppointmentStatus,
} from './AppointmentTypes';
import { enhance } from './RequestContext';
import { AppointmentRepository } from './AppointmentRepository';

export enum ApplyRecurrence {
  ONLY_THIS_ONE = 'ONLY_THIS_ONE',
  THIS_AND_FOLLOWING = 'THIS_AND_FOLLOWING',
  ALL = 'ALL',
}

export interface AppointmentServiceInput {
  clientNumber: number;
  duration: number;
  isEmployeeRequestedByClient: boolean;
  order: number;
  serviceId: string;
  startDate: Date;
  id?: string | null;
  employeeId?: string | null;
  clientId?: string | null;
}

const getSuccessPayload = async (appointment: Appointment) => ({
  appointment,
  isSuccessful: true,
  userError: null,
});

const getErrorPayload = async (userError: UserError) => ({
  appointment: null,
  isSuccessful: false,
  userError,
});

const publishEvent = (
  event: Event,
  appointment: Appointment,
  context: RequestContext,
) =>
  publish(event, {
    aggregateId: appointment.id,
    aggregateType: 'APPOINTMENT',
    data: appointment,
    context,
  });

const getResource = (appointment: Appointment): PolicyResource => ({
  entity: PolicyEntity.APPOINTMENT,
  entityId: appointment.id,
  locationId: appointment.locationId,
});

const makeReference = () => randomString(10);

const makeByMember = async (
  input: CreateAppointmentInput,
): Promise<Appointment> => {
  const appointmentId = input.id || uuidv4();

  // TODO: VALIDATE SERVICES
  // AppointmentService has valid serviceId, clientId, and employeeId
  // Create Appointment has valid locationId, businessId
  // Book Appointment has valid locationId, clientId, businessId

  return {
    ...input,
    createdAt: new Date(),
    id: appointmentId,
    recurrence: null,
    reference: makeReference(),
    services: input.services.map(s => ({
      ...s,
      appointmentId,
      id: s.id || uuidv4(),
    })),
    status: AppointmentStatus.NEW,
    updatedAt: new Date(),
  };
};

interface AppointmentWithAppointmentRecurrence extends Appointment {
  recurrence: AppointmentRecurrence;
}

const makeAppointments = async (
  appointment: Appointment,
  recurrence: AppointmentRecurrence,
): Promise<Appointment[]> => {
  const calendarEventList = makeRecurringCalendarEvent(recurrence.recurrence);

  return calendarEventList.map((calendarEvent, index) => {
    const appointmentId = index === 0 ? appointment.id : uuidv4();

    return {
      ...appointment,
      id: appointmentId,
      recurrence,
      reference: index === 0 ? appointment.reference : makeReference(),
      services: appointment.services.map(s => {
        const startDate = setDayOfYear(
          setYear(s.startDate, getYear(calendarEvent.startDate)),
          getDayOfYear(calendarEvent.startDate),
        );

        return {
          ...s,
          appointmentId,
          id: uuidv4(),
          startDate,
        };
      }),
    };
  });
};

const makeAppointmentRecurrence = async (
  appointment: Appointment,
  recurrence: CalendarEventRecurrenceInput,
): Promise<AppointmentRecurrence> => {
  const startDate = getEarliestStartDate(appointment);

  return {
    createdAt: new Date(),
    id: uuidv4(),
    initialAppointmentId: appointment.id,
    recurrence: makeRecurrence(startDate, recurrence),
    updatedAt: new Date(),
  };
};

const createAppointmentRecurrence = async (
  appointment: Appointment,
  recurrence: CalendarEventRecurrenceInput,
  appointmentRepository: AppointmentRepository,
): Promise<AppointmentRecurrence> => {
  const createdAppointmentRecurrence = await makeAppointmentRecurrence(
    appointment,
    recurrence,
  );
  await appointmentRepository.saveAppointmentRecurrence(
    createdAppointmentRecurrence,
  );

  const appointments = await makeAppointments(
    appointment,
    createdAppointmentRecurrence,
  );

  await appointmentRepository.saveMany(appointments);

  return createdAppointmentRecurrence;
};

const validateCreateByMember = async (input: CreateAppointmentInput) => {
  if (input.services.length === 0) {
    return userErrors.minimumAppointmentService();
  }

  return null;
};

export const createAppointmentByMember = async (
  input: CreateAppointmentInput,
  context: RequestContext,
) => {
  const { appointmentRepository } = enhance(context).repositories;

  const userError = await validateCreateByMember(input);
  if (userError) return getErrorPayload(userError);

  let appointment = await makeByMember(input);

  const action = PolicyAction.CREATE_APPOINTMENT;
  await authorizeMember(action, getResource(appointment), context);

  if (input.recurrence) {
    const recurrence = await createAppointmentRecurrence(
      appointment,
      input.recurrence,
      appointmentRepository,
    );

    appointment = {
      ...appointment,
      recurrence,
    };
  } else {
    await appointmentRepository.save(appointment);
  }

  publishEvent(Event.APPOINTMENT_CREATED_BY_MEMBER, appointment, context);

  return getSuccessPayload(appointment);
};

const makeByClient = async (
  input: CreateAppointmentInput,
): Promise<Appointment> => {
  const appointmentId = input.id || uuidv4();
  const clientId = input.clientId;

  return {
    ...input,
    clientId,
    createdAt: new Date(),
    id: appointmentId,
    recurrence: null,
    reference: makeReference(),
    services: input.services.map(s => ({
      ...s,
      appointmentId,
      clientId,
      id: s.id || uuidv4(),
    })),
    status: AppointmentStatus.NEW,
    updatedAt: new Date(),
  };
};

const validateCreateByClient = async (input: CreateAppointmentInput) => {
  if (input.services.length === 0) {
    return userErrors.minimumAppointmentService();
  }

  return null;
};

export const createAppointmentByClient = async (
  input: CreateAppointmentInput,
  context: RequestContext,
) => {
  const { appointmentRepository } = enhance(context).repositories;

  const userError = await validateCreateByClient(input);
  if (userError) return getErrorPayload(userError);

  const appointment = await makeByClient(input);

  await authorizeClient(appointment.clientId as string, context);

  await appointmentRepository.save(appointment);

  publishEvent(Event.APPOINTMENT_CREATED_BY_CLIENT, appointment, context);

  return getSuccessPayload(appointment);
};

export interface CreateAppointmentInput {
  id?: string | null;
  services: AppointmentServiceInput[];
  locationId: string;
  internalNotes?: string | null;
  recurrence?: CalendarEventRecurrenceInput | null;
  clientId?: string | null;
}

const isFrozen = (appointment: Appointment) => {
  return (
    appointment.canceledAt ||
    appointment.markedNoShowAt ||
    appointment.canceledAt
  );
};

const validateUpdate = async (
  appointment: Appointment,
  input: UpdateAppointmentInput,
) => {
  if (isFrozen(appointment)) return userErrors.appointmentFrozen();

  return null;
};

const updateChangeset = async (
  appointment: Appointment,
  input: UpdateAppointmentInput,
): Promise<Appointment> => {
  const { recurrence, applyRecurrence, ...fields } = input;

  return {
    ...appointment,
    ...fields,
    services: (input.services || appointment.services).map((s, index) => ({
      ...s,
      appointmentId: appointment.id,
      id: s.id || appointment.services[index].id || uuidv4(),
    })),
    status: input.status || appointment.status,
    updatedAt: new Date(),
  };
};

const makeWithStartDate = (appointments: Appointment[]) => {
  return appointments.map(a => ({ ...a, startDate: getEarliestStartDate(a) }));
};

const diffChangeset = (
  prevAppointment: Appointment,
  nextAppointment: Appointment,
): Appointment => {
  return {
    ...nextAppointment,
    id: prevAppointment.id,
    reference: prevAppointment.reference,
    services: nextAppointment.services.map(s => ({
      ...s,
      appointmentId: prevAppointment.id,
    })),
  };
};

const updateAppointments = async (
  appointment: AppointmentWithAppointmentRecurrence,
  recurrence: AppointmentRecurrence,
  applyRecurrence: ApplyRecurrence,
  appointmentRepository: AppointmentRepository,
) => {
  const previousAppointments = await appointmentRepository.findManyByAppointmentRecurrenceId(
    recurrence.id,
  );

  const [beforeAppointments, afterAppointments] = segregateByOccurrence(
    appointment,
    previousAppointments,
  );

  const nextAppointments = await makeAppointments(appointment, recurrence);

  const [updatedAppointments, createdAppointments, outdatedAppointments] =
    applyRecurrence === ApplyRecurrence.THIS_AND_FOLLOWING
      ? segregateByStatus(
          makeWithStartDate(afterAppointments),
          makeWithStartDate(nextAppointments),
          diffChangeset,
        )
      : segregateByStatus(
          makeWithStartDate(previousAppointments),
          makeWithStartDate(nextAppointments),
          diffChangeset,
        );

  await appointmentRepository.removeMany(outdatedAppointments);
  await appointmentRepository.updateMany(updatedAppointments);
  await appointmentRepository.updateMany(
    beforeAppointments.map(s => ({ ...s, recurrence: null })),
  );
  await appointmentRepository.saveMany(createdAppointments);
};

const updateRecurringAppointment = async (
  input: UpdateAppointmentInput,
  appointmentRepository: AppointmentRepository,
) => {
  const appointment = await appointmentRepository.getById(input.id);
  const updatedAppointment = (await updateChangeset(
    appointment,
    input,
  )) as AppointmentWithAppointmentRecurrence;

  if (!appointment.recurrence) {
    throw new Error(`Expected appointmentRecurrence in ${appointment.id}`);
  }

  let recurrence = await appointmentRepository.getAppointmentRecurrenceById(
    appointment.recurrence.id,
  );
  const earliestStartDate = getEarliestStartDate(updatedAppointment);

  recurrence = {
    ...recurrence,
    recurrence: {
      ...(input.recurrence || recurrence.recurrence),
      startDate: earliestStartDate,
    },
  };

  await appointmentRepository.updateAppointmentRecurrence(recurrence);

  await updateAppointments(
    updatedAppointment,
    recurrence,
    input.applyRecurrence,
    appointmentRepository,
  );

  return { ...updatedAppointment, recurrence };
};

// Any changes applied to a single appointment should detach it from appointmentRecurrences
const updateSingleAppointment = async (
  input: UpdateAppointmentInput,
  appointmentRepository: AppointmentRepository,
): Promise<Appointment> => {
  const appointment = await appointmentRepository.getById(input.id);
  let updatedAppointment = await updateChangeset(appointment, input);

  if (
    input.recurrence &&
    (input.applyRecurrence === ApplyRecurrence.ALL ||
      input.applyRecurrence === ApplyRecurrence.THIS_AND_FOLLOWING) &&
    !input.status
  ) {
    // REVIEW: If it should not remove due to data integrity
    await appointmentRepository.remove(updatedAppointment);
    const recurrence = await createAppointmentRecurrence(
      updatedAppointment,
      input.recurrence,
      appointmentRepository,
    );

    updatedAppointment = { ...updatedAppointment, recurrence };
  } else {
    updatedAppointment = {
      ...updatedAppointment,
      recurrence: null,
    };

    await appointmentRepository.update(updatedAppointment);
  }

  return updatedAppointment;
};

export const updateAppointmentByMember = async (
  input: UpdateAppointmentInput,
  context: RequestContext,
  event: Event = Event.APPOINTMENT_UPDATED_BY_MEMBER,
) => {
  const { appointmentRepository } = enhance(context).repositories;
  const prevAppointment = await appointmentRepository.getById(input.id);

  const userError = await validateUpdate(prevAppointment, input);
  if (userError) return getErrorPayload(userError);

  const action = PolicyAction.UPDATE_APPOINTMENT;
  await authorizeMember(action, getResource(prevAppointment), context);

  const shouldUpdateRecurringAppointment = !!(
    (input.applyRecurrence === ApplyRecurrence.ALL ||
      input.applyRecurrence === ApplyRecurrence.THIS_AND_FOLLOWING) &&
    // Updating status should apply to only single prevAppointment
    !input.status &&
    prevAppointment.recurrence
  );

  const nextAppointment = shouldUpdateRecurringAppointment
    ? await updateRecurringAppointment(input, appointmentRepository)
    : await updateSingleAppointment(input, appointmentRepository);

  publishEvent(event, nextAppointment, context);

  return getSuccessPayload(nextAppointment);
};

const validateUpdateByClient = async (
  prevAppointment: Appointment,
  input: UpdateAppointmentInput,
) => {
  const userError = await validateUpdate(prevAppointment, input);
  if (userError) return userError;

  return null;
};

export const updateAppointmentByClient = async (
  input: UpdateAppointmentInput,
  context: RequestContext,
) => {
  const { appointmentRepository } = enhance(context).repositories;
  const prevAppointment = await appointmentRepository.getById(input.id);

  const userError = await validateUpdateByClient(prevAppointment, input);
  if (userError) return getErrorPayload(userError);

  if (!prevAppointment.clientId) {
    throw new Error(`Expected input.clientId=${prevAppointment.clientId}`);
  }

  await authorizeClient(prevAppointment.clientId, context);

  const nextAppointment = await updateSingleAppointment(
    input,
    appointmentRepository,
  );

  if (input.canceledAt) {
    publishEvent(
      Event.APPOINTMENT_CANCELED_BY_CLIENT,
      nextAppointment,
      context,
    );
  } else {
    publishEvent(Event.APPOINTMENT_UPDATED_BY_CLIENT, nextAppointment, context);
  }

  return getSuccessPayload(nextAppointment);
};

export interface UpdateAppointmentInput {
  id: string;
  services?: AppointmentServiceInput[] | null;
  internalNotes?: string | null;
  clientId?: string | null;
  clientNotes?: string | null;
  status?: AppointmentStatus | null;
  canceledAt?: Date | null;
  cancellationReason?: string | null;
  recurrence?: CalendarEventRecurrenceInput | null;
  applyRecurrence: ApplyRecurrence;
}

const validateAppointmentCheckout = async (
  appointment: Appointment,
  input: CheckOutAppointmentInput,
) => {
  if (isFrozen(appointment)) return userErrors.appointmentFrozen();

  return null;
};

const checkOutAppointmentChangeset = async (
  appointment: Appointment,
  input: CheckOutAppointmentInput,
): Promise<Appointment> => {
  return {
    ...appointment,
    checkedOutAt: new Date(),
    invoiceId: input.invoiceId,
    recurrence: null,
  };
};

const getEarliestStartDate = (appointment: Appointment) => {
  if (!appointment.services[0]) {
    throw new Error('Appointment must contain at least one service');
  }

  let earliestStartDate = appointment.services[0].startDate;

  appointment.services.forEach(service => {
    if (isBefore(service.startDate, earliestStartDate)) {
      earliestStartDate = service.startDate;
    }
  });

  return earliestStartDate;
};

export interface CheckOutAppointmentInput {
  id: string;
  invoiceId: string;
}

export const checkOutAppointment = async (
  input: CheckOutAppointmentInput,
  context: RequestContext,
) => {
  const { appointmentRepository } = enhance(context).repositories;
  const prevAppointment = await appointmentRepository.getById(input.id);

  const userError = await validateAppointmentCheckout(prevAppointment, input);
  if (userError) return getErrorPayload(userError);

  const appointment = await checkOutAppointmentChangeset(
    prevAppointment,
    input,
  );

  const action = PolicyAction.UPDATE_APPOINTMENT;
  await authorizeMember(action, getResource(prevAppointment), context);

  await appointmentRepository.update(appointment);

  publishEvent(Event.APPOINTMENT_CHECKED_OUT, appointment, context);

  return getSuccessPayload(appointment);
};

const validateAppointmentMarkNoShow = async (
  appointment: Appointment,
  input: MarkNoShowAppointmentInput,
) => {
  if (isFrozen(appointment)) return userErrors.appointmentFrozen();

  const earliestStartDate = getEarliestStartDate(appointment);
  if (isAfter(earliestStartDate, new Date())) {
    return userErrors.noShowOnlyForPastAppointments();
  }

  return null;
};

const markNoShowAppointmentChangeset = async (
  appointment: Appointment,
  input: MarkNoShowAppointmentInput,
): Promise<Appointment> => {
  return {
    ...appointment,
    markedNoShowAt: new Date(),
    recurrence: null,
  };
};

export interface MarkNoShowAppointmentInput {
  id: string;
}

export const markNoShowAppointment = async (
  input: MarkNoShowAppointmentInput,
  context: RequestContext,
) => {
  const { appointmentRepository } = enhance(context).repositories;
  const prevAppointment = await appointmentRepository.getById(input.id);

  const userError = await validateAppointmentMarkNoShow(prevAppointment, input);
  if (userError) return getErrorPayload(userError);

  const appointment = await markNoShowAppointmentChangeset(
    prevAppointment,
    input,
  );

  const action = PolicyAction.UPDATE_APPOINTMENT;
  await authorizeMember(action, getResource(prevAppointment), context);

  await appointmentRepository.update(appointment);

  publishEvent(Event.APPOINTMENT_MARKED_NO_SHOW, appointment, context);

  return getSuccessPayload(appointment);
};

const validateCancellation = async (
  appointment: Appointment,
  input: CancelAppointmentInput,
) => {
  if (isFrozen(appointment)) return userErrors.appointmentFrozen();

  const earliestStartDate = getEarliestStartDate(appointment);

  if (isBefore(earliestStartDate, new Date())) {
    return userErrors.cancelOnlyForFutureAppointments();
  }

  return null;
};

export const cancelAppointmentByMember = async (
  input: CancelAppointmentInput,
  context: RequestContext,
) => {
  const { appointmentRepository } = enhance(context).repositories;

  const prevAppointment = await appointmentRepository.getById(input.id);

  const userError = await validateCancellation(prevAppointment, input);
  if (userError) return getErrorPayload(userError);

  const action = PolicyAction.UPDATE_APPOINTMENT;
  await authorizeMember(action, getResource(prevAppointment), context);

  return updateAppointmentByMember(
    { ...input, canceledAt: new Date() },
    context,
    Event.APPOINTMENT_CANCELED_BY_MEMBER,
  );
};

export const cancelAppointmentByClient = async (
  input: CancelAppointmentInput,
  context: RequestContext,
) => {
  const { appointmentRepository } = enhance(context).repositories;

  const prevAppointment = await appointmentRepository.getById(input.id);

  const userError = await validateCancellation(prevAppointment, input);
  if (userError) return getErrorPayload(userError);

  if (!prevAppointment.clientId) {
    throw new Error(`Expected input.clientId=${prevAppointment.clientId}`);
  }

  await authorizeClient(prevAppointment.clientId, context);

  const result = await updateAppointmentByMember(
    { ...input, canceledAt: new Date() },
    context,
    Event.APPOINTMENT_CANCELED_BY_CLIENT,
  );

  if (!result.appointment || result.userError) return result;

  return getSuccessPayload(result.appointment);
};

export interface CancelAppointmentInput {
  id: string;
  applyRecurrence: ApplyRecurrence;
  cancellationReason?: string | null;
}
