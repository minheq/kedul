import {
  extractBusinessId,
  publish,
  RequestContext,
} from '@kedul/common-server';
import {
  CalendarEventRecurrenceInput,
  makeRecurrence,
  makeRecurringCalendarEvent,
  segregateByOccurrence,
  segregateByStatus,
  UserError,
} from '@kedul/common-utils';
import {
  authorizeMember,
  PolicyAction,
  PolicyEntity,
  PolicyResource,
} from '@kedul/service-permission';
import {
  getDayOfYear,
  getYear,
  setDayOfYear,
  setYear,
  differenceInMinutes,
  addMinutes,
} from 'date-fns';
import uuidv4 from 'uuid/v4';

import { enhance } from './RequestContext';
import { Event, userErrors } from './ShiftConstants';
import { Shift, ShiftRecurrence, ShiftStatus } from './ShiftTypes';
import { ShiftRepository } from './ShiftRepository';

const makeSuccessPayload = async (shift: Shift) => ({
  isSuccessful: true,
  shift,
  userError: null,
});

const makeErrorPayload = async (userError: UserError) => ({
  isSuccessful: false,
  shift: null,
  userError,
});

const publishEvent = (event: Event, shift: Shift, context: RequestContext) =>
  publish(event, {
    aggregateId: shift.id,
    aggregateType: 'SHIFT',
    data: shift,
    context,
  });

const getResource = (shift: Shift): PolicyResource => ({
  entity: PolicyEntity.SHIFT,
  entityId: shift.id,
  locationId: shift.locationId,
});

const make = async (
  input: CreateShiftInput,
  context: RequestContext,
): Promise<Shift> => {
  const shiftId = input.id || uuidv4();
  const businessId = extractBusinessId(context);

  return {
    ...input,
    businessId,
    breakDuration: input.breakDuration || 0,
    createdAt: new Date(),
    id: shiftId,
    recurrence: null,
    status: input.status || ShiftStatus.DRAFT,
    updatedAt: new Date(),
  };
};

interface ShiftWithShiftRecurrence extends Shift {
  recurrence: ShiftRecurrence;
}

const makeShifts = async (
  shift: Shift,
  recurrence: ShiftRecurrence,
): Promise<Shift[]> => {
  const calendarEventBaseList = makeRecurringCalendarEvent(
    recurrence.recurrence,
  );

  const diff = differenceInMinutes(shift.endDate, shift.startDate);

  return calendarEventBaseList.map((calendarEventBase, index) => {
    const startDate = setDayOfYear(
      setYear(shift.startDate, getYear(calendarEventBase.startDate)),
      getDayOfYear(calendarEventBase.startDate),
    );

    return {
      ...shift,
      id: index === 0 ? shift.id : uuidv4(),
      recurrence,
      startDate,
      endDate: addMinutes(startDate, diff),
    };
  });
};

const makeShiftRecurrence = async (
  shift: Shift,
  recurrence: CalendarEventRecurrenceInput,
): Promise<ShiftRecurrence> => {
  return {
    createdAt: new Date(),
    id: uuidv4(),
    initialShiftId: shift.id,
    recurrence: makeRecurrence(shift.startDate, recurrence),
    updatedAt: new Date(),
  };
};

const createShiftRecurrence = async (
  shift: Shift,
  recurrence: CalendarEventRecurrenceInput,
  shiftRepository: ShiftRepository,
): Promise<ShiftRecurrence> => {
  const createdShiftRecurrence = await makeShiftRecurrence(shift, recurrence);
  await shiftRepository.saveShiftRecurrence(createdShiftRecurrence);

  const shifts = await makeShifts(shift, createdShiftRecurrence);

  await shiftRepository.saveMany(shifts);

  return createdShiftRecurrence;
};

export interface CreateShiftInput {
  id?: string | null;
  recurrence?: CalendarEventRecurrenceInput | null;
  locationId: string;
  employeeId: string;
  breakDuration?: number | null;
  startDate: Date;
  endDate: Date;
  notes?: string | null;
  status?: ShiftStatus | null;
}

export const createShift = async (
  input: CreateShiftInput,
  context: RequestContext,
) => {
  const { shiftRepository } = enhance(context).repositories;

  let shift = await make(input, context);

  const action = PolicyAction.CREATE_SHIFT;
  await authorizeMember(action, getResource(shift), context);

  if (input.recurrence) {
    const recurrence = await createShiftRecurrence(
      shift,
      input.recurrence,
      shiftRepository,
    );

    shift = { ...shift, recurrence };
  } else {
    await shiftRepository.save(shift);
  }

  publishEvent(Event.SHIFT_CREATED, shift, context);

  return makeSuccessPayload(shift);
};

const isCompleted = (shift: Shift) => {
  return shift.status === ShiftStatus.COMPLETED;
};

export enum ApplyRecurrence {
  ONLY_THIS_ONE = 'ONLY_THIS_ONE',
  ALL = 'ALL',
  THIS_AND_FOLLOWING = 'THIS_AND_FOLLOWING',
}

export interface UpdateShiftInput {
  id: string;
  recurrence?: CalendarEventRecurrenceInput | null;
  locationId?: string | null;
  employeeId?: string | null;
  breakDuration?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  notes?: string | null;
  canceledAt?: Date | null;
  status?: ShiftStatus | null;
  applyRecurrence: ApplyRecurrence;
}

export const updateShift = async (
  input: UpdateShiftInput,
  context: RequestContext,
  event: Event = Event.SHIFT_UPDATED,
) => {
  const { shiftRepository } = enhance(context).repositories;

  const previousShift = await shiftRepository.getById(input.id);

  if (isCompleted(previousShift)) {
    return makeErrorPayload(userErrors.cannotDeleteCompletedShift());
  }

  const action = PolicyAction.UPDATE_SHIFT;
  await authorizeMember(action, getResource(previousShift), context);

  const shouldUpdateRecurringShift = !!(
    (input.applyRecurrence === ApplyRecurrence.ALL ||
      input.applyRecurrence === ApplyRecurrence.THIS_AND_FOLLOWING) &&
    // Updating status should apply to only single previousShift
    !input.status &&
    previousShift.recurrence
  );

  const shift = shouldUpdateRecurringShift
    ? await updateRecurringShift(input, shiftRepository)
    : await updateSingleShift(input, shiftRepository);

  publishEvent(event, shift, context);

  return makeSuccessPayload(shift);
};

const updateChangeset = async (
  shift: Shift,
  input: UpdateShiftInput,
): Promise<Shift> => {
  const { recurrence, applyRecurrence, ...fields } = input;

  return {
    ...shift,
    ...fields,
    breakDuration: input.breakDuration || shift.breakDuration,
    locationId: input.locationId || shift.locationId,
    endDate: input.endDate || shift.endDate,
    employeeId: input.employeeId || shift.employeeId,
    startDate: input.startDate || shift.startDate,
    status: input.status || shift.status,
    updatedAt: new Date(),
  };
};

const updateRecurringShift = async (
  input: UpdateShiftInput,
  shiftRepository: ShiftRepository,
) => {
  const shift = await shiftRepository.getById(input.id);
  const updatedShift = (await updateChangeset(
    shift,
    input,
  )) as ShiftWithShiftRecurrence;

  if (!shift.recurrence) {
    throw new Error(`Expected shiftRecurrence in ${shift.id}`);
  }

  let recurrence = await shiftRepository.getShiftRecurrenceById(
    shift.recurrence.id,
  );

  recurrence = {
    ...recurrence,
    recurrence: makeRecurrence(
      updatedShift.startDate,
      input.recurrence || recurrence.recurrence,
    ),
  };

  await shiftRepository.updateShiftRecurrence(recurrence);

  await updateShifts(
    updatedShift,
    recurrence,
    input.applyRecurrence,
    shiftRepository,
  );

  return { ...updatedShift, recurrence };
};

const updateShifts = async (
  shift: ShiftWithShiftRecurrence,
  recurrence: ShiftRecurrence,
  applyRecurrence: ApplyRecurrence,
  shiftRepository: ShiftRepository,
) => {
  const previousShifts = await shiftRepository.findManyByShiftRecurrenceId(
    recurrence.id,
  );

  const nextShifts = await makeShifts(shift, recurrence);

  const [beforeShifts, afterShifts] = segregateByOccurrence(
    shift,
    previousShifts,
  );

  const [updatedShifts, createdShifts, outdatedShifts] =
    applyRecurrence === ApplyRecurrence.THIS_AND_FOLLOWING
      ? segregateByStatus(afterShifts, nextShifts)
      : segregateByStatus(previousShifts, nextShifts);

  await shiftRepository.removeMany(outdatedShifts);
  await shiftRepository.updateMany(updatedShifts);
  await shiftRepository.updateMany(
    beforeShifts.map(s => ({ ...s, recurrence: null })),
  );
  await shiftRepository.saveMany(createdShifts);
};

// Any changes applied to a single shift should detach it from shiftRecurrences
const updateSingleShift = async (
  input: UpdateShiftInput,
  shiftRepository: ShiftRepository,
): Promise<Shift> => {
  const shift = await shiftRepository.getById(input.id);
  let updatedShift = await updateChangeset(shift, input);

  const shouldAddRecurrence =
    input.recurrence &&
    (input.applyRecurrence === ApplyRecurrence.ALL ||
      input.applyRecurrence === ApplyRecurrence.THIS_AND_FOLLOWING) &&
    !input.status;

  if (input.recurrence && shouldAddRecurrence) {
    // REVIEW: If it should not remove due to data integrity
    await shiftRepository.remove(updatedShift);

    const recurrence = await createShiftRecurrence(
      updatedShift,
      input.recurrence,
      shiftRepository,
    );

    updatedShift = { ...updatedShift, recurrence };
  } else {
    // Remove existence in recurrence
    updatedShift = { ...updatedShift, recurrence: null };

    await shiftRepository.update(updatedShift);
  }

  return updatedShift;
};

export interface CancelShiftInput {
  id: string;
  applyRecurrence: ApplyRecurrence;
}

export const cancelShift = async (
  input: CancelShiftInput,
  context: RequestContext,
) => {
  const { shiftRepository } = enhance(context).repositories;

  const prevShift = await shiftRepository.getById(input.id);

  const action = PolicyAction.UPDATE_SHIFT;
  await authorizeMember(action, getResource(prevShift), context);

  return updateShift(
    { ...input, canceledAt: new Date() },
    context,
    Event.SHIFT_CANCELED,
  );
};
