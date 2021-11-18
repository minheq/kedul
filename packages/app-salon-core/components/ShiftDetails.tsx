import {
  useI18n,
  formatRecurrence,
  SubmitBottomBar,
  CloseableModal,
  DangerButtonWithConfirmDialog,
  ConfirmDialog,
  I18n,
  DangerButton,
} from '@kedul/common-client';
import {
  DATE_FORMAT,
  TIME_FORMAT,
  toCalendarEventRecurrenceInput,
} from '@kedul/common-utils';
import React from 'react';
import { ScrollView } from 'react-native';
import { Container, Spacing, FormField, Text } from 'paramount-ui';
import { format } from 'date-fns';

import {
  ShiftFragment,
  useUpdateShiftForm,
  ApplyRecurrence,
  useCancelShiftForm,
  ShiftQuery,
  UpdateShiftInput,
} from '../generated/MutationsAndQueries';
import { SectionTitle } from '../components/SectionTitle';
import { Link } from '../components/Link';
import { ShiftEditForm } from '../components/ShiftEditForm';
import { AvatarProfile } from '../components/AvatarProfile';

import { ScreenTitle } from './ScreenTitle';
import { ApplyRecurrencePicker } from './ApplyRecurrencePicker';
import { useShiftRefetch } from './useShiftRefetch';

export interface ShiftDetailsProps {
  id: string;
  onCanceled?: () => void;
  onUpdated?: () => void;
}

export const ShiftDetails = (props: ShiftDetailsProps) => {
  const { id, onCanceled = () => {}, onUpdated = () => {} } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const refetch = useShiftRefetch();

  const form = useCancelShiftForm({
    initialValues: {
      id,
      applyRecurrence: ApplyRecurrence.ONLY_THIS_ONE,
    },

    onCompleted: async () => {
      await refetch();
      onCanceled();
    },
  });

  return (
    <ShiftQuery variables={{ id }}>
      {({ shift }) => {
        if (!shift) return <Text>{i18n.t('Shift not found')}</Text>;

        return (
          <ScrollView>
            <Container>
              <ScreenTitle title={i18n.t('Shift')} />
              <SectionTitle
                title={i18n.t('Details')}
                right={
                  <Link onPress={() => setIsModalOpen(true)}>
                    {i18n.t('Edit')}
                  </Link>
                }
              />
              <CloseableModal
                isVisible={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
              >
                <ShiftDetailsEdit
                  shift={shift}
                  onCompleted={async () => {
                    setIsModalOpen(false);
                    await refetch();
                    onUpdated();
                  }}
                />
              </CloseableModal>
              <FormField label={i18n.t('Date')}>
                <Text>{format(new Date(shift.startDate), DATE_FORMAT)}</Text>
              </FormField>
              <FormField label={i18n.t('Start time')}>
                <Text>
                  {i18n.t('{{startTime}} to {{endTime}}', {
                    startTime: format(new Date(shift.startDate), TIME_FORMAT),
                    endTime: format(new Date(shift.endDate), TIME_FORMAT),
                  })}
                </Text>
              </FormField>
              <FormField label={i18n.t('Repeat')}>
                <Text>
                  {shift.recurrence
                    ? formatRecurrence(i18n, shift.recurrence.recurrence)
                    : i18n.t('Does not repeat')}
                </Text>
              </FormField>
              <FormField label={i18n.t('Employee')}>
                <AvatarProfile
                  size="small"
                  name={shift.employee.profile.fullName}
                  image={shift.employee.profile.profileImage}
                />
              </FormField>
              <Spacing size="xlarge" />
              {!!shift.recurrence ? (
                <DangerButton
                  testID="CANCEL_SHIFT"
                  title={i18n.t('Cancel shift')}
                  onPress={() => setIsCancelModalOpen(true)}
                />
              ) : (
                <DangerButtonWithConfirmDialog
                  title={i18n.t('Cancel shift')}
                  confirmTitle={i18n.t(
                    'Are you sure you want to cancel this shift?',
                  )}
                  onConfirm={form.submitForm}
                  testID="CANCEL_SHIFT"
                />
              )}
              <ConfirmDialog
                isVisible={isCancelModalOpen}
                onRequestClose={() => setIsCancelModalOpen(false)}
                title={i18n.t('Cancel recurring shift')}
                onConfirm={form.submitForm}
              >
                <ApplyRecurrencePicker
                  getLabel={getLabel}
                  value={form.values.applyRecurrence}
                  onValueChange={applyRecurrence =>
                    form.setFieldValue('applyRecurrence', applyRecurrence)
                  }
                />
              </ConfirmDialog>
            </Container>
          </ScrollView>
        );
      }}
    </ShiftQuery>
  );
};

interface ShiftDetailsEditProps {
  shift: ShiftFragment;
  onCompleted?: () => void;
}

const ShiftDetailsEdit = (props: ShiftDetailsEditProps) => {
  const { shift, onCompleted = () => {} } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const form = useUpdateShiftForm({
    initialValues: {
      id: shift.id,
      startDate: new Date(shift.startDate),
      endDate: new Date(shift.endDate),
      recurrence: shift.recurrence
        ? toCalendarEventRecurrenceInput(shift.recurrence.recurrence)
        : null,
      applyRecurrence: ApplyRecurrence.ONLY_THIS_ONE,
      employeeId: shift.employee.id,
    },

    onCompleted,
  });

  return (
    <>
      <ScrollView>
        <Container>
          <ScreenTitle title={i18n.t('Edit shift')} />
          <ShiftEditForm<UpdateShiftInput>
            locationId={shift.location.id}
            form={form}
          />
        </Container>
      </ScrollView>
      <SubmitBottomBar
        isLoading={form.isSubmitting}
        onPress={() => {
          if (form.values.recurrence) {
            setIsModalOpen(true);
          } else {
            form.submitForm();
          }
        }}
        title={i18n.t('Save')}
        testID="SAVE"
      />
      <ConfirmDialog
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        title={i18n.t('Save recurring shift')}
        onConfirm={form.submitForm}
      >
        <ApplyRecurrencePicker
          getLabel={getLabel}
          value={form.values.applyRecurrence}
          onValueChange={applyRecurrence =>
            form.setFieldValue('applyRecurrence', applyRecurrence)
          }
        />
      </ConfirmDialog>
    </>
  );
};

const getLabel = (value: ApplyRecurrence, i18n: I18n) => {
  switch (value) {
    case ApplyRecurrence.ONLY_THIS_ONE:
      return i18n.t('This shift');
    case ApplyRecurrence.THIS_AND_FOLLOWING:
      return i18n.t('This and following shifts');
    case ApplyRecurrence.ALL:
      return i18n.t('All shifts');
    default:
      return i18n.t('This shift');
  }
};
