import { format } from 'date-fns';
import { Box, Divider, Text, useLayout, useTheme } from 'paramount-ui';
import React from 'react';
import { Dimensions } from 'react-native';
import { MINUTES_IN_ONE_DAY, TIME_FORMAT } from '@kedul/common-utils';

import {
  toNewEvent,
  toVectors,
  validateEvents,
  toOriginalEvent,
} from './DaysCalendarUtils';
import { BlockProps, ColumnHeaderProps, Grid, Vector } from './Grid';
import { getHoursInDay } from './TimeUtils';

const LEFT_COLUMN_WIDTH = 48;
const MINIMUM_DAYS_VISIBLE = 3;
const MINIMUM_DAYS_VISIBLE_OFFSET = 24;

export interface AvailableTime {
  endDate: Date;
  startDate: Date;
}

export interface Day<TEvent extends Event> {
  key: string;
  date: Date;
  events: TEvent[];
}

export interface Event {
  startDate: Date;
  endDate: Date;
  id: string;
}

const Hours = () => {
  return (
    <Box width={LEFT_COLUMN_WIDTH}>
      {getHoursInDay().map((hour, index) => (
        <Box key={hour.getHours()} flex={1} marginTop={-10}>
          {index !== 0 && (
            <Text
              selectable={false}
              size="small"
              color="default"
              align="center"
            >
              {format(hour, TIME_FORMAT)}
            </Text>
          )}
        </Box>
      ))}
    </Box>
  );
};

const HourLines = () => {
  const theme = useTheme();
  return (
    <Box
      borderRightWidth={1}
      borderRightColor={theme.colors.border.default}
      flex={1}
    >
      {getHoursInDay().map((hour, index) => (
        <Box key={hour.getHours()} flex={1} testID="HOUR_LINE">
          {index !== 0 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};

const LeftTopCell = () => {
  const theme = useTheme();
  return <Box width={LEFT_COLUMN_WIDTH} />;
};

export interface EventProps<TEvent extends Event> {
  event: TEvent;
}

export interface DayHeaderProps<TEvent extends Event> {
  day: Day<TEvent>;
  minWidth: number;
}

export interface DaysCalendarProps<TEvent extends Event> {
  days?: Day<TEvent>[];
  currentDate?: Date;
  /** The interval between minutes */
  step?: number;
  onNew?: (event: Event, key: string) => void;
  onUpdate?: (
    prevEvent: TEvent,
    prevKey: string,
    nextEvent: TEvent,
    nextKey: string,
  ) => void;
  onPress?: (event: TEvent) => void;
  components: {
    Event: React.ComponentType<EventProps<TEvent>>;
    NewEvent: React.ComponentType<EventProps<Event>>;
    DayHeader: React.ComponentType<DayHeaderProps<TEvent>>;
  };
}

export const DaysCalendar = <TEvent extends Event>(
  props: DaysCalendarProps<TEvent>,
) => {
  const {
    days = [],
    step = 5,
    components,
    onNew = () => {},
    onUpdate = () => {},
    onPress = () => {},
  } = props;
  const { Event, NewEvent, DayHeader } = components;
  const { currentScreenSize } = useLayout();
  const [windowWidth, setWindowWidth] = React.useState(
    Dimensions.get('window').width,
  );

  validateEvents(days);

  const handleDimensionsChange = React.useCallback(() => {
    setWindowWidth(Dimensions.get('window').width);
  }, []);

  React.useLayoutEffect(() => {
    handleDimensionsChange();

    Dimensions.addEventListener('change', handleDimensionsChange);

    return () =>
      Dimensions.removeEventListener('change', handleDimensionsChange);
  }, [handleDimensionsChange]);

  const vectors = toVectors(days, step);
  const maxY = MINUTES_IN_ONE_DAY / step;

  const Block = ({ vector }: BlockProps) => {
    const event = toOriginalEvent(days, vector, maxY, step);

    return <Event event={event} />;
  };

  const NewBlock = ({ vector }: BlockProps) => {
    const event = toNewEvent(days, vector, maxY, step);

    return <NewEvent event={event} />;
  };

  const ColumnHeader = ({ x, minWidth }: ColumnHeaderProps) => {
    const day = days[x];

    return <DayHeader minWidth={minWidth} day={day} />;
  };

  const handleNew = React.useCallback(
    (vector: Vector) => {
      const event = toNewEvent(days, vector, maxY, step);
      const { key } = days[vector.x];

      onNew(event, key);
    },
    [days, step, onNew, maxY],
  );

  const handleUpdate = React.useCallback(
    (prevVector: Vector, nextVector: Vector) => {
      const prevEvent = toOriginalEvent(days, prevVector, maxY, step);
      const { key: prevKey } = days[prevVector.x];
      const nextEvent = toOriginalEvent(days, nextVector, maxY, step);
      const { key: nextKey } = days[nextVector.x];

      onUpdate(prevEvent, prevKey, nextEvent, nextKey);
    },
    [days, step, onUpdate, maxY],
  );

  const handlePress = React.useCallback(
    (vector: Vector) => {
      const event = toOriginalEvent(days, vector, step, maxY);

      onPress(event);
    },
    [days, step, maxY, onPress],
  );

  return (
    <Grid
      vectors={vectors}
      maxY={maxY}
      minHeight={MINUTES_IN_ONE_DAY}
      minColumnWidth={
        (currentScreenSize === 'large' || currentScreenSize === 'xlarge') &&
        vectors.length > MINIMUM_DAYS_VISIBLE
          ? (windowWidth - LEFT_COLUMN_WIDTH) / vectors.length
          : vectors.length > MINIMUM_DAYS_VISIBLE
          ? (windowWidth - LEFT_COLUMN_WIDTH - MINIMUM_DAYS_VISIBLE_OFFSET) /
            MINIMUM_DAYS_VISIBLE
          : (windowWidth - LEFT_COLUMN_WIDTH) / vectors.length
      }
      onNew={handleNew}
      onUpdate={handleUpdate}
      onPress={handlePress}
      components={{
        LeftColumn: Hours,
        Background: HourLines,
        LeftTopCell,
        Block,
        NewBlock,
        ColumnHeader,
      }}
    />
  );
};
