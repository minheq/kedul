import { Header, useI18n } from '@kedul/common-client';
import { Appointment, AppointmentStatus } from '@kedul/service-appointment';
import { addMinutes, startOfToday } from 'date-fns';
import { Box, Column, Container, Heading, Row, Text } from 'paramount-ui';
import React from 'react';
import { Image, ImageBackground, ScrollView } from 'react-native';

import { AppBottomNavigationBar } from '../components/AppBottomNavigationBar';
import { AppointmentPreviewList } from '../components/AppointmentPreviewList';
import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenTitle } from '../components/ScreenTitle';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AddLink } from '../components/AddLink';
import { SegmentedControls } from '../components/SegmentedControls';

// This is just a little util function that allows me to quickly whip out some dummy data.
const addTime = (start: Date, days: number, hours: number, minutes: number) => {
  return addMinutes(start, days * 24 * 60 + hours * 60 + minutes);
};

const now = new Date();
const today = startOfToday(); // this represents the beginning of the day

// TODO: Load real data
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

const Avatar = (props: { size: number }) => {
  return (
    <Image
      accessibilityLabel="kedul salon logo"
      source={{
        width: props.size,
        height: props.size,
        uri: 'https://picsum.photos/200/200', // TODO load real image
      }}
      style={{
        width: props.size,
        height: props.size,
        borderRadius: 999,
      }}
    />
  );
};

const EmployeeListItem = () => {
  return (
    <Box width={80} alignItems="center">
      <Avatar size={64} />
      <Text size="medium" align="center">
        Employee Name
      </Text>
    </Box>
  );
};

const HorizontalEmployeeList = () => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
      <Box width={80} alignItems="center">
        <ImageBackground
          accessibilityLabel="kedul salon logo"
          source={{
            width: 64,
            height: 64,
            uri:
              "data:image/svg+xml;charset=UTF-8,%3csvg width='24px' height='24px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3e%3cg id='Group'%3e%3ccircle id='Oval' fill='%23F0F4F8' cx='12' cy='12' r='12'%3e%3c/circle%3e%3cpolygon %3e%3c/polygon%3e%3c/g%3e%3c/g%3e%3c/svg%3e",
          }}
          style={{
            width: 64,
            height: 64,
            justifyContent: 'center',
          }}
        >
          <Text size="small" align="center">
            See All
          </Text>
        </ImageBackground>
      </Box>
      {new Array(20).fill(0).map((v, i) => (
        <EmployeeListItem key={'employee_' + i} />
      ))}
    </ScrollView>
  );
};

export const CalendarOverviewScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUserBusinessAndLocation>
      <ScreenWrapper>
        <ScrollView>
          <Header />
          <Container>
            <Row>
              <Column>
                <ScreenTitle>{i18n.t('Calendar')}</ScreenTitle>
                <Box paddingBottom={24}>
                  <SegmentedControls
                    value="CalendarOverview"
                    data={[
                      {
                        label: i18n.t('Appointments'),
                        value: 'CalendarOverview',
                      },
                      {
                        label: i18n.t('Settings'),
                        value: 'CalendarOverview',
                      },
                    ]}
                  />
                </Box>
                <Box paddingBottom={24}>
                  <AddLink to="CalendarOverview">
                    {i18n.t('Add new appointment')}
                  </AddLink>
                </Box>
                <Box paddingBottom={24}>
                  <Heading size="medium">
                    {i18n.t('Appointments by employee')}
                  </Heading>
                </Box>
                <Box paddingBottom={24}>
                  <HorizontalEmployeeList />
                </Box>
                <AppointmentPreviewList appointments={dummyAppointments} />
              </Column>
            </Row>
          </Container>
        </ScrollView>
        <AppBottomNavigationBar />
      </ScreenWrapper>
    </CurrentUserBusinessAndLocation>
  );
};
