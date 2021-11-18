import { useI18n } from '@kedul/common-client';
import { DURATION_FORMAT, TIME_FORMAT } from '@kedul/common-utils';
import { format, startOfDay, differenceInMinutes, addMinutes } from 'date-fns';
import React from 'react';

import { ShiftFragment } from '../generated/MutationsAndQueries';

import { Card } from './Card';
import { AvatarProfile } from './AvatarProfile';

interface ShiftCardProps {
  shift: ShiftFragment;
}

export const ShiftCard = (props: ShiftCardProps) => {
  const i18n = useI18n();
  const { shift } = props;

  return (
    <Card
      heading={i18n.t('{{startTime}} to {{endTime}}', {
        startTime: format(shift.startDate, TIME_FORMAT),
        endTime: format(shift.endDate, TIME_FORMAT),
      })}
      lineOne={format(
        addMinutes(
          startOfDay(shift.startDate),
          differenceInMinutes(shift.endDate, shift.startDate),
        ),
        DURATION_FORMAT,
      )}
      footer={
        <AvatarProfile
          size="small"
          name={shift.employee.profile.fullName}
          image={shift.employee.profile.profileImage}
        />
      }
    />
  );
};
