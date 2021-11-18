import { storiesOf } from '@storybook/react';
import { addMonths, isAfter, isBefore, subMonths } from 'date-fns';
import React from 'react';

import { MultiMonthCalendar } from './MultiMonthCalendar';

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
        } else if (isAfter(date, selectedStartDate)) {
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
    <MultiMonthCalendar
      selectedInterval={
        selectedStartDate
          ? {
              start: selectedStartDate,
              end: selectedEndDate || selectedStartDate,
            }
          : undefined
      }
      displayedInterval={{
        start: subMonths(new Date(), 2),
        end: addMonths(new Date(), 2),
      }}
      onSelect={handleSelect}
    />
  );
};

storiesOf('MultiMonthCalendar', module).add('Default', () => <Example />);
