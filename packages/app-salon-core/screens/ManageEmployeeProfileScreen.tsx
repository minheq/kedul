import { sentenceCase } from 'change-case';
import {
  Header,
  useI18n,
  CloseableModal,
  DangerButtonWithConfirmDialog,
  PhoneNumberInput,
  SubmitBottomBar,
} from '@kedul/common-client';
import { PolicyAction, PolicyEntity } from '@kedul/service-permission';
import {
  Column,
  Container,
  Row,
  Text,
  FormField,
  Checkbox,
  useToast,
  Spacing,
  Box,
  ListItem,
} from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';
import { PredefinedEmployeeRoleName } from '@kedul/service-employee';
import { FormikProps, useFormik, FormikErrors } from 'formik';

import { AvatarProfile } from '../components/AvatarProfile';
import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { SectionWrapper } from '../components/SectionWrapper';
import { EmployeeFromNavigationParam } from '../components/EmployeeFromNavigationParam';
import { EmployeeSegmentedControls } from '../components/EmployeeSegmentedControls';
import {
  EmployeeFragment,
  EmployeeRoleFragment,
  EmployeeRolesQuery,
  useUnlinkEmployeeForm,
  useUpdateEmployeeForm,
  useCancelEmployeeInvitationMutation,
  useUpdateEmployeeMutation,
  useInviteEmployeeMutation,
  useUpdateEmployeeRoleForm,
} from '../generated/MutationsAndQueries';
import { AddLink } from '../components/AddLink';
import { BackButton } from '../components/BackButton';
import { Link } from '../components/Link';
import { usePermissions } from '../components/PermissionsProvider';
import { ScreenTitle } from '../components/ScreenTitle';
import {
  UserProfileEditForm,
  toUserProfileInitialValues,
} from '../components/UserProfileEditForm';
import { ContactDetails } from '../components/ContactDetails';
import { EmployeeRoleDetails } from '../components/EmployeeRoleDetails';

export const ManageEmployeeProfileScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUserBusinessAndLocation>
      {({ currentLocation }) => (
        <EmployeeFromNavigationParam>
          {employee => {
            return (
              <EmployeeRolesQuery
                variables={{ locationId: currentLocation.id }}
              >
                {({ employeeRoles }) => (
                  <ScreenWrapper>
                    <Header
                      left={<BackButton to="ManageEmployeeList" />}
                      title={i18n.t('Employee')}
                    />
                    <EmployeeProfile
                      employee={employee}
                      employeeRoles={employeeRoles}
                    />
                  </ScreenWrapper>
                )}
              </EmployeeRolesQuery>
            );
          }}
        </EmployeeFromNavigationParam>
      )}
    </CurrentUserBusinessAndLocation>
  );
};

interface EmployeeProfileProps {
  employee: EmployeeFragment;
  employeeRoles: readonly EmployeeRoleFragment[];
}

const EmployeeProfile = (props: EmployeeProfileProps) => {
  const { employee, employeeRoles } = props;
  const { check } = usePermissions();
  const resource = {
    entityId: employee.id,
    entity: PolicyEntity.EMPLOYEE,
    locationId: employee.location.id,
  };

  const canUpdate = check(PolicyAction.UPDATE_EMPLOYEE, resource);

  return (
    <ScrollView>
      <Container size="small">
        <Row>
          <Column>
            <EmployeeSegmentedControls
              active="profile"
              employeeId={employee.id}
            />
            <EmployeeProfileSection employee={employee} canUpdate={canUpdate} />
            <EmployeeContactDetailsSection
              employee={employee}
              employeeRoles={employeeRoles}
              canUpdate={canUpdate}
            />
            {employee.user && (
              <UserAccessEditSection
                employee={employee}
                employeeRoles={employeeRoles}
                canUpdate={canUpdate}
              />
            )}
          </Column>
        </Row>
      </Container>
    </ScrollView>
  );
};

interface EmployeeProfileSectionProps {
  employee: EmployeeFragment;
  canUpdate: boolean;
}

const EmployeeProfileSection = (props: EmployeeProfileSectionProps) => {
  const { employee } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const form = useUpdateEmployeeForm({
    initialValues: {
      id: employee.id,
      profile: toUserProfileInitialValues(employee.profile),
    },
    onCompleted: () => setIsModalOpen(false),
  });

  return (
    <SectionWrapper>
      <SectionTitle
        title={i18n.t('Profile')}
        right={
          <Link
            onPress={() => setIsModalOpen(true)}
            testID="EDIT_EMPLOYEE_PROFILE"
          >
            {i18n.t('Edit')}
          </Link>
        }
      />
      <AvatarProfile
        name={employee.profile.fullName}
        image={employee.profile.profileImage}
      />
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <ScrollView>
          <Container size="small">
            <ScreenTitle>{i18n.t('Edit profile')}</ScreenTitle>
            <UserProfileEditForm form={form as UserProfileEditForm} />
          </Container>
        </ScrollView>
        <SubmitBottomBar
          isLoading={form.isSubmitting}
          onPress={form.submitForm}
          title={i18n.t('Save')}
          testID="SAVE"
        />
      </CloseableModal>
    </SectionWrapper>
  );
};

interface UserAccessSectionProps {
  employee: EmployeeFragment;
  employeeRoles: readonly EmployeeRoleFragment[];
  canUpdate: boolean;
}

const UserAccessEditSection = (props: UserAccessSectionProps) => {
  const { employee, employeeRoles, canUpdate } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const unlinkForm = useUnlinkEmployeeForm({
    initialValues: {
      employeeId: employee.id,
    },
  });

  if (!employee.employeeRole || !employee.employeeRole.id) {
    throw new Error('Expected role');
  }

  const updateForm = useUpdateEmployeeRoleForm({
    initialValues: {
      id: employee.id,
      employeeRoleId: employee.employeeRole.id,
    },

    onCompleted: async () => {
      setIsModalOpen(false);
    },
  });

  if (!employee.invitation && !employee.user) return null;

  return (
    <SectionWrapper>
      <SectionTitle
        title={i18n.t('Permission')}
        right={
          canUpdate && (
            <Link
              onPress={() => setIsModalOpen(true)}
              testID="EDIT_EMPLOYEE_USER_ACCESS"
            >
              {i18n.t('Edit')}
            </Link>
          )
        }
      />
      <Text>{employee.employeeRole.name}</Text>
      <Spacing />
      {canUpdate && (
        <DangerButtonWithConfirmDialog
          title={i18n.t('Revoke user access')}
          confirmTitle={i18n.t('Are you sure you want to unlink user')}
          onConfirm={unlinkForm.submitForm}
        />
      )}
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <ScrollView>
          <Container>
            <ScreenTitle title={i18n.t('Edit role')} />
            <EmployeeRolePicker
              employeeRoles={employeeRoles}
              value={updateForm.values.employeeRoleId}
              onValueChange={val =>
                updateForm.setFieldValue('employeeRoleId', val)
              }
            />
            <Spacing />
          </Container>
        </ScrollView>
        <SubmitBottomBar
          isLoading={updateForm.isSubmitting}
          onPress={updateForm.submitForm}
          title={i18n.t('Save')}
          testID="SAVE"
        />
      </CloseableModal>
    </SectionWrapper>
  );
};

interface EmployeeContactDetailsSectionProps {
  employee: EmployeeFragment;
  employeeRoles: readonly EmployeeRoleFragment[];
  canUpdate: boolean;
}

interface EmployeeContactDetailsInput {
  id: string;
  phoneNumber: string;
  countryCode: string;
  shouldSendInvite: boolean;
  employeeRoleId: string;
}

const EmployeeContactDetailsSection = (
  props: EmployeeContactDetailsSectionProps,
) => {
  const { employee, employeeRoles, canUpdate } = props;
  const i18n = useI18n();
  const { danger } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [updateContactDetails] = useUpdateEmployeeMutation();
  const [inviteEmployee] = useInviteEmployeeMutation();
  const [cancelInvitation] = useCancelEmployeeInvitationMutation();

  const basicRole = employeeRoles.find(
    r => r.name === PredefinedEmployeeRoleName.STAFF,
  );
  if (!basicRole) throw new Error('Expected basic role');

  const form = useFormik<EmployeeContactDetailsInput>({
    enableReinitialize: true,

    initialValues: {
      id: employee.id,
      phoneNumber:
        (employee.contactDetails && employee.contactDetails.phoneNumber) || '',
      countryCode:
        (employee.contactDetails && employee.contactDetails.countryCode) ||
        'VN',
      shouldSendInvite: !!employee.invitation || false,
      employeeRoleId:
        (employee.employeeRole && employee.employeeRole.id) || basicRole.id,
    },

    validate: values => {
      const errors: FormikErrors<EmployeeContactDetailsInput> = {};

      if (!values.phoneNumber) {
        errors.phoneNumber = i18n.t('Phone number required');
      }

      return errors;
    },

    onSubmit: async values => {
      const {
        id,
        phoneNumber,
        countryCode,
        shouldSendInvite,
        employeeRoleId,
      } = values;

      await updateContactDetails({
        variables: {
          input: { id, contactDetails: { phoneNumber, countryCode } },
        },
      });

      if (shouldSendInvite) {
        const result = await inviteEmployee({
          variables: {
            input: {
              employeeId: id,
              employeeRoleId,
              phoneNumber,
              countryCode,
            },
          },
        });

        if (
          result &&
          result.data &&
          result.data.inviteEmployee &&
          result.data.inviteEmployee.userError
        ) {
          danger({
            description: result.data.inviteEmployee.userError.message,
          });
        }
      }

      setIsModalOpen(false);
    },
  });

  const handleCancel = React.useCallback(async () => {
    await cancelInvitation({
      variables: { input: { employeeId: employee.id } },
    });
  }, [cancelInvitation, employee.id]);

  return (
    <SectionWrapper>
      <SectionTitle
        title={i18n.t('Contact details')}
        right={
          employee.contactDetails &&
          canUpdate && (
            <Link
              onPress={() => setIsModalOpen(true)}
              testID="EDIT_EMPLOYEE_CONTACT_DETAILS"
            >
              {i18n.t('Edit')}
            </Link>
          )
        }
        description={
          employee.invitation
            ? i18n.t('Invitation has been sent')
            : !employee.user && i18n.t('Use contact details to invite user')
        }
      />
      {employee.contactDetails && (
        <ContactDetails contactDetails={employee.contactDetails} />
      )}
      {!employee.contactDetails && canUpdate && (
        <AddLink
          onPress={() => setIsModalOpen(true)}
          testID="ADD_EMPLOYEE_CONTACT_DETAILS"
        >
          {i18n.t('Add contact details')}
        </AddLink>
      )}
      {!employee.contactDetails && !canUpdate && (
        <Text>{i18n.t('Contact details has not been added')}</Text>
      )}
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <ScrollView>
          <Container size="small">
            <ScreenTitle>{i18n.t('Edit contact details')}</ScreenTitle>
            <EmployeeContactDetailsForm
              form={form}
              employee={employee}
              employeeRoles={employeeRoles}
              onCancel={handleCancel}
            />
          </Container>
        </ScrollView>
        <SubmitBottomBar
          isLoading={form.isSubmitting}
          onPress={form.submitForm}
          title={
            form.touched.phoneNumber && employee.invitation
              ? i18n.t('Resend invite')
              : i18n.t('Save')
          }
          testID="SAVE"
        />
      </CloseableModal>
    </SectionWrapper>
  );
};

interface EmployeeContactDetailsForm {
  form: FormikProps<EmployeeContactDetailsInput>;
  employee: EmployeeFragment;
  employeeRoles: readonly EmployeeRoleFragment[];
  onCancel: () => void;
}

const EmployeeContactDetailsForm = (props: EmployeeContactDetailsForm) => {
  const { form, employee, employeeRoles, onCancel } = props;
  const i18n = useI18n();
  const { setFieldValue, values, errors, touched, submitForm } = form;

  return (
    <>
      <FormField
        label={i18n.t('Enter phone number')}
        error={touched.phoneNumber && errors.phoneNumber}
      >
        <PhoneNumberInput
          onChangeCountryCode={cc => setFieldValue('countryCode', cc)}
          onChangePhoneNumber={pn => setFieldValue('phoneNumber', pn)}
          phoneNumber={values.phoneNumber}
          countryCode={values.countryCode}
          onSubmitEditing={submitForm}
          isClearable
          onClear={() => setFieldValue('phoneNumber', '')}
          testID="PHONE_NUMBER_INPUT"
        />
      </FormField>
      {!employee.user && (
        <>
          {employee.invitation ? (
            <>
              <Text>{i18n.t('Invitation has been sent')}</Text>
              <DangerButtonWithConfirmDialog
                title={i18n.t('Cancel invitation')}
                confirmTitle={i18n.t(
                  'Are you sure you want to cancel user invitation?',
                )}
                onConfirm={onCancel}
              />
            </>
          ) : (
            <>
              <Checkbox
                testID="SEND_INVITE_CHECK"
                label={i18n.t('Send invite to user')}
                shape="circle"
                value={values.shouldSendInvite}
                onValueChange={shouldSendInvite =>
                  setFieldValue('shouldSendInvite', shouldSendInvite)
                }
              />
              <Spacing size="large" />
            </>
          )}

          {values.shouldSendInvite && (
            <EmployeeRolePicker
              employeeRoles={employeeRoles}
              value={values.employeeRoleId}
              onValueChange={val => setFieldValue('employeeRoleId', val)}
            />
          )}
        </>
      )}
    </>
  );
};

export interface EmployeeRolePickerProps {
  isDisabled?: boolean;
  value: string;
  onValueChange?: (value: string) => void;
  employeeRoles: readonly EmployeeRoleFragment[];
}

export const EmployeeRolePicker = (props: EmployeeRolePickerProps) => {
  const { value, onValueChange = () => {}, employeeRoles, isDisabled } = props;
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <FormField label={i18n.t('Select role')}>
      {employeeRoles
        .filter(
          employeeRole =>
            employeeRole.name !== PredefinedEmployeeRoleName.OWNER,
        )
        .map(employeeRole => {
          const isChecked = value === employeeRole.id;

          const handleValueChange = () => {
            onValueChange(employeeRole.id);
          };

          const Action = () => (
            <Box justifyContent="center" alignItems="center">
              <Checkbox
                onValueChange={handleValueChange}
                shape="circle"
                value={isChecked}
                isDisabled={isDisabled}
              />
            </Box>
          );

          return (
            <Box key={employeeRole.name}>
              <ListItem
                title={i18n.t(sentenceCase(employeeRole.name))}
                isDisabled={isDisabled}
                onPress={handleValueChange}
                overrides={{
                  Root: {
                    style: {
                      minHeight: 56,
                    },
                  },
                  Touchable: {
                    style: {
                      paddingRight: 8,
                    },
                  },
                  Action: {
                    component: Action,
                  },
                }}
              />
              <Link onPress={() => setIsModalOpen(true)} size="small">
                {i18n.t('See permissions')}
              </Link>
              <CloseableModal
                isVisible={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
              >
                <EmployeeRoleDetails
                  onUpdated={() => setIsModalOpen(false)}
                  employeeRole={employeeRole}
                />
              </CloseableModal>
              <Spacing size="small" />
            </Box>
          );
        })}
    </FormField>
  );
};
