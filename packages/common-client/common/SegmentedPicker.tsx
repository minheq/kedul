import {
  PickerProps,
  Picker,
  ControlSize,
  useTheme,
  PickerItem,
  PickerItemProps,
  Button,
  ItemProps,
} from 'paramount-ui';
import React from 'react';

export interface SegmentedPickerProps<
  TValue extends any,
  TItem extends PickerItem<TValue>,
  TIsMulti extends boolean = false
>
  extends PickerProps<
    TValue,
    TItem,
    SegmentedPickerItemProps<TValue, TItem>,
    TIsMulti
  > {
  size?: ControlSize;
}

interface SegmentedPickerItem<TValue extends any> extends PickerItem<TValue> {
  label: string;
}

export const SegmentedPicker = <
  TValue extends any,
  TItem extends SegmentedPickerItem<TValue>,
  TIsMulti extends boolean = false
>(
  props: SegmentedPickerProps<TValue, TItem, TIsMulti>,
) => {
  const { size = 'medium', value, onValueChange, data, overrides } = props;

  return (
    <Picker<TValue, TItem, SegmentedPickerItemProps<TValue, TItem>, TIsMulti>
      value={value}
      data={data}
      onValueChange={onValueChange}
      overrides={{
        Root: {
          style: {
            flex: undefined,
            flexWrap: 'wrap',
          },
        },
        Item: {
          props: {
            size,
          },
          component: SegmentedPickerItem,
        },
        ...overrides,
      }}
    />
  );
};

export interface SegmentedPickerItemProps<
  TValue extends any,
  TItem extends PickerItem<TValue>
> extends ItemProps<TValue, TItem & PickerItemProps & { label: string }> {
  size?: ControlSize;
}

export const SegmentedPickerItem = <
  TValue extends any,
  TItem extends PickerItem<TValue>
>(
  props: SegmentedPickerItemProps<TValue, TItem>,
) => {
  const {
    item: { isSelected = false, label },
    size = 'medium',
    onSelect,
  } = props;
  const theme = useTheme();

  return (
    <Button
      title={label}
      onPress={onSelect}
      overrides={{
        Touchable: {
          style: {
            minHeight: theme.controlHeights[size] - 8,
            borderRadius: 25,
            paddingLeft: theme.controlPaddings[size] - 4,
            paddingRight: theme.controlPaddings[size] - 4,
            backgroundColor: isSelected
              ? theme.colors.background.greyLight
              : 'transparent',
          },
        },
        Title: {
          style: {
            ...theme.textSizes.small,
            fontWeight: isSelected ? 'bold' : 'normal',
            color: isSelected
              ? theme.colors.text.default
              : theme.colors.text.muted,
          },
        },
      }}
    />
  );
};
