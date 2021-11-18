import { storiesOf } from '@storybook/react';
import { isBefore, isSameDay } from 'date-fns';
import React from 'react';

import { MonthCalendar } from './MonthCalendar';

const Example = () => {
  const [state, setState] = React.useState<{
    selectedStartDate: Date | null;
    selectedEndDate: Date | null;
  }>({ selectedStartDate: null, selectedEndDate: null });
  const { selectedStartDate, selectedEndDate } = state;

  const handleSelect = React.useCallback(
    date => {
      if (!selectedStartDate && !selectedEndDate) {
        setState({
          selectedStartDate: date,
          selectedEndDate: null,
        });
      } else if (selectedStartDate && !selectedEndDate) {
        if (isBefore(date, selectedStartDate)) {
          setState({
            selectedStartDate: date,
            selectedEndDate: null,
          });
        } else if (!isSameDay(selectedStartDate, date)) {
          setState({
            selectedStartDate,
            selectedEndDate: date,
          });
        }
      } else {
        setState({
          selectedStartDate: date,
          selectedEndDate: null,
        });
      }
    },
    [selectedEndDate, selectedStartDate],
  );

  return (
    <MonthCalendar
      selectedInterval={
        selectedStartDate
          ? {
              start: selectedStartDate,
              end: selectedEndDate || selectedStartDate,
            }
          : undefined
      }
      // MUST SEE https://github.com/facebook/react/issues/14972
      onSelect={handleSelect}
    />
  );
};

storiesOf('MonthCalendar', module).add('Default', () => <Example />);
