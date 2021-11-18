import { addMinutes, format, getHours, getMinutes, startOfDay } from 'date-fns';
import React from 'react';
import {
  DURATION_FORMAT,
  DURATION_HOUR_FORMAT,
  DURATION_MINUTE_FORMAT,
} from '@kedul/common-utils';

import { ConfirmDialog } from '../common';
import { PickerButton } from '../common/PickerButton';
import { useI18n } from '../i18n';

import { TimeWheelPicker } from './TimeWheelPicker';

interface DurationPickerProps {
  /** Duration in minutes */
  value?: number | null;
  onValueChange?: (value: number) => void;
  step?: number;
}

export const DurationPicker = (props: DurationPickerProps) => {
  const {
    value: initialValue = null,
    onValueChange = () => {},
    step = 5,
  } = props;
  const i18n = useI18n();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [value, setValue] = React.useState<number | null>(initialValue);

  const handleClose = React.useCallback(() => {
    setIsDialogOpen(false);

    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = React.useCallback(() => {
    setIsDialogOpen(false);

    if (!value) throw new Error('Expected value on DurationPicker submission');

    onValueChange(value);
  }, [onValueChange, value]);

  const handleOpen = React.useCallback(() => {
    if (!value) setValue(60);

    setIsDialogOpen(true);
  }, [value]);

  const handleValueChange = React.useCallback((date: Date) => {
    const minutes = getHours(date) * 60 + getMinutes(date);

    setValue(minutes);
  }, []);

  return (
    <>
      <ConfirmDialog
        isVisible={isDialogOpen}
        onRequestClose={handleClose}
        onConfirm={handleSubmit}
        title={i18n.t('Select duration')}
      >
        {typeof value === 'number' && (
          <TimeWheelPicker
            onValueChange={handleValueChange}
            value={addMinutes(startOfDay(new Date()), value)}
            step={step}
            hourFormat={DURATION_HOUR_FORMAT}
            minuteFormat={DURATION_MINUTE_FORMAT}
          />
        )}
      </ConfirmDialog>
      <PickerButton
        onPress={handleOpen}
        title={
          value
            ? `${format(
                addMinutes(startOfDay(new Date()), value),
                DURATION_FORMAT,
              )}`
            : i18n.t('Select duration')
        }
      />
    </>
  );
};
