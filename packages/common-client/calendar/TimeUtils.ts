import {
  addHours,
  setHours,
  setMinutes,
  startOfDay,
  addMinutes,
} from 'date-fns';

import { Interval, makeInterval } from './IntervalUtils';

export const setTime = (date: Date, hours: number, minutes = 0) => {
  return setMinutes(setHours(date, hours), minutes);
};

export const eachHourOfInterval = (interval: Interval, step = 1) =>
  makeInterval(interval, addHours, step);

export const eachMinuteOfInterval = (interval: Interval, step = 5) =>
  makeInterval(interval, addMinutes, step);

export const getHoursInDay = (date: Date = new Date()) =>
  eachHourOfInterval({
    start: setTime(startOfDay(date), 0),
    end: setTime(startOfDay(date), 24),
  });

export const getMinutesInHour = (date: Date = new Date()) =>
  eachMinuteOfInterval({
    start: setTime(startOfDay(date), 0),
    end: setTime(startOfDay(date), 1),
  });
