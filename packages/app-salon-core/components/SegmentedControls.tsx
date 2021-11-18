import React from 'react';
import {
  SegmentedPicker,
  SegmentedPickerItem,
  SegmentedPickerItemProps,
} from '@kedul/common-client';

import { RouteName } from './RouteName';
import { Link } from './Link';

interface SegmentedControlsItem {
  label: string;
  value: RouteName;
  params?: object;
}

export interface SegmentedControlsProps {
  value: RouteName;
  data: SegmentedControlsItem[];
}

export const SegmentedControls = (props: SegmentedControlsProps) => {
  const { value, data } = props;

  return (
    <SegmentedPicker
      data={data}
      value={value}
      overrides={{
        Item: {
          component: SegmentedControl,
        },
      }}
    />
  );
};

const SegmentedControl = (
  props: SegmentedPickerItemProps<RouteName, SegmentedControlsItem>,
) => {
  const { item } = props;

  return (
    <Link to={item.value} params={item.params}>
      <SegmentedPickerItem item={item} onSelect={() => {}} />
    </Link>
  );
};
