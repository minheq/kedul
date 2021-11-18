import { storiesOf } from '@storybook/react';
import React from 'react';
import { CalendarEventRecurrenceInput } from '@kedul/common-utils';

import { RecurrencePicker } from './RecurrencePicker';

const Example = () => {
  const [value, setValue] = React.useState<CalendarEventRecurrenceInput | null>(
    null,
  );

  return <RecurrencePicker value={value} onValueChange={setValue} />;
};

storiesOf('RecurrencePicker', module).add('Default', () => <Example />);
