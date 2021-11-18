import { addMonths, format, isBefore, isSameDay } from 'date-fns';
import { Box, Button, Container, Spacing, Heading } from 'paramount-ui';
import { DATE_SHORT_FORMAT } from '@kedul/common-utils';
import React from 'react';
import { ScrollView } from 'react-native';

import { ConfirmModal } from '../common/Modals';
import { ErrorText } from '../common/ErrorText';
import { PickerButton } from '../common/PickerButton';
import { useI18n } from '../i18n';

import { isInterval, Interval } from './IntervalUtils';
import { MultiMonthCalendar } from './MultiMonthCalendar';
import { WeekDates } from './WeekDates';
import { FirstDayOfWeek } from './WeekUtils';

interface MonthCalendarHeaderProps {
  value: Date | Interval | null;
}

const hasSelectedEndDate = (interval: Interval) => {
  return !isSameDay(interval.start, interval.end);
};

const MonthCalendarHeader = (props: MonthCalendarHeaderProps) => {
  const { value = null } = props;
  const i18n = useI18n();

  if (isInterval(value)) {
    return (
      <Box flexDirection="row">
        <Box flex={1}>
          <Heading color={value.start ? 'default' : 'muted'}>
            {value.start
              ? format(value.start, DATE_SHORT_FORMAT)
              : i18n.t('Start date')}
          </Heading>
        </Box>
        <Box flex={1}>
          <Heading color={hasSelectedEndDate(value) ? 'default' : 'muted'}>
            {hasSelectedEndDate(value)
              ? format(value.end, DATE_SHORT_FORMAT)
              : i18n.t('End date')}
          </Heading>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="row">
      <Box flex={1}>
        <Heading color={value ? 'default' : 'muted'} size="large">
          {value ? format(value, DATE_SHORT_FORMAT) : i18n.t('Select date')}
        </Heading>
      </Box>
    </Box>
  );
};

export type DatePickerValue<
  TUseInterval extends boolean
> = TUseInterval extends true ? Interval : Date;

export interface DatePickerProps<TUseInterval extends boolean> {
  value?: DatePickerValue<TUseInterval> | null;
  firstDayOfWeek?: FirstDayOfWeek;

  isDisabled?: boolean;
  useInterval?: TUseInterval;
  initialStartMonthDate?: Date;
  initialEndMonthDate?: Date;

  onValueChange?: (value: DatePickerValue<TUseInterval>) => void;
}

export const DatePicker = <TUseInterval extends boolean>(
  props: DatePickerProps<TUseInterval>,
) => {
  const {
    value: initialValue = null,
    useInterval = false,
    isDisabled = false,
    onValueChange = () => {},
    firstDayOfWeek,
    initialStartMonthDate = new Date(),
    initialEndMonthDate = addMonths(new Date(), 3),
  } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [endMonthDate, setEndMonthDate] = React.useState(initialEndMonthDate);
  const [error, setError] = React.useState<string | null>(null);
  const [value, setValue] = React.useState<Date | Interval | null>(
    initialValue,
  );

  const handleSelect = React.useCallback(
    (date: Date) => {
      setError(null);

      if (useInterval) {
        if (isInterval(value)) {
          if (isBefore(date, value.start)) {
            setValue({ start: date, end: date });
          } else if (!hasSelectedEndDate(value)) {
            setValue({ start: value.start, end: date });
          } else {
            setValue({ start: date, end: date });
          }
        } else {
          setValue({ start: date, end: date });
        }
      } else {
        setValue(date);
      }
    },
    [useInterval, value],
  );

  const handleClose = React.useCallback(() => {
    setIsModalOpen(false);

    setValue(initialValue);
  }, [initialValue, setIsModalOpen]);

  const handleSubmit = React.useCallback(() => {
    if (value) {
      if (isInterval(value) && !hasSelectedEndDate(value)) {
        setError(i18n.t('Please select end date') as string);
      } else {
        setIsModalOpen(false);
        onValueChange(value as DatePickerValue<TUseInterval>);
      }
    } else {
      setError(i18n.t('Please select date') as string);
    }
  }, [i18n, onValueChange, value]);

  return (
    <>
      <ConfirmModal
        onConfirm={handleSubmit}
        isVisible={isModalOpen}
        onRequestClose={handleClose}
      >
        <Container>
          <Spacing size="small" />
          <MonthCalendarHeader value={value} />
          <Spacing />
          <WeekDates />
          <Spacing />
          {error && (
            <Box justifyContent="center" height="100%">
              <ErrorText>{error}</ErrorText>
            </Box>
          )}
        </Container>
        <ScrollView>
          <Container>
            <Box paddingBottom={24}>
              <MultiMonthCalendar
                selectedInterval={
                  value !== null
                    ? isInterval(value)
                      ? value
                      : { start: value, end: value }
                    : null
                }
                displayedInterval={{
                  start: initialStartMonthDate,
                  end: endMonthDate,
                }}
                firstDayOfWeek={firstDayOfWeek}
                onSelect={handleSelect}
              />
              <Box paddingTop={24}>
                <Button
                  onPress={() => setEndMonthDate(addMonths(endMonthDate, 2))}
                  title={i18n.t('Expand')}
                  appearance="minimal"
                  color="primary"
                />
              </Box>
            </Box>
          </Container>
        </ScrollView>
      </ConfirmModal>
      <PickerButton
        isDisabled={isDisabled}
        onPress={() => setIsModalOpen(true)}
        title={
          value
            ? isInterval(value)
              ? `${format(value.start, DATE_SHORT_FORMAT)} - ${format(
                  value.end,
                  DATE_SHORT_FORMAT,
                )}`
              : `${format(value, DATE_SHORT_FORMAT)}`
            : i18n.t('Select dates')
        }
      />
    </>
  );
};
