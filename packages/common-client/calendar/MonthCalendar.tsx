import { format, isSameDay } from 'date-fns';
import { Box, Text, useTheme } from 'paramount-ui';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DEFAULT_FIRST_DAY_OF_WEEK } from '@kedul/common-utils';

import { Interval, validateInterval } from './IntervalUtils';
import { getWeeksInMonth } from './MonthUtils';
import { FirstDayOfWeek } from './WeekUtils';

export const DEFAULT_MONTH_DAY_HEIGHT = 48;

export interface Day {
  date: Date;

  /** Is the date in the month within the current month */
  isCurrentMonth: boolean;

  /** Is it in the selection */
  isSelected: boolean;
  /** Is it the first item in the selection */
  isSelectedStart: boolean;
  /** Is it the last item in the selection */
  isSelectedEnd: boolean;
}

export interface Week {
  days: Day[];
  index: number;
}

export interface Month {
  weeks: Week[];
  month: Date;
}

interface MonthDayProps {
  date: Date;
  isSelected: boolean;
  isSelectionStart: boolean;
  isSelectionEnd: boolean;
  onSelect?: (date: Date) => void;
}

const MonthDay = (props: MonthDayProps) => {
  const {
    isSelected,
    isSelectionStart,
    isSelectionEnd,
    date,
    onSelect = () => null,
  } = props;
  const theme = useTheme();
  const isToday = isSameDay(new Date(), date);

  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 4,
        width: '100%',
      }}
      activeOpacity={isSelected ? 1 : 0.2}
      onPress={() => onSelect(date)}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor:
            isSelected && !isSelectionStart && !isSelectionEnd
              ? theme.colors.background.primaryDefault
              : 'transparent',
          flex: 1,
          flexDirection: 'row',
          height: DEFAULT_MONTH_DAY_HEIGHT - 4,
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {isSelectionStart && !isSelectionEnd && (
          <View
            style={{
              backgroundColor: theme.colors.background.primaryDefault,
              height: '100%',
              position: 'absolute',
              right: 0,
              width: '50%',
            }}
          />
        )}
        {isSelectionEnd && !isSelectionStart && (
          <View
            style={{
              backgroundColor: theme.colors.background.primaryDefault,
              height: '100%',
              left: 0,
              position: 'absolute',
              width: '50%',
            }}
          />
        )}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: isSelected
              ? theme.colors.background.primaryDefault
              : 'transparent',
            borderRadius: 999,
            height: DEFAULT_MONTH_DAY_HEIGHT - 4,
            justifyContent: 'center',
            width: DEFAULT_MONTH_DAY_HEIGHT - 4,
          }}
        >
          <Text color="default">{format(date, 'd')}</Text>
          {isToday && (
            <Box
              shape="circle"
              width={4}
              height={4}
              paddingTop={4}
              backgroundColor={isSelected ? 'white' : 'primaryDefault'}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export interface MonthBodyProps {
  month: Month;
  onSelect?: (date: Date) => void;
}

export const MonthBody = (props: MonthBodyProps) => {
  const { onSelect, month } = props;

  const theme = useTheme();

  return (
    <Box>
      {month.weeks.map(week => (
        <Box flexDirection="row" key={week.index}>
          {week.days.map(day => {
            const {
              date,
              isCurrentMonth,
              isSelected,
              isSelectedStart,
              isSelectedEnd,
            } = day;

            if (!isCurrentMonth) {
              return (
                <Box
                  flex={1}
                  justifyContent="center"
                  alignItems="flex-start"
                  key={date.toISOString()}
                  paddingVertical={4}
                  zIndex={-1}
                >
                  <Box
                    backgroundColor={
                      isSelected
                        ? theme.colors.background.primaryDefault
                        : 'transparent'
                    }
                    flex={1}
                    height={40}
                    width="100%"
                  />
                </Box>
              );
            }

            return (
              <Box
                flex={1}
                justifyContent="center"
                alignItems="flex-start"
                key={date.getTime()}
              >
                <MonthDay
                  onSelect={onSelect}
                  date={date}
                  isSelected={isSelected}
                  isSelectionStart={isSelectedStart}
                  isSelectionEnd={isSelectedEnd}
                />
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export interface MonthCalendarProps {
  onSelect?: (date: Date) => void;
  date?: Date;
  selectedInterval?: Interval;
  firstDayOfWeek?: FirstDayOfWeek;
}

export const MonthCalendar = (props: MonthCalendarProps) => {
  const {
    date = new Date(),
    firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
    onSelect,
    selectedInterval,
  } = props;

  if (selectedInterval) validateInterval(selectedInterval);

  const month = getWeeksInMonth(date, firstDayOfWeek, selectedInterval);

  return (
    <Box flex={1} width="100%">
      <MonthBody onSelect={onSelect} month={month} />
    </Box>
  );
};
