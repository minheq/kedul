import { format, getHours, getMinutes, setHours, setMinutes } from 'date-fns';
import { Box, WheelPicker } from 'paramount-ui';
import React from 'react';
import { TIME_HOUR_FORMAT, TIME_MINUTE_FORMAT } from '@kedul/common-utils';

import { getHoursInDay, getMinutesInHour } from './TimeUtils';

interface TimeWheelPickerProps {
  value?: Date;
  onValueChange?: (value: Date) => void;
  step?: number;
  hourFormat?: string;
  minuteFormat?: string;
}

export const TimeWheelPicker = (props: TimeWheelPickerProps) => {
  const {
    value = new Date(),
    onValueChange = () => {},
    step = 5,
    hourFormat = TIME_HOUR_FORMAT,
    minuteFormat = TIME_MINUTE_FORMAT,
  } = props;

  const hoursOptions = getHoursInDay(value).map(hour => ({
    value: setMinutes(hour, getMinutes(value)).getTime(),
    label: format(hour, hourFormat),
  }));

  const minutesOptions = getMinutesInHour(value).map(
    minute => ({
      value: setHours(minute, getHours(value)).getTime(),
      label: format(minute, minuteFormat),
    }),
    step,
  );

  const dateValue = value.getTime();

  return (
    <Box flexDirection="row">
      <WheelPicker
        value={dateValue}
        onValueChange={date => {
          if (date === dateValue) return;

          const hour = getHours(date);
          onValueChange(setHours(value, hour));
        }}
        data={hoursOptions}
      />
      <WheelPicker
        value={dateValue}
        onValueChange={date => {
          if (date === dateValue) return;

          const minute = getMinutes(date);
          onValueChange(setMinutes(value, minute));
        }}
        data={minutesOptions}
      />
    </Box>
  );
};
