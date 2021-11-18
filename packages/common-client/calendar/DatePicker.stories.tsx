import { storiesOf } from '@storybook/react';
import React from 'react';

import { DatePicker } from './DatePicker';
import { Interval } from './IntervalUtils';

const Example = () => {
  const [value, setValue] = React.useState<Interval | null>(null);

  return <DatePicker useInterval value={value} onValueChange={setValue} />;
};

storiesOf('DatePicker', module).add('Default', () => <Example />);
