import { BottomBar, useI18n } from '@kedul/common-client';
import { Box, Icon, IconName, Text, Spacing, useTheme } from 'paramount-ui';
import React from 'react';

import { Link, LinkProps } from './Link';
import { RouteName } from './RouteName';
import { useNavigation } from './useNavigation';

interface BottomNavigationBarLinkProps extends LinkProps<RouteName> {
  title: string;
  icon: IconName;
  testID?: string;
}

const BottomNavigationBarLink = (props: BottomNavigationBarLinkProps) => {
  const { title, icon, to, testID } = props;

  const theme = useTheme();
  const { state } = useNavigation();

  const isActive = to === state.routeName;

  return (
    <Link
      style={{
        flex: 1,
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
      to={to}
      testID={testID}
    >
      <Box alignItems="center" justifyContent="center">
        <Icon
          name={icon}
          color={isActive ? theme.colors.text.primary : theme.colors.text.muted}
        />
        <Spacing size="xsmall" />
        <Text
          color={isActive ? 'primary' : 'muted'}
          transform="uppercase"
          size={10}
          weight="500"
        >
          {title}
        </Text>
      </Box>
    </Link>
  );
};

export const AppBottomNavigationBar = () => {
  const i18n = useI18n();

  return (
    <BottomBar>
      <Box height="100%" flexDirection="row">
        <BottomNavigationBarLink
          to="CalendarOverview"
          title={i18n.t('Calendar')}
          icon="calendar"
          testID="CALENDAR_NAVIGATION_TAB"
        />
        <BottomNavigationBarLink
          to="SaleOverview"
          title={i18n.t('Sale')}
          icon="printer"
          testID="SALES_NAVIGATION_TAB"
        />
        <BottomNavigationBarLink
          to="ManageClients"
          title={i18n.t('Manage')}
          icon="briefcase"
          testID="MANAGE_NAVIGATION_TAB"
        />
        <BottomNavigationBarLink
          to="InboxOverview"
          title={i18n.t('Progress')}
          icon="bar-chart"
          testID="PROGRESS_NAVIGATION_TAB"
        />
        <BottomNavigationBarLink
          to="ProfileMenu"
          title={i18n.t('Profile')}
          icon="user"
          testID="PROFILE_NAVIGATION_TAB"
        />
      </Box>
    </BottomBar>
  );
};
