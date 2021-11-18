import { format, roundToNearestMinutes } from 'date-fns';
import React from 'react';
import { TIME_FORMAT } from '@kedul/common-utils';

import { ConfirmDialog } from '../common';
import { PickerButton } from '../common/PickerButton';
import { useI18n } from '../i18n';

import { TimeWheelPicker } from './TimeWheelPicker';

interface TimePickerProps {
  value?: Date | null;
  onValueChange?: (value: Date) => void;
  step?: number;
}

export const TimePicker = (props: TimePickerProps) => {
  const {
    value: initialValue = null,
    onValueChange = () => {},
    step = 5,
  } = props;
  const i18n = useI18n();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [value, setValue] = React.useState<Date | null>(
    initialValue
      ? roundToNearestMinutes(initialValue, { nearestTo: step })
      : null,
  );

  const handleClose = React.useCallback(() => {
    setIsDialogOpen(false);

    setValue(
      initialValue
        ? roundToNearestMinutes(initialValue, { nearestTo: step })
        : null,
    );
  }, [initialValue, step]);

  const handleSubmit = React.useCallback(() => {
    setIsDialogOpen(false);

    if (!value) throw new Error('Expected value on TimePicker submission');

    onValueChange(value);
  }, [onValueChange, value]);

  const handleOpen = React.useCallback(() => {
    if (!value) {
      setValue(roundToNearestMinutes(new Date(), { nearestTo: step }));
    }

    setIsDialogOpen(true);
  }, [step, value]);

  return (
    <>
      <ConfirmDialog
        isVisible={isDialogOpen}
        onRequestClose={handleClose}
        onConfirm={handleSubmit}
        title={i18n.t('Select time')}
      >
        {value && (
          <TimeWheelPicker onValueChange={setValue} value={value} step={step} />
        )}
      </ConfirmDialog>
      <PickerButton
        onPress={handleOpen}
        title={value ? `${format(value, TIME_FORMAT)}` : i18n.t('Select time')}
      />
    </>
  );
};
