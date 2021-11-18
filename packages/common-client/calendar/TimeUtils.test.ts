import { eachHourOfInterval } from './TimeUtils';

describe('eachHourOfInterval', () => {
  test.each([[0, 24, 24], [0, 15, 15]])(
    'given the time is start %s and end %s dates, it should return %s dates',
    (start, end, expected) => {
      const hours = eachHourOfInterval({
        start: new Date(2018, 6, 30, start, 0, 0, 0),
        end: new Date(2018, 6, 30, end, 0, 0, 0),
      });

      expect(hours).toHaveLength(expected);
    },
  );
});
