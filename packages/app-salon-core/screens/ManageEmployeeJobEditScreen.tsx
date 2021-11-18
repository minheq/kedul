import { Header, SubmitBottomBar, useI18n } from '@kedul/common-client';
import { Column, Container, Row } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { ScreenWrapper } from '../components/ScreenWrapper';
import {
  EmployeeFragment,
  useUpdateEmployeeForm,
} from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { useNavigation } from '../components/useNavigation';
import {
  toUserProfileInitialValues,
  UserProfileEditForm,
} from '../components/UserProfileEditForm';
import { EmployeeFromNavigationParam } from '../components/EmployeeFromNavigationParam';

export const ManageEmployeeJobEditScreen = () => {
  const i18n = useI18n();

  return (
    <ScreenWrapper>
      <EmployeeFromNavigationParam>
        {employee => (
          <>
            <Header
              left={
                <BackButton
                  to="ManageEmployeeSettings"
                  params={{ employeeId: employee.id }}
                />
              }
              title={i18n.t('Edit')}
            />
            <ManageEmployeeJobEdit employee={employee} />
          </>
        )}
      </EmployeeFromNavigationParam>
    </ScreenWrapper>
  );
};

interface ManageEmployeeJobEditProps {
  employee: EmployeeFragment;
}

const ManageEmployeeJobEdit = (props: ManageEmployeeJobEditProps) => {
  const { employee } = props;
  const i18n = useI18n();
  const { navigate } = useNavigation();

  const form = useUpdateEmployeeForm({
    initialValues: {
      id: employee.id,
      profile: toUserProfileInitialValues(employee.profile),
    },
    onCompleted: () => {
      navigate('ManageEmployeeProfile', {
        employeeId: employee.id,
      });
    },
  });

  return (
    <>
      <ScrollView>
        <Container size="small">
          <Row>
            <Column>
              <UserProfileEditForm form={form as UserProfileEditForm} />
            </Column>
          </Row>
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
