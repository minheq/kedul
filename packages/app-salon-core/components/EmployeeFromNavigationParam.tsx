import { useI18n } from '@kedul/common-client';
import { Text } from 'paramount-ui';
import React from 'react';

import {
  EmployeeFragment,
  EmployeeQuery,
} from '../generated/MutationsAndQueries';

import { useNavigation } from './useNavigation';

export interface EmployeeFromNavigationParamProps {
  children: (employee: EmployeeFragment) => React.ReactNode;
}

export const EmployeeFromNavigationParam = (
  props: EmployeeFromNavigationParamProps,
) => {
  const { children } = props;
  const { getParam } = useNavigation();
  const i18n = useI18n();
  const employeeId = getParam('employeeId') as string | null;

  if (!employeeId) {
    return <Text>{i18n.t('Could not employeeId')}</Text>;
  }

  return (
    <EmployeeQuery variables={{ id: employeeId }}>
      {({ employee }) => {
        if (!employee) {
          return <Text>{i18n.t('Employee not found')}</Text>;
        }

        return <>{children(employee)}</>;
      }}
    </EmployeeQuery>
  );
};
