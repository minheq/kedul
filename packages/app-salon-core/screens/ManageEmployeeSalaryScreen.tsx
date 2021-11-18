import { Header, useI18n } from '@kedul/common-client';
import { PolicyAction, PolicyEntity } from '@kedul/service-permission';
import { Column, Container, Row, Text } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { EmployeeFromNavigationParam } from '../components/EmployeeFromNavigationParam';
import { EmployeeSegmentedControls } from '../components/EmployeeSegmentedControls';
import { EmployeeFragment } from '../generated/MutationsAndQueries';
import { BackButton } from '../components/BackButton';
import { usePermissions } from '../components/PermissionsProvider';

export const ManageEmployeeSalaryScreen = () => {
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
            <ManageEmployeeSalary employee={employee} />
          </ScreenWrapper>
        )}
      </EmployeeFromNavigationParam>
    </CurrentUserBusinessAndLocation>
  );
};

interface ManageEmployeeSalaryProps {
  employee: EmployeeFragment;
}

const ManageEmployeeSalary = (props: ManageEmployeeSalaryProps) => {
  const i18n = useI18n();
  const { employee } = props;
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
              active="salary"
              employeeId={employee.id}
            />
            <Text>TODO</Text>
          </Column>
        </Row>
      </Container>
    </ScrollView>
  );
};
