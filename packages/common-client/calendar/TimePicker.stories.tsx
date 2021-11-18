import { storiesOf } from '@storybook/react';
import React from 'react';

import { TimePicker } from './TimePicker';

const Example = () => {
  const [value, setValue] = React.useState<Date | null>(new Date());

  return <TimePicker value={value} onValueChange={setValue} />;
};

storiesOf('TimePicker', module).add('Default', () => <Example />);
