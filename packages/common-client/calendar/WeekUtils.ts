import {
  addDays,
  eachDayOfInterval,
  getDay,
  subDays,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { DEFAULT_FIRST_DAY_OF_WEEK } from '@kedul/common-utils';

import { Interval } from './IntervalUtils';

export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const getFirstDateOfWeek = (
  date: Date,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
) => {
  const day = getDay(date);
  const diffDays = day - firstDayOfWeek;

  const sub = diffDays < 0 ? 7 + diffDays : diffDays;

  return subDays(date, sub);
};

export const getLastDateOfWeek = (
  date: Date,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
): Date => {
  const firstDateOfTheWeek = getFirstDateOfWeek(date, firstDayOfWeek);

  return addDays(firstDateOfTheWeek, 6);
};

export const getWeekInterval = (
  date: Date,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
): Interval => {
  return {
    start: startOfDay(getFirstDateOfWeek(date, firstDayOfWeek)),
    end: endOfDay(getLastDateOfWeek(date, firstDayOfWeek)),
  };
};

export const eachDayOfWeek = (
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
) => {
  return eachDayOfInterval(getWeekInterval(new Date(), firstDayOfWeek));
};
