import { format, isBefore, toDate } from 'date-fns';
import { DATE_TIME_FORMAT } from '@kedul/common-utils';

export interface Interval {
  start: Date;
  end: Date;
}

export const makeInterval = (
  interval: Interval,
  add: (date: Date, step: number) => Date,
  step = 1,
) => {
  validateInterval(interval);

  const startDate = toDate(interval.start);
  const endDate = toDate(interval.end);

  let currentDate = startDate;

  const dates: Date[] = [];

  while (isBefore(currentDate, endDate)) {
    dates.push(toDate(currentDate));

    currentDate = add(currentDate, step);
  }

  return dates;
};

export const validateInterval = (interval: Interval) => {
  if (isBefore(interval.end, interval.start)) {
    throw new Error(
      `Selected end date cannot be before selected start date. startDate=${format(
        interval.start,
        DATE_TIME_FORMAT,
      )} endDate=${format(interval.end, DATE_TIME_FORMAT)}`,
    );
  }
};

export const isInterval = (
  value: Date | Interval | null,
): value is Interval => {
  if (!value) return false;

  return !(value instanceof Date);
};
