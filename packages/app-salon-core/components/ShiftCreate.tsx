import { useI18n, SubmitBottomBar } from '@kedul/common-client';
import { Container } from 'paramount-ui';
import React from 'react';
import { addHours, roundToNearestMinutes } from 'date-fns';
import { ScrollView } from 'react-native';

import { ScreenTitle } from '../components/ScreenTitle';
import {
  LocationFragment,
  ShiftFragment,
  useCreateShiftForm,
  CreateShiftInput,
} from '../generated/MutationsAndQueries';
import { ShiftEditForm } from '../components/ShiftEditForm';

import { useShiftRefetch } from './useShiftRefetch';

export interface ShiftCreateProps {
  location: LocationFragment;
  onCompleted?: (shift: ShiftFragment) => void;
  initialValues?: Partial<CreateShiftInput>;
}

export const ShiftCreate = (props: ShiftCreateProps) => {
  const { initialValues = {}, location, onCompleted = () => {} } = props;
  const i18n = useI18n();

  const refetch = useShiftRefetch();

  const initialStartDate =
    initialValues.startDate ||
    roundToNearestMinutes(new Date(), { nearestTo: 5 });

  const form = useCreateShiftForm({
    initialValues: {
      locationId: location.id,
      employeeId: initialValues.employeeId || '',
      startDate: initialStartDate,
      endDate: initialValues.endDate || addHours(initialStartDate, 1),
      recurrence: initialValues.recurrence || null,
    },

    onCompleted: async data => {
      if (!data.createShift || !data.createShift.shift) {
        throw new Error('Expected shift');
      }

      await refetch();

      onCompleted(data.createShift.shift);
    },
  });

  return (
    <>
      <ScrollView>
        <Container>
          <ScreenTitle title={i18n.t('Add shift')} />
          <ShiftEditForm<CreateShiftInput>
            locationId={location.id}
            form={form}
          />
        </Container>
      </ScrollView>
      <SubmitBottomBar
        isLoading={form.isSubmitting}
        onPress={form.submitForm}
        title={i18n.t('Save')}
        testID="SAVE"
      />
    </>
  );
};
