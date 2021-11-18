import { RequestContext } from '@kedul/common-server';

import { enhance } from './RequestContext';

export interface AppointmentsFilter {
  startDate?: Date | null;
  endDate?: Date | null;
  locationId?: string | null;
  employeeId?: string | null;
  serviceId?: string | null;
  clientId?: string | null;
  appointmentRecurrenceId?: string | null;
}

export interface QueryFindAppointmentByIdArgs {
  id: string;
}

export interface QueryFindAppointmentsArgs {
  filter?: AppointmentsFilter | null;
}

export const findAppointmentById = async (
  input: QueryFindAppointmentByIdArgs,
  context: RequestContext,
) => {
  const { appointmentsLoader } = enhance(context).loaders;

  return appointmentsLoader.load(input.id);
};

export const findAppointmentRecurrenceById = async (
  input: QueryFindAppointmentByIdArgs,
  context: RequestContext,
) => {
  const { appointmentRepository } = enhance(context).repositories;

  return appointmentRepository.findAppointmentRecurrenceById(input.id);
};

export const findActiveAppointments = async (
  input: QueryFindAppointmentsArgs,
  context: RequestContext,
) => {
  const { appointmentRepository } = enhance(context).repositories;

  return appointmentRepository.findManyActive(input.filter);
};
