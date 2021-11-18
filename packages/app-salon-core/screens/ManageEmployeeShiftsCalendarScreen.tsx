import {
  DateNavigation,
  DayHeaderProps,
  DaysCalendar,
  getWeekInterval,
  Header,
  useI18n,
  CloseableModal,
  Loading,
} from '@kedul/common-client';
import { DATE_FORMAT } from '@kedul/common-utils';
import { eachDayOfInterval, format, isSameDay } from 'date-fns';
import { Box, Text } from 'paramount-ui';
import React from 'react';

import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { EmployeeFromNavigationParam } from '../components/EmployeeFromNavigationParam';
import {
  EmployeeFragment,
  ShiftFragment,
  LocationFragment,
  CreateShiftInput,
  useEmployeeShiftsQuery,
} from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { ShiftDetails } from '../components/ShiftDetails';
import { ShiftCreate } from '../components/ShiftCreate';
import { ShiftCalendarCard } from '../components/ShiftCalendarCard';
import { ShiftCalendarNewCard } from '../components/ShiftCalendarNewCard';

export const ManageEmployeeShiftsCalendarScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUserBusinessAndLocation>
      {({ currentLocation }) => (
        <EmployeeFromNavigationParam>
          {employee => (
            <ScreenWrapper>
              <Header
                left={<BackButton />}
                title={i18n.t(`{{name}}'s shifts`, {
                  name: employee.profile.fullName,
                })}
              />
              <ManageEmployeeShiftsCalendar
                currentLocation={currentLocation}
                employee={employee}
              />
            </ScreenWrapper>
          )}
        </EmployeeFromNavigationParam>
      )}
    </CurrentUserBusinessAndLocation>
  );
};

interface ManageEmployeeShiftsCalendarProps {
  currentLocation: LocationFragment;
  employee: EmployeeFragment;
}

const ManageEmployeeShiftsCalendar = (
  props: ManageEmployeeShiftsCalendarProps,
) => {
  const {
    employee: { id },
    currentLocation,
  } = props;
  const i18n = useI18n();
  const [interval, setInterval] = React.useState(getWeekInterval(new Date()));
  const [newShift, setNewShift] = React.useState<CreateShiftInput | null>(null);
  const [currentShiftId, setCurrentShiftId] = React.useState<string | null>(
    null,
  );
  const [hasLoaded, setHasLoaded] = React.useState(false);

  const { data, error, refetch } = useEmployeeShiftsQuery({
    variables: {
      id,
      filter: { startDate: interval.start, endDate: interval.end },
    },
    onCompleted: () => {
      setHasLoaded(true);
    },
  });

  if (!hasLoaded) return <Loading />;
  if (!data) return <Text>{error && error.message}</Text>;

  const { employee } = data;

  if (!employee) {
    return <Text>{i18n.t('Employee not found')}</Text>;
  }

  const days = eachDayOfInterval(interval).map(date => ({
    key: format(date, DATE_FORMAT),
    date,
    events: employee.shifts.filter(shift => isSameDay(shift.startDate, date)),
  }));

  return (
    <Box flex={1}>
      <DateNavigation
        useInterval
        value={interval}
        onValueChange={setInterval}
      />
      <Box flex={1}>
        <DaysCalendar
          days={days}
          components={{
            Event: ShiftCalendarCard,
            NewEvent: ShiftCalendarNewCard,
            DayHeader,
          }}
          onNew={event => {
            setNewShift({
              startDate: event.startDate,
              endDate: event.endDate,
              locationId: currentLocation.id,
              employeeId: employee.id,
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

const DayHeader = (props: DayHeaderProps<ShiftFragment>) => {
  const { day } = props;

  return (
    <Box height="100%" justifyContent="center" alignItems="center">
      <Text weight="bold" size="small">
        {format(day.date, 'dd')}
      </Text>
      <Text size="small">{format(day.date, 'EEEEEE')}</Text>
    </Box>
  );
};
