import { useI18n } from '@kedul/common-client';
import { Box } from 'paramount-ui';
import React from 'react';

import { SegmentedControls } from './SegmentedControls';

export interface ManageEmployeeSegmentedControlsProps {
  active: 'shifts' | 'list' | 'roles';
}

const activeControlMap = {
  shifts: 'ManageEmployeeShifts' as const,
  list: 'ManageEmployeeList' as const,
  roles: 'ManageEmployeeRoles' as const,
};

export const ManageEmployeeSegmentedControls = (
  props: ManageEmployeeSegmentedControlsProps,
) => {
  const { active } = props;
  const i18n = useI18n();

  return (
    <Box paddingBottom={24}>
      <SegmentedControls
        value={activeControlMap[active]}
        data={[
          {
            label: i18n.t('Shifts'),
            value: 'ManageEmployeeShifts',
          },
          {
            label: i18n.t('List'),
            value: 'ManageEmployeeList',
          },
          {
            label: i18n.t('Roles'),
            value: 'ManageEmployeeRoles',
          },
        ]}
      />
    </Box>
  );
};
