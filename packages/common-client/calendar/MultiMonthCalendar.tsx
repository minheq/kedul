import { addMonths, format } from 'date-fns';
import { Box, Heading } from 'paramount-ui';
import * as React from 'react';
import { DEFAULT_FIRST_DAY_OF_WEEK } from '@kedul/common-utils';

import { validateInterval, Interval } from './IntervalUtils';
import { MonthBody } from './MonthCalendar';
import { getWeeksInMultiMonth } from './MonthUtils';
import { FirstDayOfWeek } from './WeekUtils';

export interface MultiMonthCalendarProps {
  onSelect?: (date: Date) => void;
  /** Highlights the date or start date on the calendar */
  selectedInterval?: Interval | null;
  displayedInterval: Interval;
  firstDayOfWeek?: FirstDayOfWeek;
}

export const MultiMonthCalendar = (props: MultiMonthCalendarProps) => {
  const {
    firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
    displayedInterval = {
      start: new Date(),
      end: addMonths(new Date(), 1),
    },
    selectedInterval,
    onSelect,
  } = props;

  if (displayedInterval) validateInterval(displayedInterval);
  if (selectedInterval) validateInterval(selectedInterval);

  const months = getWeeksInMultiMonth(
    displayedInterval,
    selectedInterval,
    firstDayOfWeek,
  );

  return (
    <Box flex={1} width="100%">
      {months.map(month => {
        return (
          <Box key={month.month.valueOf()}>
            <Box paddingVertical={24}>
              <Heading>{format(month.month, 'MMMM yyyy')}</Heading>
            </Box>
            <MonthBody month={month} onSelect={onSelect} />
          </Box>
        );
      })}
    </Box>
  );
};
