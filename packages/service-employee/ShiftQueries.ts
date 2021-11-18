import { RequestContext } from '@kedul/common-server';

import { enhance } from './RequestContext';
import { Shift, ShiftsFilter } from './ShiftTypes';

export interface QueryEmployeeShiftsArgs {
  filter: ShiftsFilter;
  employeeId: string;
}

export const findEmployeeShifts = async (
  input: QueryEmployeeShiftsArgs,
  context: RequestContext,
): Promise<Shift[]> => {
  const { shiftRepository } = enhance(context).repositories;

  return shiftRepository.findMany(input.filter);
};

export interface QueryFindShiftByIdArgs {
  id: string;
}

export const findShiftById = async (
  input: QueryFindShiftByIdArgs,
  context: RequestContext,
): Promise<Shift | null> => {
  const { shiftsLoader } = enhance(context).loaders;

  return shiftsLoader.load(input.id);
};

export interface QueryFindShiftsArgs {
  filter: ShiftsFilter;
}

export const findShifts = async (
  input: QueryFindShiftsArgs,
  context: RequestContext,
): Promise<Shift[]> => {
  const { shiftRepository } = enhance(context).repositories;

  return await shiftRepository.findMany(input.filter);
};
