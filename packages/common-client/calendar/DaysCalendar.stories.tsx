import { storiesOf } from '@storybook/react';
import { format } from 'date-fns';
import { Box, Text, useTheme } from 'paramount-ui';
import React from 'react';
import uuid from 'uuid';
import { TIME_FORMAT } from '@kedul/common-utils';

import { AddText } from '../common';
import { useI18n } from '../i18n';

import {
  Event,
  EventProps,
  Day,
  DayHeaderProps,
  DaysCalendar,
} from './DaysCalendar';

const EventBlock = (props: EventProps<Event>) => {
  const { event } = props;
  const theme = useTheme();

  return (
    <Box
      backgroundColor={theme.colors.background.primaryLight}
      width={'100%'}
      height={'100%'}
      flex={1}
      padding={2}
      borderRadius={theme.controlBorderRadius.large}
    >
      <Text size="small">
        {format(event.startDate, TIME_FORMAT)} -{' '}
        {format(event.endDate, TIME_FORMAT)}
      </Text>
    </Box>
  );
};

const DayHeader = (props: DayHeaderProps<Event>) => {
  const { day } = props;
  const theme = useTheme();

  return (
    <Box backgroundColor={theme.colors.background.primaryLight} height="100%">
      <Text size="small">Day {day.key}</Text>
    </Box>
  );
};

const NewEvent = (props: EventProps<Event>) => {
  const i18n = useI18n();
  const theme = useTheme();

  return (
    <Box
      width="100%"
      height="100%"
      borderWidth={1}
      borderColor={theme.colors.border.primary}
      borderRadius={theme.controlBorderRadius.large}
      backgroundColor={theme.colors.background.content}
      elevation={1}
      padding={4}
    >
      <AddText size="small" color="link">
        {i18n.t('New event')}
      </AddText>
    </Box>
  );
};

interface DataProps {
  days: Day<Event>[];
  children: (props: {
    handleNew?: (event: Event, key: string) => void;
    handleUpdate?: (
      prevEvent: Event,
      prevKey: string,
      nextEvent: Event,
      nextKey: string,
    ) => void;
    handlePress?: (event: Event) => void;
    days: Day<Event>[];
  }) => any;
}

const Data = (props: DataProps) => {
  const { days: initialDays, children } = props;
  const [days, setDays] = React.useState(initialDays);

  const handleNew = React.useCallback(
    async (event: Event, key) => {
      const newDays = days.map(day => {
        let events = day.events;

        if (day.key === key) {
          events = events.concat({
            ...event,
            id: uuid(),
          });
        }

        return {
          ...day,
          events,
        };
      });

      setDays(newDays);
    },
    [days],
  );

  const handleUpdate = React.useCallback(
    async (
      prevEvent: Event,
      prevKey: string,
      nextEvent: Event,
      nextKey: string,
    ) => {
      const newDays = days.map(day => {
        let events = day.events;

        if (day.key === prevKey) {
          events = events.filter(c => c.id !== prevEvent.id);
        }

        if (day.key === nextKey) {
          events = events.concat(nextEvent);
        }

        return {
          ...day,
          events,
        };
      });

      setDays(newDays);
    },
    [days],
  );

  const handlePress = React.useCallback((event: Event) => {
    console.log(event);
  }, []);

  return children({ days, handleNew, handlePress, handleUpdate });
};

storiesOf('DaysCalendar', module)
  .add('Set One', () => (
    <Data
      days={[
        {
          key: '1',
          date: new Date(2018, 6, 29),
          events: [
            {
              endDate: new Date(2018, 6, 29, 23, 15, 0),
              id: '1',
              startDate: new Date(2018, 6, 29, 11, 0, 0),
            },
            {
              endDate: new Date(2018, 6, 29, 13, 15, 0),
              id: '2',
              startDate: new Date(2018, 6, 29, 11, 0, 0),
            },
            {
              endDate: new Date(2018, 6, 29, 2, 15, 0),
              id: '3',
              startDate: new Date(2018, 6, 29, 1, 0, 0),
            },
          ],
        },
        {
          key: '2',
          date: new Date(2018, 6, 30),
          events: [
            {
              endDate: new Date(2018, 6, 30, 2, 15, 0),
              id: '4',
              startDate: new Date(2018, 6, 30, 1, 0, 0),
            },
            {
              endDate: new Date(2018, 6, 30, 13, 15, 0),
              id: '5',
              startDate: new Date(2018, 6, 30, 11, 0, 0),
            },
          ],
        },
      ]}
    >
      {({ handleNew, handlePress, handleUpdate, days }) => (
        <DaysCalendar
          currentDate={new Date(2018, 6, 31, 6, 23)}
          days={days}
          components={{
            Event: EventBlock,
            NewEvent,
            DayHeader,
          }}
          onNew={handleNew}
          onUpdate={handleUpdate}
          onPress={handlePress}
        />
      )}
    </Data>
  ))
  .add('Set Two', () => (
    <Data
      days={[
        {
          key: '1',
          date: new Date(2018, 6, 31),
          events: [
            {
              endDate: new Date(2018, 6, 31, 11, 15, 0),
              id: '1',
              startDate: new Date(2018, 6, 31, 5, 15, 0),
            },
            {
              endDate: new Date(2018, 6, 31, 13, 15, 0),
              id: '2',
              startDate: new Date(2018, 6, 31, 11, 0, 0),
            },
            {
              endDate: new Date(2018, 6, 31, 23, 45, 0),
              id: '3',
              startDate: new Date(2018, 6, 31, 13, 45, 0),
            },
            {
              endDate: new Date(2018, 6, 31, 23, 45, 0),
              id: '4',
              startDate: new Date(2018, 6, 31, 15, 45, 0),
            },
            {
              endDate: new Date(2018, 6, 31, 23, 45, 0),
              id: '5',
              startDate: new Date(2018, 6, 31, 18, 0, 0),
            },
            {
              endDate: new Date(2018, 6, 31, 21, 30, 0),
              id: '6',
              startDate: new Date(2018, 6, 31, 20, 30, 0),
            },
            {
              endDate: new Date(2018, 6, 31, 23, 30, 0),
              id: '7',
              startDate: new Date(2018, 6, 31, 22, 30, 0),
            },
            {
              endDate: new Date(2018, 6, 31, 7, 45, 0),
              id: '8',
              startDate: new Date(2018, 6, 31, 0, 45, 0),
            },
            {
              endDate: new Date(2018, 6, 31, 4, 45, 0),
              id: '9',
              startDate: new Date(2018, 6, 31, 2, 0, 0),
            },
            {
              endDate: new Date(2018, 6, 31, 11, 30, 0),
              id: '10',
              startDate: new Date(2018, 6, 31, 5, 30, 0),
            },
            {
              endDate: new Date(2018, 6, 31, 13, 30, 0),
              id: '11',
              startDate: new Date(2018, 6, 31, 10, 30, 0),
            },
          ],
        },
      ]}
    >
      {({ handleNew, handlePress, handleUpdate, days }) => (
        <DaysCalendar
          currentDate={new Date(2018, 6, 31, 6, 23)}
          days={days}
          components={{
            Event: EventBlock,
            NewEvent,
            DayHeader,
          }}
          onNew={handleNew}
          onUpdate={handleUpdate}
          onPress={handlePress}
        />
      )}
    </Data>
  ))
  .add('Set Three', () => (
    <Data
      days={[
        {
          key: '1',
          date: new Date(2018, 6, 31),
          events: [
            {
              endDate: new Date(2018, 6, 31, 11, 15, 0),
              id: '1',
              startDate: new Date(2018, 6, 31, 5, 15, 0),
            },
          ],
        },
        {
          key: '2',
          date: new Date(2018, 6, 31),
          events: [
            {
              endDate: new Date(2018, 6, 31, 13, 15, 0),
              id: '2',
              startDate: new Date(2018, 6, 31, 11, 0, 0),
            },
          ],
        },
        {
          key: '3',
          date: new Date(2018, 6, 31),
          events: [
            {
              endDate: new Date(2018, 6, 31, 23, 45, 0),
              id: '3',
              startDate: new Date(2018, 6, 31, 13, 45, 0),
            },
          ],
        },
        {
          key: '4',
          date: new Date(2018, 6, 31),
          events: [
            {
              endDate: new Date(2018, 6, 31, 23, 45, 0),
              id: '4',
              startDate: new Date(2018, 6, 31, 15, 45, 0),
            },
          ],
        },
        {
          key: '5',
          date: new Date(2018, 6, 31),
          events: [
            {
              endDate: new Date(2018, 6, 31, 23, 45, 0),
              id: '5',
              startDate: new Date(2018, 6, 31, 18, 0, 0),
            },
          ],
        },
        {
          key: '6',
          date: new Date(2018, 6, 31),
          events: [
            {
              endDate: new Date(2018, 6, 31, 21, 30, 0),
              id: '6',
              startDate: new Date(2018, 6, 31, 20, 30, 0),
            },
          ],
        },
        {
          key: '7',
          date: new Date(2018, 6, 31),
          events: [
            {
              endDate: new Date(2018, 6, 31, 23, 30, 0),
              id: '7',
              startDate: new Date(2018, 6, 31, 22, 30, 0),
            },
          ],
        },
        {
          key: '8',
          date: new Date(2018, 6, 31),
          events: [
            {
              endDate: new Date(2018, 6, 31, 7, 45, 0),
              id: '8',
              startDate: new Date(2018, 6, 31, 0, 45, 0),
            },
          ],
        },
        {
          key: '9',
          date: new Date(2018, 6, 31),
          events: [
            {
              endDate: new Date(2018, 6, 31, 4, 45, 0),
              id: '9',
              startDate: new Date(2018, 6, 31, 2, 0, 0),
            },
          ],
        },
        {
          key: '10',
          date: new Date(2018, 6, 31),
          events: [
            {
              endDate: new Date(2018, 6, 31, 11, 30, 0),
              id: '10',
              startDate: new Date(2018, 6, 31, 5, 30, 0),
            },
          ],
        },
        {
          key: '11',
          date: new Date(2018, 6, 31),
          events: [
            {
              endDate: new Date(2018, 6, 31, 13, 30, 0),
              id: '11',
              startDate: new Date(2018, 6, 31, 10, 30, 0),
            },
          ],
        },
      ]}
    >
      {({ handleNew, handlePress, handleUpdate, days }) => (
        <DaysCalendar
          currentDate={new Date(2018, 6, 31, 6, 23)}
          days={days}
          components={{
            Event: EventBlock,
            NewEvent,
            DayHeader,
          }}
          onNew={handleNew}
          onUpdate={handleUpdate}
          onPress={handlePress}
        />
      )}
    </Data>
  ));
