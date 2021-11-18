import {
  DangerButtonWithConfirmDialog,
  Header,
  useI18n,
  CloseableModal,
  SubmitBottomBar,
} from '@kedul/common-client';
import { Container, Text, FormField, TextInput } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';
import { FormikProps } from 'formik';

import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { SectionWrapper } from '../components/SectionWrapper';
import { EmployeeFromNavigationParam } from '../components/EmployeeFromNavigationParam';
import { EmployeeSegmentedControls } from '../components/EmployeeSegmentedControls';
import {
  EmployeeFragment,
  useDeleteEmployeeForm,
  useUpdateEmployeeForm,
  UpdateEmployeeInput,
} from '../generated/MutationsAndQueries';
import { AddLink } from '../components/AddLink';
import { BackButton } from '../components/BackButton';
import { Link } from '../components/Link';
import { useNavigation } from '../components/useNavigation';
import { useCurrentUser } from '../components/CurrentUserProvider';
import { ScreenTitle } from '../components/ScreenTitle';

export const ManageEmployeeSettingsScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUserBusinessAndLocation>
      <EmployeeFromNavigationParam>
        {employee => (
          <ScreenWrapper>
            <Header
              left={<BackButton to="ManageEmployeeList" />}
              title={i18n.t('Employee')}
            />
            <ManageEmployeeSettings employee={employee} />
          </ScreenWrapper>
        )}
      </EmployeeFromNavigationParam>
    </CurrentUserBusinessAndLocation>
  );
};

interface ManageEmployeeSettingsProps {
  employee: EmployeeFragment;
}

const ManageEmployeeSettings = (props: ManageEmployeeSettingsProps) => {
  const { employee } = props;

  return (
    <ScrollView>
      <Container>
        <EmployeeSegmentedControls active="settings" employeeId={employee.id} />
        <EmployeeSalarySection employee={employee} />
        <EmployeeDeletionSection employee={employee} />
      </Container>
    </ScrollView>
  );
};

interface EmployeeSalaryProps {
  employee: EmployeeFragment;
}

const EmployeeSalary = (props: EmployeeSalaryProps) => {
  const { employee } = props;
  const i18n = useI18n();

  if (!employee.salarySettings) return null;

  return (
    <>
      {employee.salarySettings.wage && (
        <Text>
          {employee.salarySettings.wage} {i18n.t('Wage (per hour)')}
        </Text>
      )}
      {employee.salarySettings.serviceCommission && (
        <Text>
          {employee.salarySettings.serviceCommission}{' '}
          {i18n.t('Service commission')}
        </Text>
      )}
      {employee.salarySettings.serviceCommission && (
        <Text>
          {employee.salarySettings.productCommission}{' '}
          {i18n.t('Product commission')}
        </Text>
      )}
    </>
  );
};

interface EmployeeSalarySectionProps {
  employee: EmployeeFragment;
}

const EmployeeSalarySection = (props: EmployeeSalarySectionProps) => {
  const { employee } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <SectionWrapper>
      <SectionTitle
        title={i18n.t('Salary')}
        right={
          <Link
            onPress={() => setIsModalOpen(true)}
            testID="EDIT_EMPLOYEE_SALARY"
          >
            {i18n.t('Edit')}
          </Link>
        }
      />
      {employee.salarySettings ? (
        <EmployeeSalary employee={employee} />
      ) : (
        <AddLink
          onPress={() => setIsModalOpen(true)}
          testID="EDIT_EMPLOYEE_SALARY"
        >
          {i18n.t('Add salary details')}
        </AddLink>
      )}
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <EmployeeSalaryEdit
          employee={employee}
          onCompleted={() => setIsModalOpen(false)}
        />
      </CloseableModal>
    </SectionWrapper>
  );
};

interface ManageEmployeeSalaryProps {
  employee: EmployeeFragment;
  onCompleted?: () => void;
}

const EmployeeSalaryEdit = (props: ManageEmployeeSalaryProps) => {
  const i18n = useI18n();
  const { employee, onCompleted } = props;

  const form = useUpdateEmployeeForm({
    initialValues: {
      id: employee.id,
      salarySettings: {
        wage: null,
        serviceCommission: null,
        productCommission: null,
      },
      profile: {
        fullName: employee.profile.fullName,
      },
    },

    onCompleted,
  });

  return (
    <>
      <ScrollView>
        <Container>
          <ScreenTitle title={i18n.t('Edit salary')} />
          <SalaryForm form={form} />
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

interface SalaryFormProps {
  form: FormikProps<UpdateEmployeeInput>;
}

const SalaryForm = (props: SalaryFormProps) => {
  const { form } = props;
  const { values, setFieldValue, errors, touched } = form;
  const { salarySettings } = values;
  const i18n = useI18n();

  if (!salarySettings) return null;

  return (
    <>
      <FormField
        label={i18n.t('Wage (per hour)')}
        // error={touched.wage && errors.wage}
      >
        <TextInput
          value={String(salarySettings.wage) || ''}
          onValueChange={wage => {
            setFieldValue('salarySettings', {
              ...salarySettings,
              wage: Number(wage),
            });
          }}
          keyboardType="number-pad"
          testID="WAGE_INPUT"
        />
      </FormField>

      <FormField label={i18n.t('Service commission')}>
        <TextInput
          value={String(salarySettings.serviceCommission) || ''}
          onValueChange={serviceCommission => {
            setFieldValue('salarySettings', {
              ...salarySettings,
              serviceCommission: Number(serviceCommission),
            });
          }}
          keyboardType="number-pad"
          testID="SERVICE_COMMISSION_INPUT"
        />
      </FormField>

      <FormField label={i18n.t('Product commission')}>
        <TextInput
          value={String(salarySettings.productCommission) || ''}
          onValueChange={productCommission => {
            setFieldValue('salarySettings', {
              ...salarySettings,
              productCommission: Number(productCommission),
            });
          }}
          keyboardType="number-pad"
          testID="PRODUCT_COMMISSION_INPUT"
        />
      </FormField>
    </>
  );
};

interface EmployeeDeletionSectionProps {
  employee: EmployeeFragment;
}

const EmployeeDeletionSection = (props: EmployeeDeletionSectionProps) => {
  const { employee } = props;
  const i18n = useI18n();
  const { navigate } = useNavigation();
  const { currentUser } = useCurrentUser();

  const form = useDeleteEmployeeForm({
    initialValues: {
      id: employee.id,
    },

    onCompleted: () => navigate('ManageEmployeeList'),
  });

  return (
    <>
      {currentUser && employee.user && currentUser.id === employee.user.id ? (
        <DangerButtonWithConfirmDialog
          title={i18n.t('Leave location')}
          confirmTitle={i18n.t('Are you sure you want to leave this location')}
          onConfirm={form.submitForm}
        />
      ) : (
        <DangerButtonWithConfirmDialog
          title={i18n.t('Delete employee')}
          confirmTitle={i18n.t('Are you sure you want to delete employee')}
          onConfirm={form.submitForm}
        />
      )}
    </>
  );
};
