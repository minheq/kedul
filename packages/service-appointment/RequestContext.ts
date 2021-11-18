import { enhanceContext, RequestContext } from '@kedul/common-server';
import DataLoader from 'dataloader';

import {
  AppointmentRepository,
  makeAppointmentRepository,
} from './AppointmentRepository';
import { Appointment } from './AppointmentTypes';

export interface AppointmentServiceRepositories {
  appointmentRepository: AppointmentRepository;
}

export const makeAppointmentServiceRepositories = (
  context: RequestContext,
): AppointmentServiceRepositories => {
  return {
    appointmentRepository: makeAppointmentRepository(context),
  };
};

export interface AppointmentServiceDataLoaders {
  appointmentsLoader: DataLoader<string, Appointment | null>;
}

export const makeAppointmentServiceDataLoaders = (
  repositories: AppointmentServiceRepositories,
): AppointmentServiceDataLoaders => {
  const { appointmentRepository } = repositories;

  return {
    appointmentsLoader: new DataLoader(ids =>
      appointmentRepository.findManyByIds(ids),
    ),
  };
};

export interface AppointmentServiceRequestContext extends RequestContext {
  loaders: AppointmentServiceDataLoaders;
  repositories: AppointmentServiceRepositories;
}

export const enhance = (
  context: RequestContext | AppointmentServiceRequestContext,
): AppointmentServiceRequestContext => {
  const repositories = makeAppointmentServiceRepositories(context);
  const loaders = makeAppointmentServiceDataLoaders(repositories);

  return enhanceContext(context, repositories, loaders);
};
