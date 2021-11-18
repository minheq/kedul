import { useI18n, CloseableModal } from '@kedul/common-client';
import { PolicyAction, PolicyEntity } from '@kedul/service-permission';
import { Box, Button, Container, Text, Spacing } from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { AppBottomNavigationBar } from '../components/AppBottomNavigationBar';
import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenTitle } from '../components/ScreenTitle';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { ManageEmployeeSegmentedControls } from '../components/ManageEmployeeSegmentedControls';
import {
  EmployeeFragment,
  LocationFragment,
  EmployeesQuery,
} from '../generated/MutationsAndQueries';
import {
  ManageNavigationTabs,
  ManageTab,
} from '../components/ManageNavigationTabs';
import { AddLink } from '../components/AddLink';
import { ListItemLink } from '../components/ListItemLink';
import { usePermissions } from '../components/PermissionsProvider';
import { getUserAvatar } from '../components/UserProfileUtils';
import { CurrentLocation } from '../components/CurrentLocation';
import { EmployeeCreate } from '../components/EmployeeCreate';

export const ManageEmployeeListScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUserBusinessAndLocation>
      {({ currentLocation }) => (
        <ScreenWrapper>
          <ManageNavigationTabs tab={ManageTab.EMPLOYEE} />
          <ScrollView>
            <Container>
              <ScreenTitle>{i18n.t('Employee')}</ScreenTitle>
              <ManageEmployeeSegmentedControls active="list" />
              <ManageEmployeeList location={currentLocation} />
            </Container>
          </ScrollView>
          <AppBottomNavigationBar />
        </ScreenWrapper>
      )}
    </CurrentUserBusinessAndLocation>
  );
};

const ManageEmployeeList = (props: ManageEmployeeListProps) => {
  const i18n = useI18n();
  const { location } = props;
  const { check } = usePermissions();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const resource = {
    entityId: '*',
    entity: PolicyEntity.EMPLOYEE,
    locationId: location.id,
  };
  const canCreate = check(PolicyAction.CREATE_EMPLOYEE, resource);

  return (
    <EmployeesQuery variables={{ locationId: location.id }}>
      {({ employees }) => (
        <>
          {canCreate && employees.length > 0 && (
            <>
              <AddLink
                testID="ADD_EMPLOYEE"
                onPress={() => setIsModalOpen(true)}
              >
                {i18n.t('Add employee')}
              </AddLink>
              <Spacing size="large" />
            </>
          )}
          {canCreate && employees.length === 0 && <EmployeeEmptyState />}
          {employees.map(employee => (
            <EmployeeListItemLink key={employee.id} employee={employee} />
          ))}
          <CloseableModal
            isVisible={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
          >
            <EmployeeCreate location={location} />
          </CloseableModal>
        </>
      )}
    </EmployeesQuery>
  );
};

export interface RegisteredEmployeeListItemLinkProps {
  employee: EmployeeFragment;
}

const EmployeeListItemLink = (props: RegisteredEmployeeListItemLinkProps) => {
  const { employee } = props;

  return (
    <ListItemLink
      key={employee.id}
      to="ManageEmployeeProfile"
      params={{ employeeId: employee.id }}
      title={employee.profile.fullName}
      overrides={{
        Avatar: {
          props: getUserAvatar(employee.profile),
        },
      }}
    />
  );
};

export interface ManageEmployeeListProps {
  location: LocationFragment;
}

export const EmployeeEmptyState = () => {
  const i18n = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <CurrentLocation>
      {currentLocation => (
        <Box paddingVertical={56}>
          <Text>{i18n.t('There are no employees added yet.')}</Text>
          <Spacing />
          <Button
            color="primary"
            title={i18n.t('Add employee')}
            testID="ADD_EMPLOYEE"
            onPress={e => {
              e.preventDefault();

              setIsModalOpen(true);
            }}
          />
          <CloseableModal
            isVisible={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
          >
            <EmployeeCreate location={currentLocation} />
          </CloseableModal>
        </Box>
      )}
    </CurrentLocation>
  );
};
