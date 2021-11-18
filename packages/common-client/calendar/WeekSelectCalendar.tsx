import { format, isSameDay, isSameMonth } from 'date-fns';
import { Box, Text, useTheme } from 'paramount-ui';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DEFAULT_FIRST_DAY_OF_WEEK } from '@kedul/common-utils';

import { Day } from './MonthCalendar';
import { getWeeksInMonth } from './MonthUtils';
import { FirstDayOfWeek } from './WeekUtils';

export interface WeekSelectDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isCurrentWeek: boolean;
  isCurrentDay: boolean;
}

export const WeekSelectDay = (props: WeekSelectDayProps) => {
  const { isCurrentDay, isCurrentMonth, isCurrentWeek, date } = props;
  const theme = useTheme();

  return (
    <Box
      width="100%"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      padding={8}
    >
      {isCurrentMonth && (
        <Box
          backgroundColor={
            isCurrentDay
              ? theme.colors.background.primaryDefault
              : 'transparent'
          }
          width={30}
          height={30}
          justifyContent="center"
          alignItems="center"
          shape="circle"
        >
          <Text color={isCurrentDay || isCurrentWeek ? 'plain' : 'default'}>
            {format(date, 'd')}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export interface WeekSelectHeaderProps {
  days: Day[];
}

export const WeekSelectHeader = (props: WeekSelectHeaderProps) => {
  const { days } = props;

  return (
    <Box flexDirection="row">
      <Box flex={1} flexDirection="row">
        {days.map(day => {
          return (
            <Box
              key={day.date.getTime()}
              flex={1}
              justifyContent="center"
              alignItems="center"
              padding={8}
            >
              <Text color="muted">{format(day.date, 'dd')}</Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export interface WeekSelectCalendarProps {
  /** Date to which display its month for and the week */
  date: Date;
  /** Date highlighted in the calendar */
  currentDate?: Date;
  firstDayOfWeek?: FirstDayOfWeek;
  onPressWeek?: (date: Date) => void;
}

export const WeekSelectCalendar = (props: WeekSelectCalendarProps) => {
  const {
    date,
    currentDate = new Date(),
    firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
    onPressWeek = () => null,
  } = props;
  const theme = useTheme();

  const month = getWeeksInMonth(date, firstDayOfWeek);

  return (
    // @ts-ignore
    <Box flex={1} width="100%" userSelect="none">
      <WeekSelectHeader days={month.weeks[0].days} />
      {month.weeks.map(week => {
        const isCurrentWeek = week.days.some(day => isSameDay(day.date, date));

        return (
          <TouchableOpacity
            key={week.index}
            disabled={isCurrentWeek}
            style={{
              borderColor: 'transparent',
              borderRadius: theme.controlBorderRadius.medium,
              borderWidth: 1,
              flexDirection: 'row',
              ...(isCurrentWeek && {
                backgroundColor: theme.colors.background.primaryDark,
                borderColor: theme.colors.border.primary,
              }),
            }}
            onPress={() =>
              // Monday if last week, Sunday if first week
              // So that it does not change the month
              onPressWeek(
                new Date(
                  week.days[week.index === 0 ? week.days.length - 1 : 0].date,
                ),
              )
            }
          >
            <View style={styles.weekWrapper}>
              {week.days.map(day => (
                <Box
                  flex={1}
                  justifyContent="center"
                  alignItems="flex-start"
                  key={day.date.getTime()}
                >
                  <WeekSelectDay
                    date={day.date}
                    isCurrentMonth={isSameMonth(day.date, date)}
                    isCurrentDay={isSameDay(day.date, currentDate)}
                    isCurrentWeek={isCurrentWeek}
                  />
                </Box>
              ))}
            </View>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};

const styles = StyleSheet.create({
  weekWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
});
