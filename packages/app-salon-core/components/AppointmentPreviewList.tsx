import { useI18n } from '@kedul/common-client';
import { Appointment, AppointmentService } from '@kedul/service-appointment';
import {
  addMinutes,
  closestTo,
  differenceInDays,
  format,
  isToday,
  isTomorrow,
  startOfToday,
} from 'date-fns';
import { Avatar, Box, Heading, Text } from 'paramount-ui';
import React from 'react';

import { AddLink } from './AddLink';
import { Link } from './Link';

interface CalendarPreviewCardProps {
  service: AppointmentService;
}

const CalendarPreviewCard = (props: CalendarPreviewCardProps) => {
  const i18n = useI18n();
  const service = props.service;
  const startTime = service.startDate;
  const endTime = addMinutes(startTime, service.duration); // It is assumed that service duration is minutes

  return (
    <Box
      shape="rounded"
      elevation={3}
      padding={8}
      paddingBottom={16}
      marginVertical={8}
    >
      <Heading size="small">{'Client ' + service.clientId}</Heading>

      <Text size="small">
        {format(startTime, 'HH:mm')}
        {i18n.t(' to ')}
        {format(endTime, 'HH:mm')}
      </Text>
      <Text color="muted" size="small">
        {i18n.t('Service ') + service.serviceId}
      </Text>

      <Box height={32} />
      {service.employeeId != null ? (
        <Link to="CalendarOverview">
          <Box flexDirection="row" alignItems="center">
            <Box marginRight={8}>
              <Avatar size="small" />
            </Box>

            <Text size="small">
              {i18n.t('Assigned to ')}
              {service.employeeId}
            </Text>
          </Box>
        </Link>
      ) : (
        <AddLink to="CalendarOverview">{i18n.t('Assign to employee')}</AddLink>
      )}
    </Box>
  );
};

export interface AppointmentPreviewListProps {
  appointments: Appointment[];
}

export const AppointmentPreviewList = (props: AppointmentPreviewListProps) => {
  const i18n = useI18n();
  const today = startOfToday(); // this represents the beginning of the day
  let lastDiffDays = -1;
  const cards = [];
  const options = { day: 'numeric', month: 'long' };

  for (const [index, appointment] of props.appointments.entries()) {
    const startDates = appointment.services.map(service => service.startDate);
    const startDate = closestTo(today, startDates);
    const diffDays = differenceInDays(startDate, today);

    // append a heading when the date changes
    if (lastDiffDays != diffDays) {
      lastDiffDays = diffDays;

      let date = ''; // for days after tomorrow, display only the date
      if (isToday(startDate)) {
        date = 'Today, ';
      } else if (isTomorrow(startDate)) {
        date = 'Tomorrow, ';
      }

      cards.push(
        <Box marginVertical={32} key={cards.length}>
          <Heading size="medium">
            {i18n.t(date)}
            {format(startDate, 'do MMMM')}
          </Heading>
        </Box>,
      );
    }

    for (const [index, service] of appointment.services.entries()) {
      cards.push(<CalendarPreviewCard service={service} key={cards.length} />);
    }
  }

  return <>{cards}</>;
};
