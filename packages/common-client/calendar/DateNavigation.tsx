import { addDays, differenceInDays, format, subDays } from 'date-fns';
import { Box, Button, Icon, Text } from 'paramount-ui';
import React from 'react';

import { Interval, isInterval, validateInterval } from './IntervalUtils';

export type DateNavigationValue<
  TUseInterval extends boolean
> = TUseInterval extends true ? Interval : Date;

export interface DateNavigationProps<TUseInterval extends boolean = false> {
  useInterval?: TUseInterval;
  value: DateNavigationValue<TUseInterval>;
  onValueChange: (value: DateNavigationValue<TUseInterval>) => void;
  /**
   * The interval between navigation.
   * If Interval, defaults to the same interval of days ỏ 1 day
   * If Date, default to 1 day
   */
  step?: number;
}

const DEFAULT_CHANGE = 1;

const useDateNavigation = <TUseInterval extends boolean>(
  props: DateNavigationProps<TUseInterval>,
) => {
  const { value, onValueChange, step } = props;

  const retypedValue = value as Date | Interval;

  const handlePressNext = React.useCallback(() => {
    if (isInterval(retypedValue)) {
      const intervalInDays =
        differenceInDays(retypedValue.end, retypedValue.start) ||
        DEFAULT_CHANGE;

      // eslint-disable-next-line
      onValueChange({
        start: addDays(retypedValue.start, intervalInDays + DEFAULT_CHANGE),
        end: addDays(retypedValue.end, intervalInDays + DEFAULT_CHANGE),
      } as DateNavigationValue<TUseInterval>);
    } else {
      onValueChange(
        step
          ? (addDays(retypedValue, step) as DateNavigationValue<TUseInterval>)
          : (addDays(retypedValue, DEFAULT_CHANGE) as DateNavigationValue<
              TUseInterval
            >),
      );
    }
  }, [onValueChange, retypedValue, step]);

  const handlePressPrevious = React.useCallback(() => {
    if (isInterval(retypedValue)) {
      const intervalInDays =
        differenceInDays(retypedValue.end, retypedValue.start) ||
        DEFAULT_CHANGE;

      // eslint-disable-next-line
      onValueChange({
        start: subDays(retypedValue.start, intervalInDays + DEFAULT_CHANGE),
        end: subDays(retypedValue.end, intervalInDays + DEFAULT_CHANGE),
      } as DateNavigationValue<TUseInterval>);
    } else {
      onValueChange(
        step
          ? (subDays(retypedValue, step) as DateNavigationValue<TUseInterval>)
          : (subDays(retypedValue, DEFAULT_CHANGE) as DateNavigationValue<
              TUseInterval
            >),
      );
    }
  }, [onValueChange, retypedValue, step]);

  return {
    handlePressNext,
    handlePressPrevious,
  };
};

const arrowStyle = {
  paddingLeft: 16,
  paddingRight: 16,
};

const ArrowLeft = () => <Icon name="chevron-left" />;
const ArrowRight = () => <Icon name="chevron-right" />;

export const DateNavigation = <TUseInterval extends boolean = false>(
  props: DateNavigationProps<TUseInterval>,
) => {
  const { value } = props;

  if (isInterval(value)) validateInterval(value);

  const { handlePressNext, handlePressPrevious } = useDateNavigation(props);
  const retypedValue = value as Date | Interval;

  return (
    <Box flexDirection="row">
      <Button
        appearance="minimal"
        onPress={handlePressPrevious}
        overrides={{
          Touchable: {
            style: arrowStyle,
          },
          Title: {
            component: ArrowLeft,
          },
        }}
      />
      <Box flex={1} justifyContent="center">
        <Text align="center" size="small">
          {isInterval(retypedValue)
            ? `${format(retypedValue.start, 'd MMM yyyy')} - ${format(
                retypedValue.end,
                'd MMM yyyy',
              )}`
            : `${format(retypedValue, 'd MMMM yyyy')}`}
        </Text>
      </Box>
      <Button
        appearance="minimal"
        onPress={handlePressNext}
        overrides={{
          Touchable: {
            style: arrowStyle,
          },
          Title: {
            component: ArrowRight,
          },
        }}
      />
    </Box>
  );
};
