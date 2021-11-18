import { useI18n, SubmitBottomBar } from '@kedul/common-client';
import {
  Container,
  ListItem,
  Box,
  Spacing,
  Heading,
  Checkbox,
} from 'paramount-ui';
import React from 'react';
import { sentenceCase } from 'change-case';
import { ScrollView } from 'react-native';
import {
  PolicyAction,
  getPolicyActionDescription,
  EMPLOYEE_ACTIONS_WHITELIST,
  ALL_ACTIONS,
  DISABLED_ACTIONS,
  PolicyEntity,
} from '@kedul/service-permission';
import { PredefinedEmployeeRoleName } from '@kedul/service-employee';

import {
  useUpdateEmployeeRolePermissionsForm,
  EmployeeRoleFragment,
} from '../generated/MutationsAndQueries';
import { ScreenTitle } from '../components/ScreenTitle';

import { usePermissions } from './PermissionsProvider';

const HIDDEN_ACTIONS = [PolicyAction.VIEW_LOCATIONS];

export interface EmployeeRoleDetailsProps {
  employeeRole: EmployeeRoleFragment;
  onUpdated?: () => void;
}

export const EmployeeRoleDetails = (props: EmployeeRoleDetailsProps) => {
  const { employeeRole, onUpdated } = props;
  const i18n = useI18n();
  const { check } = usePermissions();

  const filteredPermissions = ALL_ACTIONS.filter(
    action => !HIDDEN_ACTIONS.includes(action as PolicyAction),
  ).filter(action =>
    EMPLOYEE_ACTIONS_WHITELIST.includes(action as PolicyAction),
  ) as PolicyAction[];

  const resource = {
    entityId: '*',
    entity: PolicyEntity.EMPLOYEE,
    locationId: '*',
  };
  const canUpdate = check(PolicyAction.UPDATE_ROLE_PERMISSIONS, resource);

  const form = useUpdateEmployeeRolePermissionsForm({
    initialValues: {
      id: employeeRole.id,
      permissions: employeeRole.permissions,
    },
    onCompleted: onUpdated,
  });

  const { values, setFieldValue } = form;

  return (
    <>
      <ScrollView>
        <Container>
          <ScreenTitle>
            {i18n.t('{{role}} role', {
              role: sentenceCase(employeeRole.name),
            })}
          </ScreenTitle>
          {filteredPermissions.map((permission, index) => {
            const prevPermission = filteredPermissions[index - 1];
            const [prevEntity] = prevPermission
              ? prevPermission.split(':')
              : [];
            const [entity, action] = permission.split(':');

            const isDisabled =
              !canUpdate ||
              employeeRole.name === PredefinedEmployeeRoleName.OWNER ||
              DISABLED_ACTIONS.includes(permission);
            const isChecked = values.permissions.includes(permission);

            const handleValueChange = () => {
              const updatedPermissions = isChecked
                ? values.permissions.filter(p => p !== permission)
                : values.permissions.concat(permission);

              setFieldValue('permissions', updatedPermissions);
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
              <Box key={permission}>
                {(!prevEntity || prevEntity !== entity) && (
                  <>
                    <Spacing size="xlarge" />
                    <Heading>{sentenceCase(entity)}</Heading>
                  </>
                )}
                <ListItem
                  title={i18n.t(sentenceCase(action))}
                  description={getPolicyActionDescription(permission, i18n)}
                  isDisabled={isDisabled}
                  onPress={handleValueChange}
                  overrides={{
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
              </Box>
            );
          })}
        </Container>
      </ScrollView>
      {canUpdate && (
        <SubmitBottomBar
          isLoading={form.isSubmitting}
          onPress={form.submitForm}
          title={i18n.t('Save')}
          testID="SAVE"
        />
      )}
    </>
  );
};
