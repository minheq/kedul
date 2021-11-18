import { isSameDay } from 'date-fns';

import {
  FirstDayOfWeek,
  getFirstDateOfWeek,
  getLastDateOfWeek,
} from './WeekUtils';

describe('getFirstDateOfWeek', () => {
  test.each([
    [new Date(2019, 8, 22), 1, new Date(2019, 8, 16)],
    [new Date(2019, 8, 23), 1, new Date(2019, 8, 23)],
    [new Date(2019, 8, 26), 1, new Date(2019, 8, 23)],
    [new Date(2019, 8, 22), 0, new Date(2019, 8, 22)],
    [new Date(2019, 8, 23), 0, new Date(2019, 8, 22)],
    [new Date(2019, 8, 26), 0, new Date(2019, 8, 22)],
    [new Date(2019, 8, 22), 3, new Date(2019, 8, 18)],
    [new Date(2019, 8, 23), 3, new Date(2019, 8, 18)],
    [new Date(2019, 8, 26), 3, new Date(2019, 8, 25)],
  ])(
    'given the date %s and firstDayOfWeek is %s, it should return %s',
    (date, firstDayOfWeek, expected) => {
      const result = getFirstDateOfWeek(
        date as Date,
        firstDayOfWeek as FirstDayOfWeek,
      );

      expect(isSameDay(result, expected)).toBeTruthy();
    },
  );
});

describe('getLastDateOfWeek', () => {
  test.each([
    [new Date(2019, 8, 22), 1, new Date(2019, 8, 22)],
    [new Date(2019, 8, 23), 1, new Date(2019, 8, 29)],
    [new Date(2019, 8, 26), 1, new Date(2019, 8, 29)],
    [new Date(2019, 8, 22), 0, new Date(2019, 8, 28)],
    [new Date(2019, 8, 23), 0, new Date(2019, 8, 28)],
    [new Date(2019, 8, 26), 0, new Date(2019, 8, 28)],
    [new Date(2019, 8, 22), 3, new Date(2019, 8, 24)],
  ])(
    'given the date %s and firstDayOfWeek is %s, it should return %s',
    (date, firstDayOfWeek, expected) => {
      const result = getLastDateOfWeek(
        date as Date,
        firstDayOfWeek as FirstDayOfWeek,
      );

      expect(isSameDay(result, expected)).toBeTruthy();
    },
  );
});
