import { storiesOf } from '@storybook/react';
import React from 'react';

import { DateNavigation } from './DateNavigation';
import { getWeekInterval } from './WeekUtils';
import { Interval } from './IntervalUtils';

const IntervalExample = () => {
  const [value, setValue] = React.useState<Interval>(
    getWeekInterval(new Date()),
  );

  return <DateNavigation useInterval value={value} onValueChange={setValue} />;
};

const DateExample = () => {
  const [value, setValue] = React.useState<Date>(new Date());

  return (
    <DateNavigation
      useInterval={false}
      value={value}
      onValueChange={setValue}
    />
  );
};

storiesOf('DateNavigation', module)
  .add('Interval', () => <IntervalExample />)
  .add('Date', () => <DateExample />);
