import { enhanceContext, RequestContext } from '@kedul/common-server';
import DataLoader from 'dataloader';

import {
  EmployeeRepository,
  makeEmployeeRepository,
} from './EmployeeRepository';
import {
  EmployeeRoleRepository,
  makeEmployeeRoleRepository,
} from './EmployeeRoleRepository';
import { EmployeeRole } from './EmployeeRoleTypes';
import { Employee } from './EmployeeTypes';
import { makeShiftRepository, ShiftRepository } from './ShiftRepository';
import { Shift } from './ShiftTypes';

export interface EmployeeServiceDataLoaders {
  employeesLoader: DataLoader<string, Employee | null>;
  employeeRoleLoader: DataLoader<string, EmployeeRole | null>;
  shiftsLoader: DataLoader<string, Shift | null>;
}

export const makeEmployeeServiceDataLoaders = (
  repositories: EmployeeServiceRepositories,
): EmployeeServiceDataLoaders => {
  const {
    employeeRepository,
    shiftRepository,
    employeeRoleRepository,
  } = repositories;

  return {
    employeesLoader: new DataLoader(ids =>
      employeeRepository.findManyByIds(ids),
    ),
    shiftsLoader: new DataLoader(ids => shiftRepository.findManyByIds(ids)),
    employeeRoleLoader: new DataLoader(ids =>
      employeeRoleRepository.findManyByIds(ids),
    ),
  };
};

export interface EmployeeServiceRepositories {
  shiftRepository: ShiftRepository;
  employeeRepository: EmployeeRepository;
  employeeRoleRepository: EmployeeRoleRepository;
}

export const makeEmployeeServiceRepositories = (context: RequestContext) => {
  const employeeRepository = makeEmployeeRepository(context);
  const shiftRepository = makeShiftRepository(context);

  return {
    shiftRepository,
    employeeRepository,
    employeeRoleRepository: makeEmployeeRoleRepository(context),
  };
};

export interface EmployeeServiceRequestContext extends RequestContext {
  loaders: EmployeeServiceDataLoaders;
  repositories: EmployeeServiceRepositories;
}

export const enhance = (
  context: RequestContext | EmployeeServiceRequestContext,
): EmployeeServiceRequestContext => {
  const repositories = makeEmployeeServiceRepositories(context);
  const loaders = makeEmployeeServiceDataLoaders(repositories);

  return enhanceContext(context, repositories, loaders);
};
