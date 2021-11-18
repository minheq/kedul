import {
  AppLoader,
  AppProvider,
  AuthLoadingScreen,
  BusinessSettingsScreen,
  CalendarOverviewScreen,
  LoginScreen,
  ManageClientListScreen,
  ManageClientMembershipScreen,
  ManageClientProfileScreen,
  OnboardingBusinessIntroScreen,
  ProfileMenuScreen,
  UserAccountSettingsGeneralScreen,
  LocationSettingsScreen,
  LocationProfileScreen,
} from '@kedul/app-salon-core';
import React from 'react';
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation';

const OnboardingStack = createStackNavigator(
  {
    OnboardingBusinessIntro: OnboardingBusinessIntroScreen,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const ProfileStack = createStackNavigator(
  {
    // Profile
    ProfileMenu: ProfileMenuScreen,

    // Business
    BusinessSettings: BusinessSettingsScreen,

    // BusinessMembers
    BusinessMember: ProfileMenuScreen,
    BusinessMembersSettings: ProfileMenuScreen,

    // Location
    LocationSettings: LocationSettingsScreen,
    LocationProfile: LocationProfileScreen,

    // User
    UserAccountSettingsGeneral: UserAccountSettingsGeneralScreen,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const CalendarStack = createStackNavigator(
  {
    CalendarOverview: CalendarOverviewScreen,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const SalesStack = createStackNavigator(
  {
    SaleOverview: CalendarOverviewScreen,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const InboxStack = createStackNavigator(
  {
    InboxOverview: CalendarOverviewScreen,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const ManageStack = createStackNavigator(
  {
    ManageClients: ManageClientListScreen,
    ManageEmployee: ManageClientListScreen,
    ManageServices: ManageClientListScreen,
    ManageProducts: ManageClientListScreen,
    ManageResources: ManageClientListScreen,
    ManageClientProfile: ManageClientProfileScreen,
    ManageClientMembership: ManageClientMembershipScreen,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const AuthStack = createStackNavigator(
  { Login: LoginScreen },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const AppSwitch = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Calendar: CalendarStack,
    Sales: SalesStack,
    Manage: ManageStack,
    Inbox: InboxStack,
    Profile: ProfileStack,
    Auth: AuthStack,
    Onboarding: OnboardingStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

const AppContainer = createAppContainer(AppSwitch);

const App = () => {
  return (
    <AppProvider>
      <AppLoader>
        <AppContainer />
      </AppLoader>
    </AppProvider>
  );
};

export default App;
