import { useI18n } from '@kedul/common-client';
import { Box } from 'paramount-ui';
import React from 'react';

import { SegmentedControls } from './SegmentedControls';

export interface EmployeeSegmentedControlsProps {
  active: 'profile' | 'settings' | 'salary';
  employeeId: string;
}

const activeMap = {
  profile: 'ManageEmployeeProfile' as const,
  salary: 'ManageEmployeeSalary' as const,
  settings: 'ManageEmployeeSettings' as const,
};

export const EmployeeSegmentedControls = (
  props: EmployeeSegmentedControlsProps,
) => {
  const { active, employeeId } = props;
  const i18n = useI18n();

  return (
    <Box paddingBottom={24}>
      <SegmentedControls
        value={activeMap[active]}
        data={[
          {
            label: i18n.t('Profile'),
            value: 'ManageEmployeeProfile',
            params: { employeeId },
          },
          // {
          //   label: i18n.t('Salary'),
          //   value: 'ManageEmployeeSalary',
          //   params: { employeeId },
          // },
          {
            label: i18n.t('Settings'),
            value: 'ManageEmployeeSettings',
            params: { employeeId },
          },
        ]}
      />
    </Box>
  );
};
