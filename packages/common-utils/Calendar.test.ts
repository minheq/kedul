import { addWeeks } from 'date-fns';

import {
  makeRecurringDates,
  CalendarEventRecurrenceFrequency,
  WeekDay,
} from './Calendar';

test('should create monthly recurring shift happy path', async () => {
  const startDate = new Date(2019, 8, 30, 2);

  const dates = makeRecurringDates({
    startDate,
    frequency: CalendarEventRecurrenceFrequency.WEEKLY,
    interval: 1,
    until: new Date(2019, 10, 5, 23),
    byWeekDay: [WeekDay.MONDAY],
  });

  expect(dates[0]).toEqual(startDate);
  expect(dates[1]).toEqual(addWeeks(startDate, 1));

  expect(dates).toHaveLength(6);
});
