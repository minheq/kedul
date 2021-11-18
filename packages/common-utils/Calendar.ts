import { addYears, format, addMinutes } from 'date-fns';
import { RRule, Options } from 'rrule';

import { EntityBase } from './Types';

export const MINUTES_IN_ONE_DAY = 24 * 60;
export const MINUTES_IN_ONE_HOUR = 60;
export const DEFAULT_FIRST_DAY_OF_WEEK = 1;

export const TIME_HOUR_FORMAT = 'HH';
export const TIME_MINUTE_FORMAT = 'mm';
export const TIME_FORMAT = `${TIME_HOUR_FORMAT}:${TIME_MINUTE_FORMAT}`;

export const DURATION_HOUR_FORMAT = `H'h'`;
export const DURATION_MINUTE_FORMAT = `m'min'`;
export const DURATION_FORMAT = `${DURATION_HOUR_FORMAT} ${DURATION_MINUTE_FORMAT}`;

export const DATE_KEY_FORMAT = `yyyy-MM-dd`;
export const DATE_SHORT_FORMAT = `d MMM yyyy`;
export const DATE_FORMAT = `do MMMM yyyy`;
export const DATE_TIME_FORMAT = `y/M/d ${TIME_FORMAT}`;

export enum WeekDay {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 0,
}

export enum CalendarEventRecurrenceFrequency {
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  DAILY = 'DAILY',
}

export interface CalendarEventInput {
  startDate: Date;
  endDate: Date;
  recurrence?: CalendarEventRecurrenceInput | null;
}

export interface CalendarEvent {
  startDate: Date;
  endDate: Date;
  recurrence?: CalendarEventRecurrence | null;
}

export interface CalendarEventRecurrenceInput {
  frequency: CalendarEventRecurrenceFrequency;
  interval?: number | null;
  count?: number | null;
  weekStart?: WeekDay | null;
  until?: Date | null;
  timezoneId?: string | null;
  bySetPosition?: number[] | null;
  byMonth?: number[] | null;
  byMonthDay?: number[] | null;
  byYearDay?: number[] | null;
  byWeekNumber?: number[] | null;
  byWeekDay?: WeekDay[] | null;
  byHour?: number[] | null;
  byMinute?: number[] | null;
  bySecond?: number[] | null;
}

export interface CalendarEventRecurrence {
  startDate: Date;
  frequency: CalendarEventRecurrenceFrequency;
  interval?: number | null;
  count?: number | null;
  weekStart?: WeekDay | null;
  until?: Date | null;
  timezoneId?: string | null;
  bySetPosition?: number[] | null;
  byMonth?: number[] | null;
  byMonthDay?: number[] | null;
  byYearDay?: number[] | null;
  byWeekNumber?: number[] | null;
  byWeekDay?: WeekDay[] | null;
  byHour?: number[] | null;
  byMinute?: number[] | null;
  bySecond?: number[] | null;
}

export const toCalendarEventRecurrenceInput = (
  recurrence: CalendarEventRecurrence,
): CalendarEventRecurrenceInput => {
  return {
    frequency: recurrence.frequency,
    interval: recurrence.interval,
    count: recurrence.count,
    weekStart: recurrence.weekStart,
    until: recurrence.until ? new Date(recurrence.until) : null,
    timezoneId: recurrence.timezoneId,
    bySetPosition: recurrence.bySetPosition,
    byMonth: recurrence.byMonth,
    byMonthDay: recurrence.byMonthDay,
    byYearDay: recurrence.byYearDay,
    byWeekNumber: recurrence.byWeekNumber,
    byWeekDay: recurrence.byWeekDay,
    byHour: recurrence.byHour,
    byMinute: recurrence.byMinute,
    bySecond: recurrence.bySecond,
  };
};

export interface CalendarEventBase {
  startDate: Date;
}

export interface RecurringItemBase extends CalendarEventBase, EntityBase {}

export const recurrenceFrequencyMap = {
  [CalendarEventRecurrenceFrequency.YEARLY]: RRule.YEARLY,
  [CalendarEventRecurrenceFrequency.MONTHLY]: RRule.MONTHLY,
  [CalendarEventRecurrenceFrequency.WEEKLY]: RRule.WEEKLY,
  [CalendarEventRecurrenceFrequency.DAILY]: RRule.DAILY,
};

export const dayToWeekdayMap: {
  [day: number]: WeekDay;
} = {
  1: WeekDay.MONDAY,
  2: WeekDay.TUESDAY,
  3: WeekDay.WEDNESDAY,
  4: WeekDay.THURSDAY,
  5: WeekDay.FRIDAY,
  6: WeekDay.SATURDAY,
  0: WeekDay.SUNDAY,
};

export const weekDayMap = {
  [WeekDay.MONDAY]: RRule.MO,
  [WeekDay.TUESDAY]: RRule.TU,
  [WeekDay.WEDNESDAY]: RRule.WE,
  [WeekDay.THURSDAY]: RRule.TH,
  [WeekDay.FRIDAY]: RRule.FR,
  [WeekDay.SATURDAY]: RRule.SA,
  [WeekDay.SUNDAY]: RRule.SU,
};

export const MAX_YEARS_AHEAD = 2;

export const makeRecurrence = (
  startDate: Date,
  recurrence: CalendarEventRecurrenceInput,
): CalendarEventRecurrence => {
  return {
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
    interval: null,
    timezoneId: null,
    until: null,
    weekStart: null,
    ...recurrence,
    startDate,
  };
};

const toUTC = (date: Date) => {
  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );
};

export const makeRecurringDates = (
  recurrence: CalendarEventRecurrence,
): Date[] => {
  const {
    frequency,
    interval,
    count,
    weekStart,
    until,
    timezoneId,
    bySetPosition,
    byMonth,
    byMonthDay,
    byYearDay,
    byWeekNumber,
    byWeekDay,
    byHour,
    byMinute,
    startDate,
    bySecond,
  } = recurrence;

  const options: Partial<Options> = {
    count,
    dtstart: new Date(toUTC(startDate)),
    freq: recurrenceFrequencyMap[frequency],
    interval: interval || 1,
    tzid: timezoneId,
    until: until ? new Date(toUTC(until)) : null,
    wkst: weekStart ? weekDayMap[weekStart] : null,
    bysetpos: bySetPosition,
    bymonth: byMonth,
    bymonthday: byMonthDay,
    byyearday: byYearDay,
    byweekno: byWeekNumber,
    byweekday: byWeekDay ? byWeekDay.map(wd => weekDayMap[wd]) : null,
    byhour: byHour,
    byminute: byMinute,
    bysecond: bySecond,
  };

  return new RRule(options)
    .all()
    .map(date => addMinutes(date, startDate.getTimezoneOffset()));
};

export const makeRecurringCalendarEvent = (
  recurrence: CalendarEventRecurrence,
): CalendarEventBase[] => {
  const defaultUntil = addYears(recurrence.startDate, MAX_YEARS_AHEAD);

  const recurringDates = makeRecurringDates({
    ...recurrence,
    until: !recurrence.until ? defaultUntil : recurrence.until,
  });

  return recurringDates.map(date => ({
    startDate: date,
  }));
};

const defaultChangeset: RecurringItemChangeset = (previous, next) => ({
  ...next,
  id: previous.id,
});

export type RecurringItemChangeset<
  TRecurringItem extends RecurringItemBase = any
> = (previousItem: TRecurringItem, nextItem: TRecurringItem) => TRecurringItem;

/**
 * Given two list of recurring items, it will segregate by following status:
 * New - items which start date did not exist in previous recurring items
 * Updated - items which have a matching start date with some in the previous recurring items
 * Outdated - items from the previous recurring items that did not match any in the new list
 */
export const segregateByStatus = <
  TRecurringItem extends RecurringItemBase = any
>(
  oldItems: TRecurringItem[],
  newItems: TRecurringItem[],
  changeset: RecurringItemChangeset = defaultChangeset,
): [TRecurringItem[], TRecurringItem[], TRecurringItem[]] => {
  const updatedItems: TRecurringItem[] = [];
  const outdatedItems: TRecurringItem[] = [];
  const createdItems: TRecurringItem[] = [];
  const newItemsMap: { [startDate: string]: TRecurringItem } = {};
  const oldItemsMap: { [startDate: string]: TRecurringItem } = {};

  for (const newItem of newItems) {
    newItemsMap[format(newItem.startDate, DATE_KEY_FORMAT)] = newItem;
  }

  for (const oldItem of oldItems) {
    oldItemsMap[format(oldItem.startDate, DATE_KEY_FORMAT)] = oldItem;
  }

  for (const newItemStartDate in newItemsMap) {
    if (oldItemsMap[newItemStartDate]) {
      const nextItem = newItemsMap[newItemStartDate];
      const previousItem = oldItemsMap[newItemStartDate];
      const updatedItem = changeset(previousItem, nextItem);

      updatedItems.push(updatedItem);
    } else {
      createdItems.push(newItemsMap[newItemStartDate]);
    }
  }

  for (const oldItemStartDate in oldItemsMap) {
    if (!newItemsMap[oldItemStartDate]) {
      outdatedItems.push(oldItemsMap[oldItemStartDate]);
    }
  }

  return [updatedItems, createdItems, outdatedItems];
};

/**
 * Given previousItems are
 * [A, B, C, D]
 * we are updating item B, then this should return
 * beforeItems: [A]
 * afterItems: [B, C, D]
 */
export const segregateByOccurrence = <TRecurringItem extends EntityBase = any>(
  updatedItem: TRecurringItem,
  items: TRecurringItem[],
): [TRecurringItem[], TRecurringItem[]] => {
  const separationIndex = items.findIndex(
    prevItem => prevItem.id === updatedItem.id,
  );

  if (separationIndex < 0) {
    throw new Error(`Expected id ${updatedItem.id} to exist in recurrence`);
  }

  const beforeItems = items.slice(0, separationIndex);
  const afterItems = items.slice(separationIndex);

  return [beforeItems, afterItems];
};
