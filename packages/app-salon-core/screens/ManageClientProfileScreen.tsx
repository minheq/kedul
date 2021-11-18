import { Header, useI18n } from '@kedul/common-client';
import { Appointment, AppointmentStatus } from '@kedul/service-appointment';
import { addMinutes } from 'date-fns';
import { Avatar, Box, Container, Heading, Spacing, Text } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { AppointmentPreviewList } from '../components/AppointmentPreviewList';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { BackButton } from '../components/BackButton';
import { Link } from '../components/Link';
import { SegmentedControls } from '../components/SegmentedControls';

export const ManageClientProfileScreen = () => {
  const i18n = useI18n();

  return (
    <ScreenWrapper>
      <Header
        left={<BackButton to="ManageClients" />}
        title={i18n.t('Client')}
      />
      <ScrollView>
        <Container>
          <ProfileBasic />
          <Box paddingBottom={24}>
            <Text size="medium">client_email@gmail.com</Text>
            <Text size="medium">+84 01234567</Text>
          </Box>
          <Heading size="medium">{i18n.t('Summary')}</Heading>
          <Spacing />
          <ClientSalesSummary />
          <Heading size="medium">{i18n.t('Appointments')}</Heading>
          <Spacing />
        </Container>

        <Container>
          <AppointmentPreviewList appointments={dummyAppointments} />
        </Container>
      </ScrollView>
    </ScreenWrapper>
  );
};

const addTime = (start: Date, days: number, hours: number, minutes: number) => {
  return addMinutes(start, days * 24 * 60 + hours * 60 + minutes);
};

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // this represents the beginning of the day

const dummyAppointments: Appointment[] = [
  {
    id: '1',
    services: [
      {
        id: '0',
        appointmentId: '1',
        clientNumber: 0,
        isEmployeeRequestedByClient: false,
        order: 0,
        serviceId: '0',
        startDate: addTime(today, 0, 13, 55),
        duration: 120,
        clientId: '1',
        employeeId: '2',
      },
      {
        id: '1',
        appointmentId: '1',
        clientNumber: 0,
        isEmployeeRequestedByClient: false,
        order: 1,
        serviceId: '1',
        startDate: addTime(today, 0, 15, 0),
        duration: 120,
        clientId: '1',
        employeeId: '6',
      },
    ],
    locationId: '0',
    status: AppointmentStatus.CONFIRMED,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    services: [
      {
        id: '0',
        appointmentId: '2',
        clientNumber: 0,
        isEmployeeRequestedByClient: false,
        order: 0,
        serviceId: '1',
        startDate: addTime(today, 1, 14, 35),
        duration: 100,
        clientId: '2',
        employeeId: '5',
      },
    ],
    locationId: '0',
    status: AppointmentStatus.CONFIRMED,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    services: [
      {
        id: '0',
        appointmentId: '3',
        clientNumber: 0,
        isEmployeeRequestedByClient: false,
        order: 0,
        serviceId: '2',
        startDate: addTime(today, 3, 10, 5),
        duration: 120,
        clientId: '3',
      },
    ],
    locationId: '0',
    status: AppointmentStatus.CONFIRMED,
    createdAt: now,
    updatedAt: now,
  },
];

const NavBar = () => {
  const i18n = useI18n();
  return (
    <Box paddingBottom={24}>
      <SegmentedControls
        value="ManageClientProfile"
        data={[
          {
            label: i18n.t('Profile'),
            value: 'ManageClientProfile',
          },
          {
            label: i18n.t('Membership'),
            value: 'ManageClientMembership',
          },
        ]}
      />
    </Box>
  );
};

// Can be reused for employee
const ProfileBasic = () => {
  const i18n = useI18n();
  return (
    <>
      <NavBar />
      <Box paddingBottom={24} flexDirection="row">
        <Avatar
          source={{
            uri: 'https://picsum.photos/200/200',
            width: 200,
            height: 200,
          }}
          // Fallbacks to name if source is not provided
          name="Bill Gates"
          size="medium"
        />
        <Box flexDirection="column" marginLeft={16}>
          <Heading size="medium">Client Name</Heading>
          <Link to="ManageClientProfile">{i18n.t('Edit profile')}</Link>
        </Box>
      </Box>
    </>
  );
};

const ClientSalesSummary = () => {
  const i18n = useI18n();
  const sales = 0;
  const bookings = 0;
  return (
    <Box paddingBottom={24}>
      <Text size="medium">{`${sales} ${i18n.t('d total sales')}`}</Text>
      <Text size="medium">{`${bookings} ${i18n.t('bookings made')}`}</Text>
    </Box>
  );
};
