import { useI18n } from '@kedul/common-client';
import { Picker, Text, Box } from 'paramount-ui';
import React from 'react';

import { Link } from './Link';
import { RouteName } from './RouteName';

export interface ManageNavigationTabsProps {
  tab: ManageTab;
}

export enum ManageTab {
  CLIENTS,
  EMPLOYEE,
  SERVICES,
  PRODUCTS,
}

export const ManageNavigationTabs = (props: ManageNavigationTabsProps) => {
  const { tab } = props;
  const i18n = useI18n();

  return (
    <Picker
      value={tab}
      data={[
        {
          value: ManageTab.CLIENTS,
          title: i18n.t('Clients'),
          to: 'ManageClients' as const,
        },
        {
          value: ManageTab.EMPLOYEE,
          title: i18n.t('Employees'),
          to: 'ManageEmployeeShifts' as const,
        },
        {
          value: ManageTab.SERVICES,
          title: i18n.t('Services'),
          to: 'ManageServices' as const,
        },
        {
          value: ManageTab.PRODUCTS,
          title: i18n.t('Products'),
          to: 'ManageProducts' as const,
        },
      ]}
      overrides={{
        Root: {
          style: {
            height: 56,
            flex: undefined,
          },
        },
        Item: {
          component: NavigationTab,
        },
      }}
    />
  );
};

interface NavigationTab {
  item: {
    value: ManageTab;
    title: string;
    to: RouteName;
    isSelected: boolean;
  };
}

const NavigationTab = (props: NavigationTab) => {
  const { isSelected, title, to } = props.item;

  return (
    <Box
      flex={1}
      justifyContent="center"
      alignItems="center"
      paddingBottom={12}
    >
      <Link to={to}>
        <Text
          weight={isSelected ? 'bold' : 'normal'}
          color={isSelected ? 'link' : 'default'}
          size="xsmall"
        >
          {title}
        </Text>
      </Link>
    </Box>
  );
};
