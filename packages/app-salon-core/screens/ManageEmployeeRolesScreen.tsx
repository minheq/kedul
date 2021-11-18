import { useI18n, CloseableModal } from '@kedul/common-client';
import { Container, ListItem } from 'paramount-ui';
import React from 'react';
import { sentenceCase } from 'change-case';
import { ScrollView } from 'react-native';

import {
  EmployeeRolesQuery,
  EmployeeRoleFragment,
} from '../generated/MutationsAndQueries';
import { AppBottomNavigationBar } from '../components/AppBottomNavigationBar';
import { CurrentUserBusinessAndLocation } from '../components/CurrentUserBusinessAndLocation';
import { ScreenTitle } from '../components/ScreenTitle';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { ManageEmployeeSegmentedControls } from '../components/ManageEmployeeSegmentedControls';
import {
  ManageNavigationTabs,
  ManageTab,
} from '../components/ManageNavigationTabs';
import { SectionWrapper } from '../components/SectionWrapper';
import { EmployeeRoleDetails } from '../components/EmployeeRoleDetails';

export const ManageEmployeeRolesScreen = () => {
  const i18n = useI18n();

  return (
    <CurrentUserBusinessAndLocation>
      {({ currentLocation }) => (
        <ScreenWrapper>
          <ManageNavigationTabs tab={ManageTab.EMPLOYEE} />
          <ScrollView>
            <Container>
              <ScreenTitle>{i18n.t('Employee')}</ScreenTitle>
              <ManageEmployeeSegmentedControls active="roles" />
              <EmployeeRolesQuery
                variables={{ locationId: currentLocation.id }}
              >
                {({ employeeRoles }) => (
                  <SectionWrapper>
                    {employeeRoles.map(employeeRole => (
                      <ListItemEmployeeRole
                        key={employeeRole.id}
                        employeeRole={employeeRole}
                      />
                    ))}
                  </SectionWrapper>
                )}
              </EmployeeRolesQuery>
            </Container>
          </ScrollView>
          <AppBottomNavigationBar />
        </ScreenWrapper>
      )}
    </CurrentUserBusinessAndLocation>
  );
};

interface ListItemEmployeeRoleProps {
  employeeRole: EmployeeRoleFragment;
}

const ListItemEmployeeRole = (props: ListItemEmployeeRoleProps) => {
  const { employeeRole } = props;
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <ListItem
        onPress={() => setIsModalOpen(true)}
        title={sentenceCase(employeeRole.name)}
      />
      <CloseableModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <EmployeeRoleDetails
          onUpdated={() => setIsModalOpen(false)}
          employeeRole={employeeRole}
        />
      </CloseableModal>
    </>
  );
};
