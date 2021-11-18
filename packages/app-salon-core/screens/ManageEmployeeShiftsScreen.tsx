import { useI18n, CloseableModal } from '@kedul/common-client';
import { PolicyAction, PolicyEntity } from '@kedul/service-permission';
import {
  isToday,
  isTomorrow,
  addWeeks,
  endOfDay,
  format,
  startOfDay,
  isSameDay,
} from 'date-fns';
import { isEmpty } from 'lodash';
import { Box, Button, Container, Heading, Spacing, Text } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { AppBottomNavigationBar } from '../components/AppBottomNavigationBar';
import { AvatarProfile } from '../components/AvatarProfile';
import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenTitle } from '../components/ScreenTitle';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { SectionWrapper } from '../components/SectionWrapper';
import { ManageEmployeeSegmentedControls } from '../components/ManageEmployeeSegmentedControls';
import {
  EmployeeFragment,
  LocationFragment,
  ShiftFragment,
  EmployeesAndShiftsQuery,
} from '../generated/MutationsAndQueries';
import {
  ManageNavigationTabs,
  ManageTab,
} from '../components/ManageNavigationTabs';
import { AddLink } from '../components/AddLink';
import { Link } from '../components/Link';
import { usePermissions } from '../components/PermissionsProvider';
import { ShiftCard } from '../components/ShiftCard';
import { useNavigation } from '../components/useNavigation';
import { ShiftCreate } from '../components/ShiftCreate';

import { EmployeeEmptyState } from './ManageEmployeeListScreen';

export const ManageEmployeeShiftsScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUserBusinessAndLocation>
      {({ currentLocation }) => (
        <ScreenWrapper>
          <ManageNavigationTabs tab={ManageTab.EMPLOYEE} />
          <ScrollView>
            <Container>
              <ScreenTitle>{i18n.t('Employee')}</ScreenTitle>
              <ManageEmployeeSegmentedControls active="shifts" />
              <ManageEmployeeShifts location={currentLocation} />
            </Container>
          </ScrollView>
          <AppBottomNavigationBar />
        </ScreenWrapper>
      )}
    </CurrentUserBusinessAndLocation>
  );
};

export interface ManageEmployeeShiftsProps {
  location: LocationFragment;
}

const ManageEmployeeShifts = (props: ManageEmployeeShiftsProps) => {
  const i18n = useI18n();
  const { location } = props;
  const { check } = usePermissions();
  const { navigate } = useNavigation();
  const resource = {
    entityId: '*',
    entity: PolicyEntity.SHIFT,
    locationId: location.id,
  };
  const canCreate = check(PolicyAction.CREATE_SHIFT, resource);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <EmployeesAndShiftsQuery
      variables={{
        locationId: location.id,
        filter: {
          startDate: startOfDay(new Date()),
          endDate: addWeeks(endOfDay(new Date()), 2),
        },
      }}
    >
      {({ employees, shifts }) => {
        if (employees.length === 0) return <EmployeeEmptyState />;

        return (
          <>
            {canCreate && (
              <Box paddingBottom={24}>
                <AddLink onPress={() => setIsModalOpen(true)}>
                  {i18n.t('Add shift')}
                </AddLink>
              </Box>
            )}
            <ShiftsByEmployeesSection employees={employees} />
            <EmployeeShiftsSection location={location} shifts={shifts} />
            <CloseableModal
              isVisible={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
            >
              <ShiftCreate
                location={location}
                onCompleted={shift => {
                  navigate('ManageEmployeeShift', { shiftId: shift.id });
                }}
              />
            </CloseableModal>
          </>
        );
      }}
    </EmployeesAndShiftsQuery>
  );
};

interface ShiftsByEmployeesSectionProps {
  employees: readonly EmployeeFragment[];
}

const ShiftsByEmployeesSection = (props: ShiftsByEmployeesSectionProps) => {
  const { employees } = props;
  const i18n = useI18n();

  return (
    <SectionWrapper>
      <SectionTitle
        title={i18n.t('Shifts by employees')}
        right={
          <Link to="ManageEmployeesShiftsCalendar">{i18n.t('See all')}</Link>
        }
      />
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        {employees.map(employee => (
          <Box key={employee.id} paddingRight={16}>
            <Link
              to="ManageEmployeeShiftsCalendar"
              params={{ employeeId: employee.id }}
            >
              <AvatarProfile
                orientation="vertical"
                name={employee.profile && employee.profile.fullName}
                image={employee.profile && employee.profile.profileImage}
                overrides={{
                  Title: {
                    props: { weight: 'normal' },
                    style: { fontSize: 14, lineHeight: 16 },
                  },
                  Root: { style: { maxWidth: 72 } },
                }}
              />
            </Link>
          </Box>
        ))}
      </ScrollView>
    </SectionWrapper>
  );
};

interface ShiftsEmptyStateProps {
  location: LocationFragment;
}

const ShiftsEmptyState = (props: ShiftsEmptyStateProps) => {
  const { location } = props;
  const i18n = useI18n();
  const { navigate } = useNavigation();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <SectionWrapper>
      <Text align="center">
        {i18n.t(
          'There are no upcoming shifts yet. Add shifts and you will see them here!',
        )}
      </Text>
      <Spacing />
      <Button
        color="primary"
        title={i18n.t('Add shift')}
        onPress={() => setIsModalOpen(true)}
      />
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <ShiftCreate
          location={location}
          onCompleted={shift => {
            navigate('ManageEmployeeShift', { shiftId: shift.id });
          }}
        />
      </CloseableModal>
    </SectionWrapper>
  );
};

interface EmployeeShiftsSectionProps {
  location: LocationFragment;
  shifts: readonly ShiftFragment[];
}

const EmployeeShiftsSection = (props: EmployeeShiftsSectionProps) => {
  const { shifts, location } = props;
  const i18n = useI18n();

  if (isEmpty(shifts)) {
    return <ShiftsEmptyState location={location} />;
  }

  return (
    <SectionWrapper>
      <SectionTitle title={i18n.t('Upcoming shifts')} />
      {shifts.map((shift, index) => {
        const prevShift = shifts[index - 1];

        return (
          <Box key={shift.id}>
            {(!prevShift ||
              !isSameDay(shift.startDate, prevShift.startDate)) && (
              <>
                <Spacing />
                <Heading size="small">
                  {isToday(shift.startDate) && i18n.t('Today, ')}
                  {isTomorrow(shift.startDate) && i18n.t('Tomorrow, ')}
                  {!isTomorrow(shift.startDate) &&
                    !isToday(shift.startDate) &&
                    i18n.t('{{weekDay}}, ', {
                      weekDay: format(shift.startDate, 'EEEE'),
                    })}
                  {format(shift.startDate, 'do MMMM')}
                </Heading>
                <Spacing />
              </>
            )}
            <Box paddingBottom={16}>
              <Link to="ManageEmployeeShift" params={{ shiftId: shift.id }}>
                <ShiftCard shift={shift} />
              </Link>
            </Box>
          </Box>
        );
      })}
    </SectionWrapper>
  );
};
