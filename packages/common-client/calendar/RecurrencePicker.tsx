import {
  CalendarEventRecurrenceFrequency,
  CalendarEventRecurrenceInput,
} from '@kedul/common-utils';
import { addMonths, format, getDay, endOfDay } from 'date-fns';
import { useFormik } from 'formik';
import {
  Box,
  Checkbox,
  Container,
  Counter,
  FormField,
  Text,
  TextInput,
} from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { ConfirmModal } from '../common/Modals';
import { PickerButton } from '../common/PickerButton';
import { SegmentedPicker } from '../common/SegmentedPicker';
import { useI18n } from '../i18n';

import { DatePicker } from './DatePicker';
import { eachDayOfWeek } from './WeekUtils';
import { formatRecurrence } from './RecurrenceUtils';

interface IntervalInputProps {
  value?: number | null;
  onValueChange?: (value: number) => void;
}

const IntervalInput = (props: IntervalInputProps) => {
  const { value = 1, onValueChange = () => {} } = props;

  return <Counter value={value || 1} min={1} onValueChange={onValueChange} />;
};

interface FrequencyInputProps {
  value?: CalendarEventRecurrenceFrequency | null;
  onValueChange?: (value: CalendarEventRecurrenceFrequency) => void;
}

const FrequencyInput = (props: FrequencyInputProps) => {
  const {
    value = CalendarEventRecurrenceFrequency.WEEKLY,
    onValueChange = () => {},
  } = props;
  const i18n = useI18n();

  const frequencyText = {
    [CalendarEventRecurrenceFrequency.YEARLY]: i18n.t('Year'),
    [CalendarEventRecurrenceFrequency.MONTHLY]: i18n.t('Month'),
    [CalendarEventRecurrenceFrequency.WEEKLY]: i18n.t('Week'),
    [CalendarEventRecurrenceFrequency.DAILY]: i18n.t('Day'),
  };

  return (
    <SegmentedPicker
      value={value || CalendarEventRecurrenceFrequency.WEEKLY}
      data={Object.values(CalendarEventRecurrenceFrequency)
        .reverse()
        .map((val: CalendarEventRecurrenceFrequency) => ({
          label: frequencyText[val],
          value: val,
        }))}
      onValueChange={onValueChange}
    />
  );
};

interface WeekDaysInputProps {
  value?: number[] | null;
  onValueChange?: (value: number[]) => void;
}

const WeekDaysInput = (props: WeekDaysInputProps) => {
  const { value = [new Date().getDay()], onValueChange = () => {} } = props;

  return (
    <SegmentedPicker
      isMulti
      size="small"
      value={value || []}
      data={eachDayOfWeek().map(date => ({
        label: format(date, 'EEEEE'),
        value: getDay(date),
      }))}
      onValueChange={onValueChange}
    />
  );
};

type SelectedEnd = 'never' | 'date' | 'count';

interface RecurrenceEndInputProps {
  selectedEnd: SelectedEnd;
  count: number | null;
  until: Date | null;
  onChangeCount: (count: number) => void;
  onChangeDate: (date: Date) => void;
  onSelectEnd: (selectedEnd: SelectedEnd) => void;
}

const RowWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      paddingVertical={8}
    >
      {children}
    </Box>
  );
};

const RecurrenceEndInput = (props: RecurrenceEndInputProps) => {
  const {
    count,
    until,
    selectedEnd,
    onChangeCount,
    onChangeDate,
    onSelectEnd,
  } = props;
  const i18n = useI18n();

  return (
    <>
      <RowWrapper>
        <Text color={selectedEnd === 'never' ? 'default' : 'muted'}>
          {i18n.t('Never')}
        </Text>
        <Checkbox
          shape="circle"
          value={selectedEnd === 'never'}
          onValueChange={() => {
            onSelectEnd('never');
          }}
        />
      </RowWrapper>
      <RowWrapper>
        <Box flexDirection="row" alignItems="center">
          <Text color={selectedEnd === 'date' ? 'default' : 'muted'}>
            {i18n.t('On')}
          </Text>
          <Box paddingHorizontal={8}>
            <DatePicker
              isDisabled={selectedEnd !== 'date'}
              useInterval={false}
              value={until}
              onValueChange={date => onChangeDate(date)}
            />
          </Box>
        </Box>
        <Checkbox
          shape="circle"
          value={selectedEnd === 'date'}
          onValueChange={() => {
            onSelectEnd('date');
          }}
        />
      </RowWrapper>
      <RowWrapper>
        <Box flexDirection="row" alignItems="center">
          <Text color={selectedEnd === 'count' ? 'default' : 'muted'}>
            {i18n.t('After')}
          </Text>
          <Box paddingHorizontal={8}>
            <TextInput
              keyboardType="number-pad"
              isDisabled={selectedEnd !== 'count'}
              value={`${count}` || '1'}
              onValueChange={count => onChangeCount(Number(count))}
              overrides={{
                Input: {
                  style: {
                    width: 56,
                    textAlign: 'center',
                  },
                },
              }}
            />
          </Box>
          <Text color={selectedEnd === 'count' ? 'default' : 'muted'}>
            {i18n.t('times')}
          </Text>
        </Box>
        <Checkbox
          shape="circle"
          value={selectedEnd === 'count'}
          onValueChange={() => {
            onSelectEnd('count');
          }}
        />
      </RowWrapper>
    </>
  );
};

export interface RecurrencePickerProps {
  value?: CalendarEventRecurrenceInput | null;
  initialValues?: Partial<CalendarEventRecurrenceInput>;
  onValueChange?: (value: CalendarEventRecurrenceInput) => void;
}

export const RecurrencePicker = (props: RecurrencePickerProps) => {
  const { value, initialValues = {}, onValueChange = () => {} } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedEnd, setSelectedEnd] = React.useState<SelectedEnd>(
    value ? (value.count ? 'count' : value.until ? 'date' : 'never') : 'never',
  );

  const { values, submitForm, setFieldValue, resetForm } = useFormik({
    initialValues: {
      frequency:
        (value && value.frequency) ||
        initialValues.frequency ||
        CalendarEventRecurrenceFrequency.WEEKLY,
      interval: (value && value.interval) || initialValues.interval || 1,
      count: (value && value.count) || initialValues.count || 1,
      until: endOfDay(initialValues.until || addMonths(new Date(), 1)),
      byWeekDay: (value && value.byWeekDay) ||
        initialValues.byWeekDay || [new Date().getDay()],
    },

    onSubmit: values => {
      const { frequency, interval, count, until, byWeekDay } = values;

      onValueChange({
        frequency,
        interval,
        count: selectedEnd === 'count' ? count : null,
        until: selectedEnd === 'date' ? endOfDay(until) : null,
        byWeekDay,
      });

      setIsModalOpen(false);
    },
  });

  const handleClose = React.useCallback(() => {
    setIsModalOpen(false);

    resetForm();
  }, [resetForm]);

  return (
    <>
      <ConfirmModal
        onConfirm={submitForm}
        isVisible={isModalOpen}
        onRequestClose={handleClose}
      >
        <ScrollView>
          <Container>
            <Box paddingBottom={24}>
              <FormField label={i18n.t('Repeats every')}>
                <IntervalInput
                  value={values.interval}
                  onValueChange={interval => {
                    setFieldValue('interval', interval);
                  }}
                />
                <Box height={8} />
                <FrequencyInput
                  value={values.frequency}
                  onValueChange={frequency => {
                    if (frequency !== CalendarEventRecurrenceFrequency.WEEKLY) {
                      setFieldValue('byWeekDay', null);
                    }
                    if (frequency === CalendarEventRecurrenceFrequency.WEEKLY) {
                      setFieldValue('byWeekDay', [new Date().getDay()]);
                    }
                    setFieldValue('frequency', frequency);
                  }}
                />
              </FormField>
              {values.frequency === CalendarEventRecurrenceFrequency.WEEKLY && (
                <FormField label={i18n.t('Repeats on')}>
                  <WeekDaysInput
                    value={values.byWeekDay}
                    onValueChange={weekDays => {
                      setFieldValue('byWeekDay', weekDays);
                    }}
                  />
                </FormField>
              )}
              <FormField label={i18n.t('Ends')}>
                <RecurrenceEndInput
                  selectedEnd={selectedEnd}
                  count={values.count}
                  until={values.until}
                  onChangeCount={count => setFieldValue('count', count)}
                  onChangeDate={date => setFieldValue('until', date)}
                  onSelectEnd={setSelectedEnd}
                />
              </FormField>
            </Box>
          </Container>
        </ScrollView>
      </ConfirmModal>
      <PickerButton
        onPress={() => setIsModalOpen(true)}
        title={
          value ? formatRecurrence(i18n, values) : i18n.t('Does not repeat')
        }
      />
    </>
  );
};
