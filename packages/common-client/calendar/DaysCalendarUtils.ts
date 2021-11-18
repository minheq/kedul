import { addMinutes, differenceInMinutes, startOfDay } from 'date-fns';
import { MINUTES_IN_ONE_DAY } from '@kedul/common-utils';

import { Event, Day } from './DaysCalendar';
import { Vector } from './Grid';
import { validateInterval } from './IntervalUtils';

export const toY = (date: Date, step: number): number => {
  const upperY = MINUTES_IN_ONE_DAY / step;
  const minutesFromStartOfDay = differenceInMinutes(date, startOfDay(date));
  const yOffset = Math.round(minutesFromStartOfDay / step);

  return upperY - yOffset;
};

export const toMagnitude = (
  startDate: Date,
  endDate: Date,
  step: number,
): number => {
  const totalMinutes = differenceInMinutes(endDate, startDate);

  return Math.round(totalMinutes / step);
};

export const toVector = (event: Event, x: number, step: number): Vector => {
  return {
    id: event.id,
    y: toY(event.startDate, step),
    x,
    magnitude: toMagnitude(event.startDate, event.endDate, step),
  };
};

export const toStartDate = (
  date: Date,
  y: number,
  maxY: number,
  step: number,
): Date => {
  return addMinutes(startOfDay(date), (maxY - y) * step);
};

export const toEndDate = (
  date: Date,
  y: number,
  maxY: number,
  magnitude: number,
  step: number,
): Date => {
  return addMinutes(startOfDay(date), (maxY - y) * step + magnitude * step);
};

export const toNewEvent = <TEvent extends Event>(
  days: Day<TEvent>[],
  vector: Vector,
  maxY: number,
  step: number,
): Event => {
  const { date } = days[vector.x];

  return {
    id: vector.id,
    startDate: toStartDate(date, vector.y, maxY, step),
    endDate: toEndDate(date, vector.y, maxY, vector.magnitude, step),
  };
};

export const toOriginalEvent = <TEvent extends Event>(
  days: Day<TEvent>[],
  vector: Vector,
  maxY: number,
  step: number,
): TEvent => {
  const { date } = days[vector.x];

  const event = days
    .map(d => d.events)
    .flat()
    .find(originalEvent => {
      if (originalEvent.id === vector.id) {
        return {
          ...originalEvent,
          id: vector.id,
          startDate: toStartDate(date, vector.y, maxY, step),
          endDate: toEndDate(date, vector.y, maxY, vector.magnitude, step),
        };
      }

      return null;
    });

  if (!event) {
    throw new Error('Could not find corresponding calendar event');
  }

  return event;
};

export const toVectors = <TEvent extends Event>(
  days: Day<TEvent>[],
  step: number,
): Vector[][] => {
  return days.map((day, x) =>
    day.events.map(event => toVector(event, x, step)),
  );
};

export const validateEvents = <TEvent extends Event>(days: Day<TEvent>[]) => {
  return days.map(day =>
    day.events.map(event =>
      validateInterval({
        start: event.startDate,
        end: event.endDate,
      }),
    ),
  );
};
