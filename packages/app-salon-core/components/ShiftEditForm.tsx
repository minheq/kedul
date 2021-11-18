import {
  DatePicker,
  DurationPicker,
  RecurrencePicker,
  TimePicker,
  useI18n,
} from '@kedul/common-client';
import { addMinutes, differenceInMinutes, setDate, getDay } from 'date-fns';
import { FormikProps } from 'formik';
import { FormField } from 'paramount-ui';
import React from 'react';
import { dayToWeekdayMap } from '@kedul/common-utils';

import {
  useEmployeesQuery,
  CreateShiftInput,
  UpdateShiftInput,
} from '../generated/MutationsAndQueries';

import { Loading } from './Loading';
import { EmployeePicker } from './EmployeePicker';

interface ShiftEditFormProps<
  TInput extends CreateShiftInput | UpdateShiftInput
> {
  form: FormikProps<TInput>;
  locationId: string;
}

export const ShiftEditForm = <
  TInput extends CreateShiftInput | UpdateShiftInput
>(
  props: ShiftEditFormProps<TInput>,
) => {
  const { form, locationId } = props;
  const { values, touched, errors, setFieldValue } = form;
  const i18n = useI18n();
  const [initialDate, setInitialDate] = React.useState(values.startDate);

  const { data, loading } = useEmployeesQuery({
    variables: { locationId },
  });

  if (loading) return <Loading />;

  return (
    <>
      <FormField label={i18n.t('Date')}>
        <DatePicker
          useInterval={false}
          value={initialDate}
          onValueChange={setInitialDate}
        />
      </FormField>
      <FormField label={i18n.t('Start time')}>
        <TimePicker
          value={values.startDate}
          onValueChange={startDate => {
            const newStartDate = setDate(startDate, initialDate.getDate());
            const duration = differenceInMinutes(
              values.endDate,
              values.startDate,
            );

            setFieldValue('startDate', newStartDate);
            setFieldValue('endDate', addMinutes(newStartDate, duration));
          }}
        />
      </FormField>
      <FormField label={i18n.t('Duration')}>
        <DurationPicker
          value={differenceInMinutes(values.endDate, values.startDate)}
          onValueChange={duration =>
            setFieldValue('endDate', addMinutes(values.startDate, duration))
          }
        />
      </FormField>
      <FormField label={i18n.t('Repeat')}>
        <RecurrencePicker
          value={values.recurrence}
          initialValues={{
            byWeekDay: [dayToWeekdayMap[getDay(values.startDate)]],
          }}
          onValueChange={recurrence => setFieldValue('recurrence', recurrence)}
        />
      </FormField>
      <FormField
        label={i18n.t('Employee')}
        error={touched.employeeId && (errors.employeeId as string)}
      >
        <EmployeePicker
          value={data && data.employees.find(e => e.id === values.employeeId)}
          onValueChange={employee => setFieldValue('employeeId', employee.id)}
          options={(data && data.employees) || []}
        />
      </FormField>
    </>
  );
};
