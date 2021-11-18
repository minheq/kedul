import {
  extractBusinessId,
  parseJsonColumn,
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';
import Knex from 'knex';
import { groupBy } from 'lodash';

import { AppointmentsFilter } from './AppointmentQueries';
import {
  Appointment,
  AppointmentRecurrence,
  AppointmentService,
} from './AppointmentTypes';
import {
  AppointmentDbObject,
  AppointmentRecurrenceDbObject,
  AppointmentServiceDbObject,
  Table,
} from './Database';

export interface AppointmentRepository {
  findAppointmentRecurrenceById(
    recurrenceId: string,
  ): Promise<AppointmentRecurrence | null>;
  findById(id: string): Promise<Appointment | null>;
  findManyActive(filter?: AppointmentsFilter | null): Promise<Appointment[]>;
  findManyByIds(ids: string[]): Promise<(Appointment | null)[]>;
  findManyByAppointmentRecurrenceId(
    appointmentRecurrenceId: string,
  ): Promise<Appointment[]>;
  getAppointmentRecurrenceById(id: string): Promise<AppointmentRecurrence>;
  getById(id: string): Promise<Appointment>;
  remove(appointment: Appointment): Promise<void>;
  save(appointment: Appointment): Promise<void>;
  saveAppointmentRecurrence(
    appointmentRecurrence: AppointmentRecurrence,
  ): Promise<void>;

  update(appointment: Appointment): Promise<void>;
  updateAppointmentRecurrence(
    appointmentRecurrence: AppointmentRecurrence,
  ): Promise<void>;

  saveMany(appointments: Appointment[]): Promise<void>;
  updateMany(appointments: Appointment[]): Promise<void>;
  removeMany(appointments: Appointment[]): Promise<void>;
}

const APPOINTMENT_ID_ALIAS = 'appointmentId';
const APPOINTMENT_SERVICE_ID_ALIAS = 'appointmentServiceId';
const APPOINTMENT_RECURRENCE_ID_ALIAS = 'appointmentRecurrenceId';
const APPOINTMENT_RECURRENCE_CREATED_AT_ALIAS =
  'appointmentRecurrenceCreatedAt';
const APPOINTMENT_RECURRENCE_UPDATED_AT_ALIAS =
  'appointmentRecurrenceUpdatedAt';
const APPOINTMENT_CREATED_AT_ALIAS = 'appointmentCreatedAt';
const APPOINTMENT_UPDATED_AT_ALIAS = 'appointmentUpdatedAt';

const ALIASES = [
  `${Table.APPOINTMENT_SERVICE}.id as ${APPOINTMENT_SERVICE_ID_ALIAS}`,
  `${Table.APPOINTMENT_RECURRENCE}.id as ${APPOINTMENT_RECURRENCE_ID_ALIAS}`,
  `${Table.APPOINTMENT}.id as ${APPOINTMENT_ID_ALIAS}`,
  `${Table.APPOINTMENT}.createdAt as ${APPOINTMENT_CREATED_AT_ALIAS}`,
  `${Table.APPOINTMENT}.updatedAt as ${APPOINTMENT_UPDATED_AT_ALIAS}`,
  `${
    Table.APPOINTMENT_RECURRENCE
  }.createdAt as ${APPOINTMENT_RECURRENCE_CREATED_AT_ALIAS}`,
  `${
    Table.APPOINTMENT_RECURRENCE
  }.updatedAt as ${APPOINTMENT_RECURRENCE_UPDATED_AT_ALIAS}`,
];

type AppointmentJoined = AppointmentDbObject &
  AppointmentRecurrenceDbObject &
  AppointmentServiceDbObject & {
    appointmentId: string;
    appointmentServiceId: string;
    appointmentRecurrenceId?: string;
    appointmentRecurrenceCreatedAt: Date;
    appointmentRecurrenceUpdatedAt: Date;
    appointmentCreatedAt: Date;
    appointmentUpdatedAt: Date;
  };

const extractAppointmentDbObject = (
  appointmentData: AppointmentJoined,
): AppointmentDbObject => {
  return {
    appointmentRecurrenceId: appointmentData.appointmentRecurrenceId,
    businessId: appointmentData.businessId,
    locationId: appointmentData.locationId,
    canceledAt: appointmentData.canceledAt,
    cancellationReason: appointmentData.cancellationReason,
    checkedOutAt: appointmentData.checkedOutAt,
    clientId: appointmentData.clientId,
    clientNotes: appointmentData.clientNotes,
    createdAt: appointmentData.appointmentCreatedAt,
    id: appointmentData.appointmentId,
    internalNotes: appointmentData.internalNotes,
    invoiceId: appointmentData.invoiceId,
    markedNoShowAt: appointmentData.markedNoShowAt,
    reference: appointmentData.reference,
    status: appointmentData.status,
    updatedAt: appointmentData.appointmentUpdatedAt,
  };
};

const extractAppointmentRecurrenceDbObject = (
  appointmentData: AppointmentJoined,
): AppointmentRecurrenceDbObject | null => {
  return appointmentData.appointmentRecurrenceId
    ? {
        createdAt: appointmentData.appointmentRecurrenceCreatedAt,
        id: appointmentData.appointmentRecurrenceId,
        initialAppointmentId: appointmentData.initialAppointmentId,
        recurrence: appointmentData.recurrence,
        updatedAt: appointmentData.appointmentRecurrenceUpdatedAt,
      }
    : null;
};

const extractAppointmentServiceDbObjects = (
  appointmentData: AppointmentJoined,
): AppointmentServiceDbObject => {
  return {
    appointmentId: appointmentData.appointmentId,
    businessId: appointmentData.businessId,
    clientId: appointmentData.clientId,
    clientNumber: appointmentData.clientNumber,
    duration: appointmentData.duration,
    id: appointmentData.appointmentServiceId,
    isEmployeeRequestedByClient: appointmentData.isEmployeeRequestedByClient,
    order: appointmentData.order,
    serviceId: appointmentData.serviceId,
    employeeId: appointmentData.employeeId,
    startDate: appointmentData.startDate,
  };
};

const separateJoinedAppointments = (
  appointmentsJoined: AppointmentJoined[],
): {
  appointmentDbObject: AppointmentDbObject;
  appointmentServiceDbObjects: AppointmentServiceDbObject[];
  appointmentRecurrenceDbObject: AppointmentRecurrenceDbObject | null;
} => {
  const appointmentData = appointmentsJoined[0];
  return {
    appointmentDbObject: extractAppointmentDbObject(appointmentData),
    appointmentRecurrenceDbObject: extractAppointmentRecurrenceDbObject(
      appointmentData,
    ),
    appointmentServiceDbObjects: appointmentsJoined.map(
      extractAppointmentServiceDbObjects,
    ),
  };
};

const toAppointmentService = (
  appointmentServiceDbObjects: AppointmentServiceDbObject[],
): AppointmentService[] => {
  return appointmentServiceDbObjects.map(service => ({
    ...service,
    startDate: new Date(service.startDate),
  }));
};

const toEntity = ({
  appointmentDbObject,
  appointmentServiceDbObjects,
  appointmentRecurrenceDbObject,
}: {
  appointmentDbObject: AppointmentDbObject;
  appointmentServiceDbObjects: AppointmentServiceDbObject[];
  appointmentRecurrenceDbObject: AppointmentRecurrenceDbObject | null;
}): Appointment => {
  return {
    ...appointmentDbObject,
    recurrence: appointmentRecurrenceDbObject
      ? toAppointmentRecurrenceEntity(appointmentRecurrenceDbObject)
      : null,
    services: toAppointmentService(appointmentServiceDbObjects),
  };
};

const fromAppointmentServiceEntity = (context: RequestContext) => (
  appointmentService: AppointmentService,
): AppointmentServiceDbObject => {
  const businessId = extractBusinessId(context);

  return {
    appointmentId: appointmentService.appointmentId,
    businessId,
    clientNumber: appointmentService.clientNumber,
    duration: appointmentService.duration,
    id: appointmentService.id,
    isEmployeeRequestedByClient: appointmentService.isEmployeeRequestedByClient,
    order: appointmentService.order,
    serviceId: appointmentService.serviceId,
    startDate: appointmentService.startDate,

    clientId: appointmentService.clientId || null,
    employeeId: appointmentService.employeeId || null,
  };
};

const fromEntity = (context: RequestContext) => (
  appointment: Appointment,
): {
  appointmentDbObject: AppointmentDbObject;
  appointmentServiceDbObjects: AppointmentServiceDbObject[];
} => {
  const businessId = extractBusinessId(context);

  return {
    appointmentDbObject: {
      businessId,
      locationId: appointment.locationId,
      createdAt: appointment.createdAt,
      id: appointment.id,

      appointmentRecurrenceId: appointment.recurrence
        ? appointment.recurrence.id
        : null,
      canceledAt: appointment.canceledAt || null,
      checkedOutAt: appointment.checkedOutAt || null,
      clientId: appointment.clientId || null,
      clientNotes: appointment.clientNotes || null,
      internalNotes: appointment.internalNotes || null,
      invoiceId: appointment.invoiceId || null,
      markedNoShowAt: appointment.markedNoShowAt || null,
      reference: appointment.reference || null,
      status: appointment.status,
      updatedAt: appointment.updatedAt,

      cancellationReason: appointment.cancellationReason || null,
    },
    appointmentServiceDbObjects: appointment.services.map(
      fromAppointmentServiceEntity(context),
    ),
  };
};

const toAppointmentRecurrenceEntity = (
  appointmentRecurrence: AppointmentRecurrenceDbObject,
): AppointmentRecurrence => {
  const parsedAppointment = parseJsonColumn(appointmentRecurrence.recurrence);

  return {
    ...appointmentRecurrence,
    recurrence: {
      ...parsedAppointment,
      startDate: new Date(parsedAppointment.startDate),
      until: parsedAppointment.until ? new Date(parsedAppointment.until) : null,
    },
  };
};

const fromAppointmentRecurrenceEntity = (context: RequestContext) => (
  appointmentRecurrence: AppointmentRecurrence,
): AppointmentRecurrenceDbObject => {
  return {
    createdAt: appointmentRecurrence.createdAt,
    id: appointmentRecurrence.id,
    initialAppointmentId: appointmentRecurrence.initialAppointmentId,
    recurrence: JSON.stringify(appointmentRecurrence.recurrence),
    updatedAt: appointmentRecurrence.updatedAt,
  };
};

const toAppointments = (appointmentsJoined: AppointmentJoined[]) => {
  const appointmentsMap = groupBy(appointmentsJoined, a => a.appointmentId);
  const appointments: Appointment[] = [];

  Object.keys(appointmentsMap).forEach(id => {
    const appointmentsJoinedPerAppointment = appointmentsMap[id];

    const appointment = toEntity(
      separateJoinedAppointments(appointmentsJoinedPerAppointment),
    );
    appointments.push(appointment);
  });

  return appointments;
};

export const appointmentQuery = (knex: Knex<any, any>) => {
  return knex
    .select(['*', ...ALIASES])
    .from(Table.APPOINTMENT)
    .leftJoin(
      Table.APPOINTMENT_SERVICE,
      `${Table.APPOINTMENT}.id`,
      `${Table.APPOINTMENT_SERVICE}.appointmentId`,
    )
    .leftJoin(
      Table.APPOINTMENT_RECURRENCE,
      `${Table.APPOINTMENT}.appointmentRecurrenceId`,
      `${Table.APPOINTMENT_RECURRENCE}.id`,
    );
};

const findManyByAppointmentRecurrenceId = (context: RequestContext) => async (
  appointmentRecurrenceId: string,
) => {
  const { knex } = context.dependencies;

  const appointmentsJoined = (await appointmentQuery(knex).where(
    `${Table.APPOINTMENT_RECURRENCE}.id`,
    '=',
    appointmentRecurrenceId,
  )) as AppointmentJoined[];

  return toAppointments(appointmentsJoined);
};

const findManyActive = (context: RequestContext) => async (
  filter?: AppointmentsFilter | null,
) => {
  const { knex } = context.dependencies;
  // const knex = Knex({})
  const appointmentsJoined = (await appointmentQuery(knex)
    .where({ canceledAt: null })
    .modify(builder => {
      if (filter) {
        const { startDate, endDate, ...restFilter } = filter;
        builder.andWhere(restFilter);

        if (startDate) {
          builder.andWhere(
            `${Table.APPOINTMENT_SERVICE}.startDate`,
            '>=',
            startDate,
          );
        }
        if (endDate) {
          builder.andWhere(
            `${Table.APPOINTMENT_SERVICE}.startDate`,
            '<=',
            endDate,
          );
        }
      }
    })) as AppointmentJoined[];

  return toAppointments(appointmentsJoined);
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const appointmentsJoined = (await appointmentQuery(knex)
    .whereIn(`${Table.APPOINTMENT}.id`, ids)
    .andWhere({ canceledAt: null })) as AppointmentJoined[];

  return upholdDataLoaderConstraints(toAppointments(appointmentsJoined), ids);
};

const findById = (context: RequestContext) => async (id: string) => {
  const { knex } = context.dependencies;

  const appointmentsJoined = (await appointmentQuery(knex).where(
    `${Table.APPOINTMENT}.id`,
    '=',
    id,
  )) as AppointmentJoined[];

  return toAppointments(appointmentsJoined)[0] || null;
};

const getById = (context: RequestContext) => async (id: string) => {
  const appointment = await findById(context)(id);
  if (!appointment) throw new Error(`${id} in ${Table.APPOINTMENT}`);

  return appointment;
};

const findAppointmentRecurrenceById = (context: RequestContext) => async (
  id: string,
) => {
  const { knex } = context.dependencies;

  const appointmentRecurrence = (await knex
    .select()
    .where({ id })
    .from(Table.APPOINTMENT_RECURRENCE)
    .first()) as AppointmentRecurrenceDbObject;

  return appointmentRecurrence
    ? toAppointmentRecurrenceEntity(appointmentRecurrence)
    : null;
};

const getAppointmentRecurrenceById = (context: RequestContext) => async (
  id: string,
) => {
  const appointmentRecurrence = await findAppointmentRecurrenceById(context)(
    id,
  );
  if (!appointmentRecurrence) {
    throw new Error(`${id} in ${Table.APPOINTMENT_RECURRENCE}`);
  }

  return appointmentRecurrence;
};

const save = (context: RequestContext) => async (appointment: Appointment) => {
  const { knex } = context.dependencies;

  const { appointmentDbObject, appointmentServiceDbObjects } = fromEntity(
    context,
  )(appointment);

  await knex.insert(appointmentDbObject).into(Table.APPOINTMENT);

  for (const appointmentServiceDbObject of appointmentServiceDbObjects) {
    await knex
      .insert(appointmentServiceDbObject)
      .into(Table.APPOINTMENT_SERVICE);
  }
};

const saveAppointmentRecurrence = (context: RequestContext) => async (
  appointmentRecurrence: AppointmentRecurrence,
) => {
  const { knex } = context.dependencies;

  await knex
    .insert(fromAppointmentRecurrenceEntity(context)(appointmentRecurrence))
    .into(Table.APPOINTMENT_RECURRENCE);
};

const updateAppointmentRecurrence = (context: RequestContext) => async (
  appointmentRecurrence: AppointmentRecurrence,
) => {
  const { knex } = context.dependencies;

  await knex(Table.APPOINTMENT_RECURRENCE)
    .update({
      ...fromAppointmentRecurrenceEntity(context)(appointmentRecurrence),
      updatedAt: new Date(),
    })
    .where({ id: appointmentRecurrence.id });
};

const saveMany = (context: RequestContext) => async (
  appointments: Appointment[],
) => {
  for (const appointment of appointments) {
    await save(context)(appointment);
  }
};

const updateMany = (context: RequestContext) => async (
  appointments: Appointment[],
) => {
  for (const appointment of appointments) {
    await update(context)(appointment);
  }
};

const removeMany = (context: RequestContext) => async (
  appointments: Appointment[],
) => {
  for (const appointment of appointments) {
    await remove(context)(appointment);
  }
};

const update = (context: RequestContext) => async (
  appointment: Appointment,
) => {
  const { knex } = context.dependencies;

  const { appointmentDbObject, appointmentServiceDbObjects } = fromEntity(
    context,
  )(appointment);

  await knex(Table.APPOINTMENT)
    .update(appointmentDbObject)
    .where({ id: appointment.id });

  await knex(Table.APPOINTMENT_SERVICE)
    .del()
    .where({ appointmentId: appointment.id });

  for (const appointmentServiceDbObject of appointmentServiceDbObjects) {
    await knex
      .insert({ ...appointmentServiceDbObject })
      .into(Table.APPOINTMENT_SERVICE);
  }
};

const remove = (context: RequestContext) => async (
  appointment: Appointment,
) => {
  const { knex } = context.dependencies;

  await knex(Table.APPOINTMENT)
    .del()
    .where({ id: appointment.id });

  await knex(Table.APPOINTMENT_SERVICE)
    .del()
    .where({ appointmentId: appointment.id });
};

export const makeAppointmentRepository = (
  context: RequestContext,
): AppointmentRepository => ({
  findAppointmentRecurrenceById: findAppointmentRecurrenceById(context),
  findById: findById(context),
  findManyByIds: findManyByIds(context),
  findManyActive: findManyActive(context),
  findManyByAppointmentRecurrenceId: findManyByAppointmentRecurrenceId(context),
  getAppointmentRecurrenceById: getAppointmentRecurrenceById(context),
  getById: getById(context),
  remove: remove(context),
  removeMany: removeMany(context),
  save: save(context),
  saveAppointmentRecurrence: saveAppointmentRecurrence(context),
  saveMany: saveMany(context),
  update: update(context),
  updateAppointmentRecurrence: updateAppointmentRecurrence(context),
  updateMany: updateMany(context),
});
