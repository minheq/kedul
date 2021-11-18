import {
  CalendarEventRecurrenceFrequency,
  CalendarEventRecurrenceInput,
  DATE_FORMAT,
} from '@kedul/common-utils';
import { format, setDay } from 'date-fns';

import { I18n } from '../i18n';

export const formatRecurrence = (
  i18n: I18n,
  recurrence: CalendarEventRecurrenceInput,
) => {
  const { interval, count, frequency, byWeekDay, until } = recurrence;
  const frequencyText = {
    [CalendarEventRecurrenceFrequency.YEARLY]: i18n.t('year'),
    [CalendarEventRecurrenceFrequency.MONTHLY]: i18n.t('month'),
    [CalendarEventRecurrenceFrequency.WEEKLY]: i18n.t('week'),
    [CalendarEventRecurrenceFrequency.DAILY]: i18n.t('day'),
  };

  return `${i18n.t('Every {{interval}} {{frequency}}', {
    interval,
    frequency: frequencyText[frequency],
  })}${
    frequency === CalendarEventRecurrenceFrequency.WEEKLY && byWeekDay
      ? `${i18n.t(' on {{weekDays}}', {
          weekDays: `${byWeekDay
            .map(weekDay => format(setDay(new Date(), weekDay), 'EEE'))
            .join(', ')}`,
        })}`
      : ''
  }${
    until
      ? ` ${i18n.t('until {{date}}', {
          date: `${format(until, DATE_FORMAT)}`,
        })}`
      : ''
  }${
    count
      ? `${i18n.t(' after {{count}} times', {
          count,
        })}`
      : ''
  }`;
};
