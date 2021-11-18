import { ListPicker } from 'paramount-ui';
import React from 'react';
import { useI18n, I18n } from '@kedul/common-client';

import { ApplyRecurrence } from '../generated/MutationsAndQueries';

interface ApplyRecurrencePickerProps {
  value: ApplyRecurrence;
  onValueChange: (value: ApplyRecurrence) => void;
  getLabel: (value: ApplyRecurrence, i18n: I18n) => string;
}

export const ApplyRecurrencePicker = (props: ApplyRecurrencePickerProps) => {
  const { value, onValueChange, getLabel } = props;
  const i18n = useI18n();

  return (
    <ListPicker
      value={value}
      onValueChange={onValueChange}
      data={Object.values(ApplyRecurrence).map(recurrence => ({
        value: recurrence,
        label: getLabel(recurrence, i18n),
      }))}
    />
  );
};
