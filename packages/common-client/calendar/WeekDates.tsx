import { format } from 'date-fns';
import { Box, Text } from 'paramount-ui';
import React from 'react';
import { DEFAULT_FIRST_DAY_OF_WEEK } from '@kedul/common-utils';

import { eachDayOfWeek, FirstDayOfWeek } from './WeekUtils';

interface WeekDatesProps {
  firstDayOfWeek?: FirstDayOfWeek;
  selectedDate?: Date;
  currentDate?: Date;
}

export const WeekDates = (props: WeekDatesProps) => {
  const {
    currentDate = new Date(),
    firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
  } = props;
  const dates = eachDayOfWeek(firstDayOfWeek);

  return (
    <Box flex={1} flexDirection="row">
      {dates.map(date => (
        <Box
          key={date.toISOString()}
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding={1}
        >
          <Text size="small">{format(date, 'EEEEEE')}</Text>
        </Box>
      ))}
    </Box>
  );
};
