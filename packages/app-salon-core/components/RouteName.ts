export type RouteName =
  | 'AuthLoading'

  // Login
  | 'Login'
  | 'BusinessAndLocationSelection'

  // Onboarding
  | 'OnboardingIntro'
  | 'OnboardingLocationCreation'
  | 'OnboardingLocationSetup'

  // Notifications
  | 'Notifications'

  // Profile
  | 'ProfileMenu'
  | 'UserProfile'
  | 'UserAccountSettingsGeneral'

  // Business
  | 'BusinessProfile'
  | 'BusinessSettings'
  | 'BusinessSettingsGeneral'
  | 'BusinessSettingsBilling'
  | 'BusinessBilling'

  // Location
  | 'LocationSettings'
  | 'LocationSettingsGeneral'
  | 'LocationProfile'

  // Calendar
  | 'CalendarOverview'
  // Sale
  | 'SaleOverview'

  // Manage Employee
  | 'ManageEmployeeShifts'
  | 'ManageEmployeeList'
  | 'ManageEmployeeRoles'
  | 'ManageEmployeeShift'
  | 'ManageEmployeeShiftsCalendar'
  | 'ManageEmployeesShiftsCalendar'
  | 'ManageEmployeeProfile'
  | 'ManageEmployeeSettings'
  | 'ManageEmployeeSalary'

  // Services
  | 'ManageServices'

  // Client
  | 'ManageClients'
  | 'ManageClientProfile'
  | 'ManageClientMembership'
  | 'ManageResources'
  | 'ManageProducts'
  | 'InboxOverview';
