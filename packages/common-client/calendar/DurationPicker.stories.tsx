import { storiesOf } from '@storybook/react';
import React from 'react';

import { DurationPicker } from './DurationPicker';

const Example = () => {
  const [value, setValue] = React.useState(0);

  return <DurationPicker value={value} onValueChange={setValue} />;
};

storiesOf('DurationPicker', module).add('Default', () => <Example />);
