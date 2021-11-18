import { EventProps } from '@kedul/common-client';
import { TIME_FORMAT } from '@kedul/common-utils';
import { format } from 'date-fns';
import { Box, Text, useTheme } from 'paramount-ui';
import React from 'react';

import { ShiftFragment } from '../generated/MutationsAndQueries';

export const ShiftCalendarCard = (props: EventProps<ShiftFragment>) => {
  const { event } = props;
  const theme = useTheme();

  return (
    <Box
      backgroundColor={theme.colors.background.primaryLight}
      width={'100%'}
      height={'100%'}
      flex={1}
      padding={2}
      borderRadius={theme.controlBorderRadius.large}
    >
      <Text size="small">
        {format(event.startDate, TIME_FORMAT)} -{' '}
        {format(event.endDate, TIME_FORMAT)}
      </Text>
    </Box>
  );
};
