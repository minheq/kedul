import { useI18n } from '@kedul/common-client';
import React from 'react';
import { Text } from 'paramount-ui';

import { ShiftFragment, ShiftQuery } from '../generated/MutationsAndQueries';

import { useNavigation } from './useNavigation';

export interface ShiftFromNavigationParamProps {
  children: (Shift: ShiftFragment) => React.ReactNode;
}

export const ShiftFromNavigationParam = (
  props: ShiftFromNavigationParamProps,
) => {
  const { children } = props;
  const { getParam } = useNavigation();
  const i18n = useI18n();
  const shiftId = getParam('shiftId') as string | null;

  if (!shiftId) {
    return <Text>{i18n.t('Could not get shift')}</Text>;
  }

  return (
    <ShiftQuery variables={{ id: shiftId }}>
      {({ shift }) => {
        if (!shift) {
          return <Text>{i18n.t('Shift not found')}</Text>;
        }

        return <>{children(shift)}</>;
      }}
    </ShiftQuery>
  );
};
