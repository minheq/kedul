import './index.css';

import {
  AppLoader,
  AppProvider,
  AuthLoadingScreen,
  BusinessProfileScreen,
  BusinessSettingsBillingScreen,
  BusinessSettingsGeneralScreen,
  ManageEmployeeRolesScreen,
  OnboardingIntroScreen,
  ManageEmployeesShiftsCalendarScreen,
  OnboardingLocationCreationScreen,
  OnboardingLocationSetupScreen,
  BusinessSettingsScreen,
  CalendarOverviewScreen,
  BusinessAndLocationSelectionScreen,
  LocationProfileScreen,
  ManageEmployeeShiftScreen,
  ManageEmployeeShiftsCalendarScreen,
  LocationSettingsGeneralScreen,
  LocationSettingsScreen,
  LoginScreen,
  ManageClientListScreen,
  ManageClientMembershipScreen,
  ManageClientProfileScreen,
  ManageEmployeeListScreen,
  ManageEmployeeProfileScreen,
  ManageEmployeeSalaryScreen,
  ManageEmployeeSettingsScreen,
  ManageEmployeeShiftsScreen,
  NotificationsScreen,
  ProfileMenuScreen,
  RouteName,
  UserAccountSettingsGeneralScreen,
  UserProfileScreen,
} from '@kedul/app-salon-core';
import { createSwitchNavigator } from '@react-navigation/core';
import { createBrowserApp } from '@react-navigation/web';
import React from 'react';

import { LandingPage } from './pages/LandingPage';

type WebOnlyRouteName = 'Landing' | 'Plans';

export type WebRouteName = RouteName | WebOnlyRouteName;

type Routes = { [routeName in WebRouteName]: React.FunctionComponent };

const routes: Routes = {
  AuthLoading: AuthLoadingScreen,
  Landing: LandingPage,
  Plans: LandingPage,

  // Login
  Login: LoginScreen,

  // Notifications
  Notifications: NotificationsScreen,

  // Onboarding
  OnboardingIntro: OnboardingIntroScreen,
  OnboardingLocationCreation: OnboardingLocationCreationScreen,
  OnboardingLocationSetup: OnboardingLocationSetupScreen,

  // Business
  BusinessProfile: BusinessProfileScreen,
  BusinessAndLocationSelection: BusinessAndLocationSelectionScreen,
  BusinessSettings: BusinessSettingsScreen,
  BusinessSettingsGeneral: BusinessSettingsGeneralScreen,
  BusinessSettingsBilling: BusinessSettingsBillingScreen,
  BusinessBilling: BusinessSettingsScreen,

  // Location
  LocationProfile: LocationProfileScreen,
  LocationSettings: LocationSettingsScreen,
  LocationSettingsGeneral: LocationSettingsGeneralScreen,

  // Profile
  ProfileMenu: ProfileMenuScreen,

  // Employee
  ManageEmployeeList: ManageEmployeeListScreen,
  ManageEmployeeShifts: ManageEmployeeShiftsScreen,
  ManageEmployeeRoles: ManageEmployeeRolesScreen,
  ManageEmployeeShift: ManageEmployeeShiftScreen,
  ManageEmployeeShiftsCalendar: ManageEmployeeShiftsCalendarScreen,
  ManageEmployeesShiftsCalendar: ManageEmployeesShiftsCalendarScreen,
  ManageEmployeeProfile: ManageEmployeeProfileScreen,
  ManageEmployeeSettings: ManageEmployeeSettingsScreen,
  ManageEmployeeSalary: ManageEmployeeSalaryScreen,

  ManageClients: ManageClientListScreen,
  ManageServices: ManageClientListScreen,
  ManageProducts: ManageClientListScreen,
  ManageResources: ManageClientListScreen,
  ManageClientProfile: ManageClientProfileScreen,
  ManageClientMembership: ManageClientMembershipScreen,
  SaleOverview: CalendarOverviewScreen,
  InboxOverview: CalendarOverviewScreen,

  CalendarOverview: CalendarOverviewScreen,

  // User
  UserProfile: UserProfileScreen,
  UserAccountSettingsGeneral: UserAccountSettingsGeneralScreen,
};

const AppNavigator = createSwitchNavigator(routes, {
  initialRouteName: 'Landing',
});

const BrowserApp = createBrowserApp(AppNavigator);

export const App = () => {
  return (
    <AppProvider>
      <AppLoader>
        <BrowserApp />
      </AppLoader>
    </AppProvider>
  );
};
