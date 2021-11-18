import {
  addDays,
  addMonths,
  areIntervalsOverlapping,
  differenceInDays,
  differenceInMonths,
  eachDayOfInterval,
  endOfMonth,
  getISOWeek,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfMonth,
  subDays,
} from 'date-fns';
import { chunk } from 'lodash';
import { DEFAULT_FIRST_DAY_OF_WEEK } from '@kedul/common-utils';

import { Interval } from './IntervalUtils';
import { Day, Month } from './MonthCalendar';
import {
  FirstDayOfWeek,
  getFirstDateOfWeek,
  getLastDateOfWeek,
} from './WeekUtils';

const getMonthInterval = (date: Date): Interval => ({
  start: startOfMonth(date),
  end: endOfMonth(date),
});

const getMonthDatesFromDate = (date: Date): Date[] =>
  eachDayOfInterval(getMonthInterval(date));

const getDatesBefore = (
  startOfMonthDate: Date,
  firstDayOfWeek: FirstDayOfWeek,
) => {
  let beforeDates: Date[] = [];

  let fromDate = startOfMonthDate;

  const firstDateOfWeek = getFirstDateOfWeek(fromDate, firstDayOfWeek);

  if (!isSameDay(fromDate, firstDateOfWeek)) {
    const sub = differenceInDays(fromDate, firstDateOfWeek);
    fromDate = subDays(fromDate, sub);
  }

  if (isBefore(fromDate, startOfMonthDate)) {
    beforeDates = eachDayOfInterval({
      start: fromDate,
      end: subDays(startOfMonthDate, 1),
    });
  }

  return beforeDates;
};

const getDatesAfter = (
  endOfMonthDate: Date,
  firstDayOfWeek: FirstDayOfWeek,
) => {
  let afterDates: Date[] = [];

  let toDate = endOfMonthDate;

  const lastDateOfWeek = getLastDateOfWeek(toDate, firstDayOfWeek);
  if (!isSameDay(toDate, lastDateOfWeek)) {
    const add = differenceInDays(lastDateOfWeek, toDate);

    toDate = addDays(toDate, add);
  }

  if (isAfter(toDate, endOfMonthDate)) {
    afterDates = eachDayOfInterval({
      start: addDays(endOfMonthDate, 1),
      end: toDate,
    });
  }

  return afterDates;
};

export const monthPageInDates = (
  date: Date,
  firstDayOfWeekIndex: FirstDayOfWeek,
): Date[] => {
  const monthDates = getMonthDatesFromDate(date);
  const startOfMonthDate = monthDates[0];
  const endOfMonthDate = monthDates[monthDates.length - 1];

  const beforeDates = getDatesBefore(startOfMonthDate, firstDayOfWeekIndex);
  const afterDates = getDatesAfter(endOfMonthDate, firstDayOfWeekIndex);

  return beforeDates.concat(monthDates, afterDates);
};

const chunkBySeven = <TData = any>(array: TData[]) => chunk(array, 7);

export const monthPageInWeeks = (
  monthDate: Date,
  firstDayOfWeekIndex: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
) => chunkBySeven(monthPageInDates(monthDate, firstDayOfWeekIndex));

const transformDateToDay = (isSelected: boolean, isCurrentMonth = true) => (
  date: Date,
): Day => ({
  date,
  isCurrentMonth,
  isSelected,
  isSelectedEnd: false,
  isSelectedStart: false,
});

const getCurrentMonthDays = (
  monthDates: Date[],
  selectedInterval?: Interval | null,
) => {
  if (!selectedInterval) return monthDates.map(transformDateToDay(false));

  const selectedStartDateIndex = monthDates.findIndex(date =>
    isSameDay(date, selectedInterval.start),
  );
  const isSelectedStartDateWithinMonth = selectedStartDateIndex !== -1;

  const selectedEndDateIndex = selectedInterval.end
    ? monthDates.findIndex(date => isSameDay(date, selectedInterval.end))
    : selectedStartDateIndex;

  const isSelectedEndDateWithinMonth = selectedEndDateIndex !== -1;

  const beforeSelectedDays = isSelectedStartDateWithinMonth
    ? monthDates.slice(0, selectedStartDateIndex).map(transformDateToDay(false))
    : [];

  const selectedDates = monthDates.slice(
    isSelectedStartDateWithinMonth ? selectedStartDateIndex : 0,
    isSelectedEndDateWithinMonth ? selectedEndDateIndex : monthDates.length,
  );

  const selectedDays = selectedDates.map(transformDateToDay(true));

  const afterSelectedDays = isSelectedEndDateWithinMonth
    ? monthDates.slice(selectedEndDateIndex).map(transformDateToDay(false))
    : [];

  const days = beforeSelectedDays.concat(selectedDays, afterSelectedDays);

  days[selectedStartDateIndex] = {
    ...days[selectedStartDateIndex],
    isSelected: true,
    isSelectedStart: true,
  };

  days[selectedEndDateIndex] = {
    ...days[selectedEndDateIndex],
    isSelected: true,
    isSelectedEnd: true,
  };

  return days;
};

const getBeforeMonthDays = (
  startOfMonthDate: Date,
  firstDayOfWeekIndex: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
  selectedInterval?: Interval,
) => {
  const hasSelectedDatesBeforeMonth = !!(
    selectedInterval && isBefore(selectedInterval.start, startOfMonthDate)
  );
  const beforeDates = getDatesBefore(startOfMonthDate, firstDayOfWeekIndex);

  return beforeDates.map(
    transformDateToDay(hasSelectedDatesBeforeMonth, false),
  );
};

const getAfterMonthDays = (
  endOfMonthDate: Date,
  firstDayOfWeekIndex: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
  selectedInterval?: Interval,
) => {
  const hasSelectedDatesAfterMonth = !!(
    selectedInterval && isAfter(selectedInterval.end, endOfMonthDate)
  );
  const afterDates = getDatesAfter(endOfMonthDate, firstDayOfWeekIndex);

  return afterDates.map(transformDateToDay(hasSelectedDatesAfterMonth, false));
};

export const getDaysInMonth = (
  monthDate: Date,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
  selectedInterval?: Interval,
) => {
  const monthDates = getMonthDatesFromDate(monthDate);
  const startOfMonthDate = monthDates[0];
  const endOfMonthDate = monthDates[monthDates.length - 1];

  const currentDays = getCurrentMonthDays(monthDates, selectedInterval);
  const beforeDays = getBeforeMonthDays(
    startOfMonthDate,
    firstDayOfWeek,
    selectedInterval,
  );
  const afterDays = getAfterMonthDays(
    endOfMonthDate,
    firstDayOfWeek,
    selectedInterval,
  );

  return beforeDays.concat(currentDays, afterDays);
};

export const getWeeksInMonth = (
  monthDate: Date,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
  selectedInterval?: Interval,
): Month => {
  const days = getDaysInMonth(monthDate, firstDayOfWeek, selectedInterval);

  return {
    month: monthDate,
    weeks: chunkBySeven(days).map(week => ({
      days: week,
      index: getISOWeek(week[0].date),
    })),
  };
};

const getMonthsDates = (interval: Interval) => {
  const monthsCount = differenceInMonths(interval.end, interval.start);

  const monthsDates: Date[] = [];

  for (let index = 0; index < monthsCount; index++) {
    monthsDates.push(addMonths(interval.start, index));
  }

  return monthsDates;
};

export const getWeeksInMultiMonth = (
  interval: Interval,
  selectedInterval?: Interval | null,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
): Month[] => {
  const monthsDates = getMonthsDates(interval);

  return monthsDates.map(monthDate => {
    if (!selectedInterval) {
      return getWeeksInMonth(monthDate, firstDayOfWeek);
    }

    const startOfMonthDate = startOfMonth(monthDate);
    const endOfMonthDate = endOfMonth(monthDate);
    const monthInterval = { start: startOfMonthDate, end: endOfMonthDate };

    if (!selectedInterval.end) {
      const isSelectedStartDateWithinMonth = isWithinInterval(
        selectedInterval.start,
        monthInterval,
      );

      return isSelectedStartDateWithinMonth
        ? getWeeksInMonth(monthDate, firstDayOfWeek, selectedInterval)
        : getWeeksInMonth(monthDate, firstDayOfWeek);
    }

    const isMonthOverlappingWithSelectedRange =
      areIntervalsOverlapping(monthInterval, selectedInterval) ||
      isSameDay(selectedInterval.end, startOfMonthDate);

    return isMonthOverlappingWithSelectedRange
      ? getWeeksInMonth(monthDate, firstDayOfWeek, selectedInterval)
      : getWeeksInMonth(monthDate, firstDayOfWeek);
  });
};
