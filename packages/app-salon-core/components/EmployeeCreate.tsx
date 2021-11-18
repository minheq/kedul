import { useI18n, ErrorText, SubmitBottomBar } from '@kedul/common-client';
import { Container, Row, Column } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { ScreenTitle } from '../components/ScreenTitle';
import {
  LocationFragment,
  useCreateEmployeeForm,
} from '../generated/MutationsAndQueries';
import {
  toUserProfileInitialValues,
  UserProfileEditForm,
} from '../components/UserProfileEditForm';
import { useNavigation } from '../components/useNavigation';
import { useEmployeeRefetch } from '../components/useEmployeeRefetch';

export interface EmployeeCreateProps {
  location: LocationFragment;
}

export const EmployeeCreate = (props: EmployeeCreateProps) => {
  const { location } = props;
  const i18n = useI18n();
  const { navigate } = useNavigation();
  const refetch = useEmployeeRefetch();

  const form = useCreateEmployeeForm({
    initialValues: {
      profile: toUserProfileInitialValues(),
      locationId: location.id,
    },

    onCompleted: async data => {
      if (!data.createEmployee || !data.createEmployee.employee) {
        throw new Error('Expected data');
      }

      navigate('ManageEmployeeProfile', {
        employeeId: data.createEmployee.employee.id,
      });

      await refetch();
    },
  });

  return (
    <>
      <ScrollView>
        <Container size="small">
          <Row>
            <Column>
              <ScreenTitle>{i18n.t('Create new employee')}</ScreenTitle>
              <UserProfileEditForm form={form as UserProfileEditForm} />
              {form.status.message && (
                <ErrorText>{i18n.t(form.status.message)}</ErrorText>
              )}
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
