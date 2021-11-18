import { toMagnitude, toY } from './DaysCalendarUtils';
import { setTime } from './TimeUtils';

const DEFAULT_STEP = 5;

describe('toY', () => {
  test.each([
    [0, 0, 288],
    [3, 0, 252],
    [3, 15, 249],
    [3, 17, 249],
    [3, 18, 248],
  ])(
    'given the time is %s:%s, it should return %s',
    (hours, minutes, expected) => {
      const time = setTime(new Date(), hours, minutes);

      expect(toY(time, DEFAULT_STEP)).toBe(expected);
    },
  );
});

describe('toMagnitude', () => {
  test.each([[[3, 0], [3, 15], [3]], [[3, 15], [23, 15], [240]]])(
    'given the start time %s and end time %s, it should return %s',
    ([startHours, startMinutes], [endHours, endMinutes], [expected]) => {
      const startTime = setTime(new Date(), startHours, startMinutes);
      const endTime = setTime(new Date(), endHours, endMinutes);

      expect(toMagnitude(startTime, endTime, DEFAULT_STEP)).toBe(expected);
    },
  );
});
