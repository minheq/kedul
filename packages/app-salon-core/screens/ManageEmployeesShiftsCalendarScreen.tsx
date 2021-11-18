import { startOfDay, endOfDay } from 'date-fns';
import {
  DateNavigation,
  DayHeaderProps,
  DaysCalendar,
  Header,
  useI18n,
  CloseableModal,
  Loading,
} from '@kedul/common-client';
import { Box, Text } from 'paramount-ui';
import React from 'react';

import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import {
  ShiftFragment,
  LocationFragment,
  CreateShiftInput,
  useEmployeesShiftsQuery,
} from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { ShiftDetails } from '../components/ShiftDetails';
import { ShiftCreate } from '../components/ShiftCreate';
import { AvatarProfile } from '../components/AvatarProfile';
import { ShiftCalendarCard } from '../components/ShiftCalendarCard';
import { ShiftCalendarNewCard } from '../components/ShiftCalendarNewCard';

export const ManageEmployeesShiftsCalendarScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUserBusinessAndLocation>
      {({ currentLocation }) => (
        <ScreenWrapper>
          <Header
            left={<BackButton />}
            title={i18n.t(`All employees shifts`)}
          />
          <ManageEmployeesShiftsCalendar currentLocation={currentLocation} />
        </ScreenWrapper>
      )}
    </CurrentUserBusinessAndLocation>
  );
};

interface ManageEmployeesShiftsCalendarProps {
  currentLocation: LocationFragment;
}

const ManageEmployeesShiftsCalendar = (
  props: ManageEmployeesShiftsCalendarProps,
) => {
  const { currentLocation } = props;
  const i18n = useI18n();
  const [date, setDate] = React.useState(new Date());
  const [newShift, setNewShift] = React.useState<CreateShiftInput | null>(null);
  const [currentShiftId, setCurrentShiftId] = React.useState<string | null>(
    null,
  );
  const [hasLoaded, setHasLoaded] = React.useState(false);

  const { data, error, refetch } = useEmployeesShiftsQuery({
    variables: {
      locationId: currentLocation.id,
      filter: { startDate: startOfDay(date), endDate: endOfDay(date) },
    },
    onCompleted: () => {
      setHasLoaded(true);
    },
  });

  if (!hasLoaded) return <Loading />;

  if (!data) {
    return <Text>{error && error.message}</Text>;
  }

  const employees = data.employees || [];

  const days = employees.map(employee => ({
    key: employee.id,
    date,
    events: employee.shifts,
  }));

  const DayHeader = (props: DayHeaderProps<ShiftFragment>) => {
    const { day, minWidth } = props;
    const employee = employees.find(e => e.id === day.key);

    if (!employee) {
      return <Text>{i18n.t('Employee not found')}</Text>;
    }

    return (
      <Box height="100%" justifyContent="center" alignItems="center">
        <AvatarProfile
          orientation="vertical"
          size="small"
          name={employee.profile.fullName}
          image={employee.profile.profileImage}
          overrides={{
            Title: {
              props: { weight: 'normal' },
              style: { fontSize: 12, lineHeight: 14 },
            },
            Root: { style: { width: minWidth < 100 ? minWidth : 'auto' } },
          }}
        />
      </Box>
    );
  };

  return (
    <Box flex={1}>
      <DateNavigation value={date} onValueChange={setDate} />
      <Box flex={1}>
        <DaysCalendar
          days={days}
          components={{
            Event: ShiftCalendarCard,
            NewEvent: ShiftCalendarNewCard,
            DayHeader,
          }}
          onNew={(event, employeeId) => {
            setNewShift({
              startDate: event.startDate,
              endDate: event.endDate,
              locationId: currentLocation.id,
              employeeId,
            });
          }}
          onPress={shift => setCurrentShiftId(shift.id)}
        />
      </Box>
      <CloseableModal
        isVisible={!!newShift}
        onRequestClose={() => setNewShift(null)}
      >
        {newShift && (
          <ShiftCreate
            location={currentLocation}
            onCompleted={async () => {
              setNewShift(null);

              await refetch();
            }}
            initialValues={newShift}
          />
        )}
      </CloseableModal>
      <CloseableModal
        isVisible={!!currentShiftId}
        onRequestClose={() => setCurrentShiftId(null)}
      >
        {currentShiftId && (
          <ShiftDetails
            id={currentShiftId}
            onCanceled={async () => {
              setCurrentShiftId(null);
              await refetch();
            }}
            onUpdated={async () => {
              await refetch();
            }}
          />
        )}
      </CloseableModal>
    </Box>
  );
};
