import { transformToErrorObject } from '@kedul/common-utils';
import * as ApolloReactHooks from '@apollo/react-hooks';
import { array, boolean, date, mixed, number, object, string } from 'yup';
import { useFormik, FormikConfig, FormikHelpers } from 'formik';
import { useToast } from 'paramount-ui';
import { validateForUserError } from '@kedul/common-utils';
import React from 'react';
import { ErrorText, Loading } from '@kedul/common-client';
import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-hooks/node_modules/@apollo/react-common';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date custom scalar type */
  Date: Date;
};

export type AcceptEmployeeInvitationInput = {
  invitationToken: Scalars['String'];
};

export type AcceptEmployeeInvitationPayload = {
  __typename?: 'AcceptEmployeeInvitationPayload';
  employee?: Maybe<Employee>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type AccountLogin = {
  __typename?: 'AccountLogin';
  name: Scalars['String'];
  key: Scalars['String'];
  claim: Scalars['String'];
  createdAt: Scalars['Date'];
};

export type Address = {
  __typename?: 'Address';
  streetAddressOne?: Maybe<Scalars['String']>;
  streetAddressTwo?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
};

export type AddressInput = {
  streetAddressOne?: Maybe<Scalars['String']>;
  streetAddressTwo?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
};

export enum ApplyRecurrence {
  ONLY_THIS_ONE = 'ONLY_THIS_ONE',
  THIS_AND_FOLLOWING = 'THIS_AND_FOLLOWING',
  ALL = 'ALL',
}

export type Appointment = {
  __typename?: 'Appointment';
  id: Scalars['ID'];
  services: Array<AppointmentService>;
  recurrence?: Maybe<AppointmentRecurrence>;
  location: Location;
  client?: Maybe<Client>;
  invoice?: Maybe<Invoice>;
  internalNotes?: Maybe<Scalars['String']>;
  clientNotes?: Maybe<Scalars['String']>;
  cancellationReason?: Maybe<Scalars['String']>;
  reference?: Maybe<Scalars['String']>;
  status: AppointmentStatus;
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  canceledAt?: Maybe<Scalars['Date']>;
  checkedOutAt?: Maybe<Scalars['Date']>;
  markedNoShowAt?: Maybe<Scalars['Date']>;
};

export type AppointmentRecurrence = {
  __typename?: 'AppointmentRecurrence';
  id: Scalars['ID'];
  initialAppointment: Appointment;
  recurrence: CalendarEventRecurrence;
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export type AppointmentService = {
  __typename?: 'AppointmentService';
  id: Scalars['ID'];
  appointment: Appointment;
  clientNumber: Scalars['Int'];
  duration: Scalars['Int'];
  isEmployeeRequestedByClient: Scalars['Boolean'];
  order: Scalars['Int'];
  service: Service;
  startDate: Scalars['Date'];
  employee?: Maybe<Employee>;
  client?: Maybe<Client>;
};

export type AppointmentServiceInput = {
  clientNumber: Scalars['Int'];
  duration: Scalars['Int'];
  isEmployeeRequestedByClient: Scalars['Boolean'];
  order: Scalars['Int'];
  serviceId: Scalars['ID'];
  startDate: Scalars['Date'];
  id?: Maybe<Scalars['ID']>;
  employeeId?: Maybe<Scalars['ID']>;
  clientId?: Maybe<Scalars['ID']>;
};

export enum AppointmentStatus {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  ARRIVED = 'ARRIVED',
  STARTED = 'STARTED',
}

export type Business = {
  __typename?: 'Business';
  id: Scalars['ID'];
  name: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  facebookUrl?: Maybe<Scalars['String']>;
  owner: User;
  assignedLocations: Array<Location>;
  locations: Array<Location>;
  logoImage?: Maybe<Image>;
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
  recurrence?: Maybe<CalendarEventRecurrence>;
};

export type CalendarEventInput = {
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
  recurrence?: Maybe<CalendarEventRecurrenceInput>;
};

export type CalendarEventRecurrence = {
  __typename?: 'CalendarEventRecurrence';
  startDate: Scalars['Date'];
  frequency: CalendarEventRecurrenceFrequency;
  interval?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
  weekStart?: Maybe<Scalars['Int']>;
  until?: Maybe<Scalars['Date']>;
  timezoneId?: Maybe<Scalars['ID']>;
  bySetPosition?: Maybe<Array<Scalars['Int']>>;
  byMonth?: Maybe<Array<Scalars['Int']>>;
  byMonthDay?: Maybe<Array<Scalars['Int']>>;
  byYearDay?: Maybe<Array<Scalars['Int']>>;
  byWeekNumber?: Maybe<Array<Scalars['Int']>>;
  byWeekDay?: Maybe<Array<Scalars['Int']>>;
  byHour?: Maybe<Array<Scalars['Int']>>;
  byMinute?: Maybe<Array<Scalars['Int']>>;
  bySecond?: Maybe<Array<Scalars['Int']>>;
};

export enum CalendarEventRecurrenceFrequency {
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  DAILY = 'DAILY',
}

export type CalendarEventRecurrenceInput = {
  frequency: CalendarEventRecurrenceFrequency;
  interval?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
  weekStart?: Maybe<Scalars['Int']>;
  until?: Maybe<Scalars['Date']>;
  timezoneId?: Maybe<Scalars['ID']>;
  bySetPosition?: Maybe<Array<Scalars['Int']>>;
  byMonth?: Maybe<Array<Scalars['Int']>>;
  byMonthDay?: Maybe<Array<Scalars['Int']>>;
  byYearDay?: Maybe<Array<Scalars['Int']>>;
  byWeekNumber?: Maybe<Array<Scalars['Int']>>;
  byWeekDay?: Maybe<Array<Scalars['Int']>>;
  byHour?: Maybe<Array<Scalars['Int']>>;
  byMinute?: Maybe<Array<Scalars['Int']>>;
  bySecond?: Maybe<Array<Scalars['Int']>>;
};

export type CancelAppointmentInput = {
  id: Scalars['ID'];
  applyRecurrence?: Maybe<ApplyRecurrence>;
  cancellationReason?: Maybe<Scalars['String']>;
};

export type CancelAppointmentPayload = {
  __typename?: 'CancelAppointmentPayload';
  appointment?: Maybe<Appointment>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type CancelEmployeeInvitationInput = {
  employeeId: Scalars['ID'];
};

export type CancelEmployeeInvitationPayload = {
  __typename?: 'CancelEmployeeInvitationPayload';
  employee?: Maybe<Employee>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type CancelShiftInput = {
  id: Scalars['ID'];
  applyRecurrence: ApplyRecurrence;
};

export type CancelShiftPayload = {
  __typename?: 'CancelShiftPayload';
  shift?: Maybe<Shift>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type CheckOutAppointmentInput = {
  id: Scalars['ID'];
  invoiceId: Scalars['ID'];
};

export type CheckOutAppointmentPayload = {
  __typename?: 'CheckOutAppointmentPayload';
  appointment?: Maybe<Appointment>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type Client = {
  __typename?: 'Client';
  id: Scalars['ID'];
  isBanned: Scalars['Boolean'];
  contactDetails?: Maybe<ContactDetails>;
  user?: Maybe<User>;
  profile: UserProfile;
  notes?: Maybe<Scalars['String']>;
  importantNotes?: Maybe<Scalars['String']>;
  referralSource?: Maybe<Scalars['String']>;
  discount?: Maybe<Scalars['Float']>;
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
};

export enum CloudStorageProvider {
  S3 = 'S3',
}

export type ContactDetails = {
  __typename?: 'ContactDetails';
  phoneNumber?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};

export type ContactDetailsInput = {
  phoneNumber?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};

export type CreateAppointmentInput = {
  id?: Maybe<Scalars['ID']>;
  services: Array<AppointmentServiceInput>;
  locationId: Scalars['ID'];
  internalNotes?: Maybe<Scalars['String']>;
  recurrence?: Maybe<CalendarEventRecurrenceInput>;
  clientId?: Maybe<Scalars['ID']>;
};

export type CreateAppointmentPayload = {
  __typename?: 'CreateAppointmentPayload';
  appointment?: Maybe<Appointment>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type CreateBusinessInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  logoImageId?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  facebookUrl?: Maybe<Scalars['String']>;
};

export type CreateBusinessPayload = {
  __typename?: 'CreateBusinessPayload';
  business?: Maybe<Business>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type CreateClientInput = {
  id?: Maybe<Scalars['ID']>;
  isBanned?: Maybe<Scalars['Boolean']>;
  contactDetails: ContactDetailsInput;
  profile: UserProfileInput;
  notes?: Maybe<Scalars['String']>;
  importantNotes?: Maybe<Scalars['String']>;
  referralSource?: Maybe<Scalars['String']>;
  discount?: Maybe<Scalars['Float']>;
};

export type CreateClientPayload = {
  __typename?: 'CreateClientPayload';
  client?: Maybe<Client>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type CreateEmployeeInput = {
  notes?: Maybe<Scalars['String']>;
  locationId: Scalars['ID'];
  contactDetails?: Maybe<ContactDetailsInput>;
  profile: UserProfileInput;
  serviceIds?: Maybe<Array<Scalars['ID']>>;
  salarySettings?: Maybe<EmployeeSalarySettingsInput>;
  shiftSettings?: Maybe<EmployeeShiftSettingsInput>;
  employment?: Maybe<EmployeeEmploymentInput>;
};

export type CreateEmployeePayload = {
  __typename?: 'CreateEmployeePayload';
  employee?: Maybe<Employee>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type CreateInvoiceInput = {
  id?: Maybe<Scalars['ID']>;
  note?: Maybe<Scalars['String']>;
  lineItems: Array<InvoiceLineItemInput>;
  discount?: Maybe<DiscountInput>;
  tip?: Maybe<TipInput>;
  payment: PaymentInput;
  clientId?: Maybe<Scalars['ID']>;
  locationId: Scalars['ID'];
};

export type CreateInvoicePayload = {
  __typename?: 'CreateInvoicePayload';
  invoice?: Maybe<Invoice>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type CreateLocationInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  address?: Maybe<AddressInput>;
  contactDetails?: Maybe<ContactDetailsInput>;
  businessHours?: Maybe<Array<CalendarEventInput>>;
};

export type CreateLocationPayload = {
  __typename?: 'CreateLocationPayload';
  location?: Maybe<Location>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type CreateServiceCategoryInput = {
  name: Scalars['String'];
};

export type CreateServiceCategoryPayload = {
  __typename?: 'CreateServiceCategoryPayload';
  serviceCategory?: Maybe<ServiceCategory>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type CreateServiceInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  pricingOptions: Array<ServicePricingOptionInput>;
  locationId: Scalars['ID'];
  serviceCategoryId?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  paddingTime?: Maybe<ServicePaddingTimeInput>;
  processingTimeAfterServiceEnd?: Maybe<Scalars['Int']>;
  processingTimeDuringService?: Maybe<
    ServiceProcessingTimeDuringServiceEndInput
  >;
  parallelClientsCount?: Maybe<Scalars['Int']>;
  intervalTime?: Maybe<Scalars['Int']>;
  noteToClient?: Maybe<Scalars['String']>;
  questionsForClient: Array<Scalars['String']>;
  primaryImageId?: Maybe<Scalars['ID']>;
  imageIds: Array<Scalars['ID']>;
};

export type CreateServicePayload = {
  __typename?: 'CreateServicePayload';
  service?: Maybe<Service>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type CreateShiftInput = {
  id?: Maybe<Scalars['ID']>;
  recurrence?: Maybe<CalendarEventRecurrenceInput>;
  locationId: Scalars['ID'];
  employeeId: Scalars['ID'];
  breakDuration?: Maybe<Scalars['Int']>;
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
  notes?: Maybe<Scalars['String']>;
  status?: Maybe<ShiftStatus>;
};

export type CreateShiftPayload = {
  __typename?: 'CreateShiftPayload';
  shift?: Maybe<Shift>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type DeactivateUserInput = {
  id: Scalars['ID'];
};

export type DeactivateUserPayload = {
  __typename?: 'DeactivateUserPayload';
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type DeclineEmployeeInvitationInput = {
  employeeId: Scalars['ID'];
};

export type DeclineEmployeeInvitationPayload = {
  __typename?: 'DeclineEmployeeInvitationPayload';
  employee?: Maybe<Employee>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type DeleteBusinessInput = {
  id: Scalars['ID'];
};

export type DeleteBusinessPayload = {
  __typename?: 'DeleteBusinessPayload';
  business?: Maybe<Business>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type DeleteClientInput = {
  id: Scalars['ID'];
};

export type DeleteClientPayload = {
  __typename?: 'DeleteClientPayload';
  client?: Maybe<Client>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type DeleteEmployeeInput = {
  id: Scalars['ID'];
};

export type DeleteEmployeePayload = {
  __typename?: 'DeleteEmployeePayload';
  employee?: Maybe<Employee>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type DeleteLocationInput = {
  id: Scalars['ID'];
};

export type DeleteLocationPayload = {
  __typename?: 'DeleteLocationPayload';
  location?: Maybe<Location>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type DeleteServiceCategoryInput = {
  id: Scalars['ID'];
};

export type DeleteServiceCategoryPayload = {
  __typename?: 'DeleteServiceCategoryPayload';
  serviceCategory?: Maybe<ServiceCategory>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type DeleteServiceInput = {
  id: Scalars['ID'];
};

export type DeleteServicePayload = {
  __typename?: 'DeleteServicePayload';
  service?: Maybe<Service>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type DisconnectFacebookInput = {
  userId: Scalars['ID'];
};

export type DisconnectFacebookPayload = {
  __typename?: 'DisconnectFacebookPayload';
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type DisconnectGoogleInput = {
  userId: Scalars['ID'];
};

export type DisconnectGooglePayload = {
  __typename?: 'DisconnectGooglePayload';
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type Discount = {
  __typename?: 'Discount';
  amount: Scalars['Float'];
};

export type DiscountInput = {
  amount: Scalars['Float'];
};

export type Employee = {
  __typename?: 'Employee';
  id: Scalars['ID'];
  employeeRole?: Maybe<EmployeeRole>;
  notes?: Maybe<Scalars['String']>;
  acceptedInvitationAt?: Maybe<Scalars['Date']>;
  createdAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
  updatedAt: Scalars['Date'];
  contactDetails?: Maybe<ContactDetails>;
  profile: UserProfile;
  salarySettings?: Maybe<EmployeeSalarySettings>;
  shiftSettings?: Maybe<EmployeeShiftSettings>;
  employment?: Maybe<EmployeeEmployment>;
  serviceIds: Array<Scalars['ID']>;
  location: Location;
  user?: Maybe<User>;
  invitation?: Maybe<EmployeeInvitation>;
  shifts: Array<Shift>;
};

export type EmployeeShiftsArgs = {
  filter?: Maybe<ShiftsFilter>;
};

export type EmployeeEmployment = {
  __typename?: 'EmployeeEmployment';
  title?: Maybe<Scalars['String']>;
  employmentEndDate?: Maybe<Scalars['Date']>;
  employmentStartDate?: Maybe<Scalars['Date']>;
};

export type EmployeeEmploymentInput = {
  title?: Maybe<Scalars['String']>;
  employmentEndDate?: Maybe<Scalars['Date']>;
  employmentStartDate?: Maybe<Scalars['Date']>;
};

export type EmployeeInvitation = {
  __typename?: 'EmployeeInvitation';
  id: Scalars['ID'];
  employee: Employee;
  invitedByUser: User;
  phoneNumber: Scalars['String'];
  countryCode: Scalars['String'];
  expirationDate: Scalars['Date'];
  token: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export type EmployeeRole = {
  __typename?: 'EmployeeRole';
  id: Scalars['ID'];
  name: Scalars['String'];
  location: Location;
  permissions: Array<Scalars['String']>;
};

export type EmployeeSalarySettings = {
  __typename?: 'EmployeeSalarySettings';
  wage?: Maybe<Scalars['Float']>;
  productCommission?: Maybe<Scalars['Float']>;
  serviceCommission?: Maybe<Scalars['Float']>;
  voucherCommission?: Maybe<Scalars['Float']>;
};

export type EmployeeSalarySettingsInput = {
  wage?: Maybe<Scalars['Float']>;
  productCommission?: Maybe<Scalars['Float']>;
  serviceCommission?: Maybe<Scalars['Float']>;
  voucherCommission?: Maybe<Scalars['Float']>;
};

export type EmployeeShiftSettings = {
  __typename?: 'EmployeeShiftSettings';
  appointmentColor?: Maybe<Scalars['String']>;
  canHaveAppointments?: Maybe<Scalars['Boolean']>;
};

export type EmployeeShiftSettingsInput = {
  appointmentColor?: Maybe<Scalars['String']>;
  canHaveAppointments?: Maybe<Scalars['Boolean']>;
};

export enum GraphQlPersonGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export type Image = {
  __typename?: 'Image';
  id: Scalars['ID'];
  width: Scalars['Int'];
  height: Scalars['Int'];
  url: Scalars['String'];
  format: ImageSupportedFormat;
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  encoding: Scalars['String'];
  cloudStorageProvider: CloudStorageProvider;
  sizes: Array<ImageSizeType>;
  createdAt: Scalars['Date'];
};

export type ImageSizeType = {
  __typename?: 'ImageSizeType';
  size: PredefinedImageSize;
  width: Scalars['Int'];
  height: Scalars['Int'];
  url?: Maybe<Scalars['String']>;
  key: Scalars['String'];
};

export enum ImageSupportedFormat {
  JPG = 'JPG',
  JPEG = 'JPEG',
  PNG = 'PNG',
}

export type InviteEmployeeInput = {
  phoneNumber: Scalars['String'];
  countryCode: Scalars['String'];
  employeeRoleId: Scalars['ID'];
  employeeId: Scalars['ID'];
};

export type InviteEmployeePayload = {
  __typename?: 'InviteEmployeePayload';
  employee?: Maybe<Employee>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type Invoice = {
  __typename?: 'Invoice';
  id: Scalars['ID'];
  note?: Maybe<Scalars['String']>;
  location: Location;
  lineItems: Array<InvoiceLineItem>;
  discount?: Maybe<Discount>;
  tip?: Maybe<Tip>;
  payment: Payment;
  client?: Maybe<Client>;
  status: InvoiceStatus;
  refundInvoice?: Maybe<Invoice>;
  originalInvoice?: Maybe<Invoice>;
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  refundedAt?: Maybe<Scalars['Date']>;
  voidAt?: Maybe<Scalars['Date']>;
};

export type InvoiceLineItem = {
  __typename?: 'InvoiceLineItem';
  id: Scalars['ID'];
  invoice: Invoice;
  quantity: Scalars['Int'];
  typeId: Scalars['ID'];
  type: InvoiceLineItemType;
  price: Scalars['Float'];
  discount?: Maybe<Discount>;
  employee?: Maybe<Employee>;
};

export type InvoiceLineItemInput = {
  id?: Maybe<Scalars['ID']>;
  quantity: Scalars['Int'];
  typeId: Scalars['ID'];
  type: InvoiceLineItemType;
  price: Scalars['Float'];
  discount?: Maybe<DiscountInput>;
  employeeId: Scalars['ID'];
};

export enum InvoiceLineItemType {
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
}

export enum InvoiceStatus {
  VOID = 'VOID',
  REFUNDED = 'REFUNDED',
  COMPLETED = 'COMPLETED',
}

export type LinkFacebookAccountInput = {
  facebookAccessToken: Scalars['String'];
  userId: Scalars['ID'];
};

export type LinkFacebookAccountPayload = {
  __typename?: 'LinkFacebookAccountPayload';
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type LinkGoogleAccountInput = {
  googleIdToken: Scalars['String'];
  userId: Scalars['ID'];
};

export type LinkGoogleAccountPayload = {
  __typename?: 'LinkGoogleAccountPayload';
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type Location = {
  __typename?: 'Location';
  id: Scalars['ID'];
  name: Scalars['String'];
  contactDetails?: Maybe<ContactDetails>;
  address?: Maybe<Address>;
  businessHours?: Maybe<Array<CalendarEvent>>;
  employees: Array<Employee>;
  employeeRoles: Array<EmployeeRole>;
  business: Business;
  createdAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
  updatedAt: Scalars['Date'];
};

export type LogInEmailStartInput = {
  email: Scalars['String'];
};

export type LogInEmailStartPayload = {
  __typename?: 'LogInEmailStartPayload';
  state?: Maybe<Scalars['String']>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type LogInEmailVerifyInput = {
  code: Scalars['String'];
  state: Scalars['String'];
};

export type LogInEmailVerifyPayload = {
  __typename?: 'LogInEmailVerifyPayload';
  accessToken?: Maybe<Scalars['String']>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type LogInFacebookInput = {
  facebookAccessToken: Scalars['String'];
};

export type LogInFacebookPayload = {
  __typename?: 'LogInFacebookPayload';
  accessToken?: Maybe<Scalars['String']>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type LogInGoogleInput = {
  googleIdToken: Scalars['String'];
};

export type LogInGooglePayload = {
  __typename?: 'LogInGooglePayload';
  accessToken?: Maybe<Scalars['String']>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type LogInPhoneStartInput = {
  phoneNumber: Scalars['String'];
  countryCode: Scalars['String'];
};

export type LogInPhoneStartPayload = {
  __typename?: 'LogInPhoneStartPayload';
  state?: Maybe<Scalars['String']>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type LogInPhoneVerifyInput = {
  code: Scalars['String'];
  state: Scalars['String'];
};

export type LogInPhoneVerifyPayload = {
  __typename?: 'LogInPhoneVerifyPayload';
  accessToken?: Maybe<Scalars['String']>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type LogInSilentInput = {
  userId: Scalars['ID'];
};

export type LogInSilentPayload = {
  __typename?: 'LogInSilentPayload';
  accessToken?: Maybe<Scalars['String']>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type MarkNoShowAppointmentInput = {
  id: Scalars['ID'];
};

export type MarkNoShowAppointmentPayload = {
  __typename?: 'MarkNoShowAppointmentPayload';
  appointment?: Maybe<Appointment>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type Mutation = {
  __typename?: 'Mutation';
  logInFacebook?: Maybe<LogInFacebookPayload>;
  logInGoogle?: Maybe<LogInGooglePayload>;
  logInPhoneStart?: Maybe<LogInPhoneStartPayload>;
  logInPhoneVerify?: Maybe<LogInPhoneVerifyPayload>;
  logInEmailStart?: Maybe<LogInEmailStartPayload>;
  logInEmailVerify?: Maybe<LogInEmailVerifyPayload>;
  logInSilent?: Maybe<LogInSilentPayload>;
  linkFacebookAccount?: Maybe<LinkFacebookAccountPayload>;
  disconnectFacebook?: Maybe<DisconnectFacebookPayload>;
  linkGoogleAccount?: Maybe<LinkGoogleAccountPayload>;
  disconnectGoogle?: Maybe<DisconnectGooglePayload>;
  deactivateUser?: Maybe<DeactivateUserPayload>;
  updateUserEmailStart?: Maybe<UpdateUserEmailStartPayload>;
  updateUserEmailVerify?: Maybe<UpdateUserEmailVerifyPayload>;
  updateUserPhoneStart?: Maybe<UpdateUserPhoneStartPayload>;
  updateUserPhoneVerify?: Maybe<UpdateUserPhoneVerifyPayload>;
  updateUserProfile?: Maybe<UpdateUserProfilePayload>;
  createEmployee?: Maybe<CreateEmployeePayload>;
  updateEmployee?: Maybe<UpdateEmployeePayload>;
  updateEmployeeRole?: Maybe<UpdateEmployeeRolePayload>;
  updateEmployeeRolePermissions?: Maybe<UpdateEmployeeRolePermissionsPayload>;
  deleteEmployee?: Maybe<DeleteEmployeePayload>;
  inviteEmployee?: Maybe<InviteEmployeePayload>;
  declineEmployeeInvitation?: Maybe<DeclineEmployeeInvitationPayload>;
  cancelEmployeeInvitation?: Maybe<CancelEmployeeInvitationPayload>;
  acceptEmployeeInvitation?: Maybe<AcceptEmployeeInvitationPayload>;
  unlinkEmployee?: Maybe<UnlinkEmployeePayload>;
  createShift?: Maybe<CreateShiftPayload>;
  updateShift?: Maybe<UpdateShiftPayload>;
  cancelShift?: Maybe<CancelShiftPayload>;
  createBusiness?: Maybe<CreateBusinessPayload>;
  updateBusiness?: Maybe<UpdateBusinessPayload>;
  deleteBusiness?: Maybe<DeleteBusinessPayload>;
  createLocation?: Maybe<CreateLocationPayload>;
  updateLocation?: Maybe<UpdateLocationPayload>;
  deleteLocation?: Maybe<DeleteLocationPayload>;
  createClient?: Maybe<CreateClientPayload>;
  updateClient?: Maybe<UpdateClientPayload>;
  deleteClient?: Maybe<DeleteClientPayload>;
  createInvoice?: Maybe<CreateInvoicePayload>;
  voidInvoice?: Maybe<VoidInvoicePayload>;
  refundInvoice?: Maybe<RefundInvoicePayload>;
  createService?: Maybe<CreateServicePayload>;
  updateService?: Maybe<UpdateServicePayload>;
  deleteService?: Maybe<DeleteServicePayload>;
  createServiceCategory?: Maybe<CreateServiceCategoryPayload>;
  updateServiceCategory?: Maybe<UpdateServiceCategoryPayload>;
  deleteServiceCategory?: Maybe<DeleteServiceCategoryPayload>;
  createAppointment?: Maybe<CreateAppointmentPayload>;
  updateAppointment?: Maybe<UpdateAppointmentPayload>;
  checkOutAppointment?: Maybe<CheckOutAppointmentPayload>;
  cancelAppointment?: Maybe<CancelAppointmentPayload>;
  markNoShowAppointment?: Maybe<MarkNoShowAppointmentPayload>;
};

export type MutationLogInFacebookArgs = {
  input: LogInFacebookInput;
};

export type MutationLogInGoogleArgs = {
  input: LogInGoogleInput;
};

export type MutationLogInPhoneStartArgs = {
  input: LogInPhoneStartInput;
};

export type MutationLogInPhoneVerifyArgs = {
  input: LogInPhoneVerifyInput;
};

export type MutationLogInEmailStartArgs = {
  input: LogInEmailStartInput;
};

export type MutationLogInEmailVerifyArgs = {
  input: LogInEmailVerifyInput;
};

export type MutationLogInSilentArgs = {
  input: LogInSilentInput;
};

export type MutationLinkFacebookAccountArgs = {
  input: LinkFacebookAccountInput;
};

export type MutationDisconnectFacebookArgs = {
  input: DisconnectFacebookInput;
};

export type MutationLinkGoogleAccountArgs = {
  input: LinkGoogleAccountInput;
};

export type MutationDisconnectGoogleArgs = {
  input: DisconnectGoogleInput;
};

export type MutationDeactivateUserArgs = {
  input: DeactivateUserInput;
};

export type MutationUpdateUserEmailStartArgs = {
  input: UpdateUserEmailStartInput;
};

export type MutationUpdateUserEmailVerifyArgs = {
  input: UpdateUserEmailVerifyInput;
};

export type MutationUpdateUserPhoneStartArgs = {
  input: UpdateUserPhoneStartInput;
};

export type MutationUpdateUserPhoneVerifyArgs = {
  input: UpdateUserPhoneVerifyInput;
};

export type MutationUpdateUserProfileArgs = {
  input: UpdateUserProfileInput;
};

export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};

export type MutationUpdateEmployeeArgs = {
  input: UpdateEmployeeInput;
};

export type MutationUpdateEmployeeRoleArgs = {
  input: UpdateEmployeeRoleInput;
};

export type MutationUpdateEmployeeRolePermissionsArgs = {
  input: UpdateEmployeeRolePermissionsInput;
};

export type MutationDeleteEmployeeArgs = {
  input: DeleteEmployeeInput;
};

export type MutationInviteEmployeeArgs = {
  input: InviteEmployeeInput;
};

export type MutationDeclineEmployeeInvitationArgs = {
  input: DeclineEmployeeInvitationInput;
};

export type MutationCancelEmployeeInvitationArgs = {
  input: CancelEmployeeInvitationInput;
};

export type MutationAcceptEmployeeInvitationArgs = {
  input: AcceptEmployeeInvitationInput;
};

export type MutationUnlinkEmployeeArgs = {
  input: UnlinkEmployeeInput;
};

export type MutationCreateShiftArgs = {
  input: CreateShiftInput;
};

export type MutationUpdateShiftArgs = {
  input: UpdateShiftInput;
};

export type MutationCancelShiftArgs = {
  input: CancelShiftInput;
};

export type MutationCreateBusinessArgs = {
  input: CreateBusinessInput;
};

export type MutationUpdateBusinessArgs = {
  input: UpdateBusinessInput;
};

export type MutationDeleteBusinessArgs = {
  input: DeleteBusinessInput;
};

export type MutationCreateLocationArgs = {
  input: CreateLocationInput;
};

export type MutationUpdateLocationArgs = {
  input: UpdateLocationInput;
};

export type MutationDeleteLocationArgs = {
  input: DeleteLocationInput;
};

export type MutationCreateClientArgs = {
  input: CreateClientInput;
};

export type MutationUpdateClientArgs = {
  input: UpdateClientInput;
};

export type MutationDeleteClientArgs = {
  input: DeleteClientInput;
};

export type MutationCreateInvoiceArgs = {
  input: CreateInvoiceInput;
};

export type MutationVoidInvoiceArgs = {
  input: VoidInvoiceInput;
};

export type MutationRefundInvoiceArgs = {
  input: RefundInvoiceInput;
};

export type MutationCreateServiceArgs = {
  input: CreateServiceInput;
};

export type MutationUpdateServiceArgs = {
  input: UpdateServiceInput;
};

export type MutationDeleteServiceArgs = {
  input: DeleteServiceInput;
};

export type MutationCreateServiceCategoryArgs = {
  input: CreateServiceCategoryInput;
};

export type MutationUpdateServiceCategoryArgs = {
  input: UpdateServiceCategoryInput;
};

export type MutationDeleteServiceCategoryArgs = {
  input: DeleteServiceCategoryInput;
};

export type MutationCreateAppointmentArgs = {
  input: CreateAppointmentInput;
};

export type MutationUpdateAppointmentArgs = {
  input: UpdateAppointmentInput;
};

export type MutationCheckOutAppointmentArgs = {
  input: CheckOutAppointmentInput;
};

export type MutationCancelAppointmentArgs = {
  input: CancelAppointmentInput;
};

export type MutationMarkNoShowAppointmentArgs = {
  input: MarkNoShowAppointmentInput;
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float'];
  method?: Maybe<PaymentMethod>;
};

export type PaymentInput = {
  amount: Scalars['Float'];
  method?: Maybe<PaymentMethodInput>;
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  name: Scalars['String'];
};

export type PaymentMethodInput = {
  name: Scalars['String'];
};

export type Policy = {
  __typename?: 'Policy';
  id: Scalars['ID'];
  version?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  statements: Array<PolicyStatement>;
};

export type PolicyCondition = {
  __typename?: 'PolicyCondition';
  entity: Scalars['String'];
  field: Scalars['String'];
  value: Scalars['String'];
  operator: Scalars['String'];
};

export enum PolicyEffect {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
}

export type PolicyResource = {
  __typename?: 'PolicyResource';
  entity: Scalars['String'];
  entityId: Scalars['ID'];
  locationId?: Maybe<Scalars['ID']>;
};

export type PolicyStatement = {
  __typename?: 'PolicyStatement';
  effect: PolicyEffect;
  actions: Array<Scalars['String']>;
  resources: Array<PolicyResource>;
  conditions: Array<PolicyCondition>;
};

export enum PredefinedImageSize {
  ORIGINAL = 'ORIGINAL',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  XLARGE = 'XLARGE',
  XXLARGE = 'XXLARGE',
}

export type Query = {
  __typename?: 'Query';
  appointment?: Maybe<Appointment>;
  appointments: Array<Appointment>;
  client?: Maybe<Client>;
  clients: Array<Client>;
  currentBusiness?: Maybe<Business>;
  currentUser?: Maybe<User>;
  employee?: Maybe<Employee>;
  employeeRoles: Array<EmployeeRole>;
  employees: Array<Employee>;
  image?: Maybe<Image>;
  invoice?: Maybe<Invoice>;
  location?: Maybe<Location>;
  locations: Array<Location>;
  service?: Maybe<Service>;
  serviceCategory?: Maybe<ServiceCategory>;
  shift?: Maybe<Shift>;
  shifts: Array<Shift>;
};

export type QueryAppointmentArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type QueryAppointmentsArgs = {
  filter?: Maybe<Scalars['ID']>;
};

export type QueryClientsArgs = {
  businessId: Scalars['ID'];
};

export type QueryEmployeeArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type QueryEmployeeRolesArgs = {
  locationId: Scalars['ID'];
};

export type QueryEmployeesArgs = {
  locationId: Scalars['ID'];
};

export type QueryImageArgs = {
  id?: Maybe<Scalars['ID']>;
  size?: Maybe<PredefinedImageSize>;
};

export type QueryInvoiceArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type QueryLocationArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type QueryServiceArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type QueryServiceCategoryArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type QueryShiftArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type QueryShiftsArgs = {
  locationId: Scalars['ID'];
  filter: ShiftsFilter;
};

export type RefundInvoiceInput = {
  id: Scalars['ID'];
  lineItems: Array<RefundInvoiceLineItemInput>;
  payment: PaymentInput;
};

export type RefundInvoiceLineItemInput = {
  id: Scalars['ID'];
  quantity: Scalars['Int'];
};

export type RefundInvoicePayload = {
  __typename?: 'RefundInvoicePayload';
  invoice?: Maybe<Invoice>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type Service = {
  __typename?: 'Service';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  serviceCategory?: Maybe<ServiceCategory>;
  primaryImage?: Maybe<Image>;
  images: Array<Image>;
  location: Location;
  pricingOptions: Array<ServicePricingOption>;
  questionsForClient: Array<Scalars['String']>;
  paddingTime?: Maybe<ServicePaddingTime>;
  processingTimeAfterServiceEnd?: Maybe<Scalars['Int']>;
  processingTimeDuringService?: Maybe<ServiceProcessingTimeDuringServiceEnd>;
  parallelClientsCount?: Maybe<Scalars['Int']>;
  intervalTime?: Maybe<Scalars['Int']>;
  noteToClient?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
};

export type ServiceCategory = {
  __typename?: 'ServiceCategory';
  id: Scalars['ID'];
  name: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export type ServicePaddingTime = {
  __typename?: 'ServicePaddingTime';
  type: ServicePaddingTimeType;
  duration: Scalars['Int'];
};

export type ServicePaddingTimeInput = {
  type: ServicePaddingTimeType;
  duration: Scalars['Int'];
};

export enum ServicePaddingTimeType {
  BEFORE = 'BEFORE',
  AFTER = 'AFTER',
  BEFORE_AND_AFTER = 'BEFORE_AND_AFTER',
}

export type ServicePricingOption = {
  __typename?: 'ServicePricingOption';
  duration: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  price: Scalars['Float'];
};

export type ServicePricingOptionInput = {
  duration: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  price: Scalars['Float'];
};

export type ServiceProcessingTimeDuringServiceEnd = {
  __typename?: 'ServiceProcessingTimeDuringServiceEnd';
  after: Scalars['Int'];
  duration: Scalars['Int'];
};

export type ServiceProcessingTimeDuringServiceEndInput = {
  after: Scalars['Int'];
  duration: Scalars['Int'];
};

export type Shift = {
  __typename?: 'Shift';
  id: Scalars['ID'];
  recurrence?: Maybe<ShiftRecurrence>;
  breakDuration: Scalars['Int'];
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
  notes?: Maybe<Scalars['String']>;
  employee: Employee;
  location: Location;
  status: ShiftStatus;
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  canceledAt?: Maybe<Scalars['Date']>;
  startedAt?: Maybe<Scalars['Date']>;
  completedAt?: Maybe<Scalars['Date']>;
  markedNoShowAt?: Maybe<Scalars['Date']>;
};

export type ShiftRecurrence = {
  __typename?: 'ShiftRecurrence';
  id: Scalars['ID'];
  initialShift: Shift;
  recurrence: CalendarEventRecurrence;
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export type ShiftsFilter = {
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
  status?: Maybe<ShiftStatus>;
};

export enum ShiftStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CONFIRMED = 'CONFIRMED',
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  CALLED_SICK = 'CALLED_SICK',
}

export type SocialIdentity = {
  __typename?: 'SocialIdentity';
  provider: Scalars['String'];
  providerUserId: Scalars['String'];
  profileData?: Maybe<Scalars['String']>;
};

export type Tip = {
  __typename?: 'Tip';
  amount: Scalars['Float'];
};

export type TipInput = {
  amount: Scalars['Float'];
};

export type UnlinkEmployeeInput = {
  employeeId: Scalars['ID'];
};

export type UnlinkEmployeePayload = {
  __typename?: 'UnlinkEmployeePayload';
  employee?: Maybe<Employee>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateAppointmentInput = {
  id: Scalars['ID'];
  services?: Maybe<Array<AppointmentServiceInput>>;
  internalNotes?: Maybe<Scalars['String']>;
  clientId?: Maybe<Scalars['ID']>;
  clientNotes?: Maybe<Scalars['String']>;
  status?: Maybe<AppointmentStatus>;
  canceledAt?: Maybe<Scalars['Date']>;
  cancellationReason?: Maybe<Scalars['String']>;
  recurrence?: Maybe<CalendarEventRecurrenceInput>;
  applyRecurrence?: Maybe<ApplyRecurrence>;
};

export type UpdateAppointmentPayload = {
  __typename?: 'UpdateAppointmentPayload';
  appointment?: Maybe<Appointment>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateBusinessInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  logoImageId?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  facebookUrl?: Maybe<Scalars['String']>;
};

export type UpdateBusinessPayload = {
  __typename?: 'UpdateBusinessPayload';
  business?: Maybe<Business>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateClientInput = {
  id: Scalars['ID'];
  isBanned?: Maybe<Scalars['Boolean']>;
  contactDetails?: Maybe<ContactDetailsInput>;
  profile?: Maybe<UserProfileInput>;
  notes?: Maybe<Scalars['String']>;
  importantNotes?: Maybe<Scalars['String']>;
  referralSource?: Maybe<Scalars['String']>;
  discount?: Maybe<Scalars['Float']>;
};

export type UpdateClientPayload = {
  __typename?: 'UpdateClientPayload';
  client?: Maybe<Client>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateEmployeeInput = {
  id: Scalars['ID'];
  notes?: Maybe<Scalars['String']>;
  contactDetails?: Maybe<ContactDetailsInput>;
  profile?: Maybe<UserProfileInput>;
  serviceIds?: Maybe<Array<Scalars['ID']>>;
  salarySettings?: Maybe<EmployeeSalarySettingsInput>;
  shiftSettings?: Maybe<EmployeeShiftSettingsInput>;
  employment?: Maybe<EmployeeEmploymentInput>;
};

export type UpdateEmployeePayload = {
  __typename?: 'UpdateEmployeePayload';
  employee?: Maybe<Employee>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateEmployeeRoleInput = {
  id: Scalars['ID'];
  employeeRoleId: Scalars['ID'];
};

export type UpdateEmployeeRolePayload = {
  __typename?: 'UpdateEmployeeRolePayload';
  employee?: Maybe<Employee>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateEmployeeRolePermissionsInput = {
  id: Scalars['ID'];
  permissions: Array<Scalars['String']>;
};

export type UpdateEmployeeRolePermissionsPayload = {
  __typename?: 'UpdateEmployeeRolePermissionsPayload';
  employeeRole: EmployeeRole;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateLocationInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  contactDetails?: Maybe<ContactDetailsInput>;
  address?: Maybe<AddressInput>;
  businessHours?: Maybe<Array<CalendarEventInput>>;
};

export type UpdateLocationPayload = {
  __typename?: 'UpdateLocationPayload';
  location?: Maybe<Location>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateServiceCategoryInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateServiceCategoryPayload = {
  __typename?: 'UpdateServiceCategoryPayload';
  serviceCategory?: Maybe<ServiceCategory>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateServiceInput = {
  id: Scalars['ID'];
  serviceCategoryId?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  pricingOptions: Array<ServicePricingOptionInput>;
  paddingTime?: Maybe<ServicePaddingTimeInput>;
  processingTimeAfterServiceEnd?: Maybe<Scalars['Int']>;
  processingTimeDuringService?: Maybe<
    ServiceProcessingTimeDuringServiceEndInput
  >;
  parallelClientsCount?: Maybe<Scalars['Int']>;
  intervalTime?: Maybe<Scalars['Int']>;
  noteToClient?: Maybe<Scalars['String']>;
  questionsForClient: Array<Scalars['String']>;
  primaryImageId?: Maybe<Scalars['ID']>;
  imageIds: Array<Scalars['ID']>;
};

export type UpdateServicePayload = {
  __typename?: 'UpdateServicePayload';
  service?: Maybe<Service>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateShiftInput = {
  id: Scalars['ID'];
  recurrence?: Maybe<CalendarEventRecurrenceInput>;
  locationId?: Maybe<Scalars['ID']>;
  employeeId: Scalars['ID'];
  breakDuration?: Maybe<Scalars['Int']>;
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
  notes?: Maybe<Scalars['String']>;
  canceledAt?: Maybe<Scalars['Date']>;
  status?: Maybe<ShiftStatus>;
  applyRecurrence: ApplyRecurrence;
};

export type UpdateShiftPayload = {
  __typename?: 'UpdateShiftPayload';
  shift?: Maybe<Shift>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateUserEmailStartInput = {
  id: Scalars['ID'];
  email: Scalars['String'];
};

export type UpdateUserEmailStartPayload = {
  __typename?: 'UpdateUserEmailStartPayload';
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateUserEmailVerifyInput = {
  id: Scalars['ID'];
  code: Scalars['String'];
  email: Scalars['String'];
};

export type UpdateUserEmailVerifyPayload = {
  __typename?: 'UpdateUserEmailVerifyPayload';
  user?: Maybe<User>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateUserPhoneStartInput = {
  phoneNumber: Scalars['String'];
  countryCode: Scalars['String'];
  id: Scalars['ID'];
};

export type UpdateUserPhoneStartPayload = {
  __typename?: 'UpdateUserPhoneStartPayload';
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateUserPhoneVerifyInput = {
  id: Scalars['ID'];
  code: Scalars['String'];
  phoneNumber: Scalars['String'];
  countryCode: Scalars['String'];
};

export type UpdateUserPhoneVerifyPayload = {
  __typename?: 'UpdateUserPhoneVerifyPayload';
  user?: Maybe<User>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UpdateUserProfileInput = {
  id: Scalars['ID'];
  profile?: Maybe<UserProfileInput>;
};

export type UpdateUserProfilePayload = {
  __typename?: 'UpdateUserProfilePayload';
  user?: Maybe<User>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  profile?: Maybe<UserProfile>;
  account: UserAccount;
  isActive: Scalars['Boolean'];
  businesses: Array<Business>;
  employeeInvitations: Array<EmployeeInvitation>;
  policies: Array<Policy>;
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export type UserAccount = {
  __typename?: 'UserAccount';
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  isEmailVerified: Scalars['Boolean'];
  isPhoneVerified: Scalars['Boolean'];
  socialIdentities: Array<SocialIdentity>;
  logins: Array<AccountLogin>;
};

export type UserError = {
  __typename?: 'UserError';
  code: Scalars['String'];
  message: Scalars['String'];
  errors: Array<ValidationError>;
};

export type UserProfile = {
  __typename?: 'UserProfile';
  profileImage?: Maybe<Image>;
  fullName: Scalars['String'];
  birthday?: Maybe<Scalars['Date']>;
  gender?: Maybe<GraphQlPersonGender>;
};

export type UserProfileInput = {
  profileImageId?: Maybe<Scalars['ID']>;
  fullName: Scalars['String'];
  birthday?: Maybe<Scalars['Date']>;
  gender?: Maybe<GraphQlPersonGender>;
};

export type ValidationError = {
  __typename?: 'ValidationError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type VoidInvoiceInput = {
  id: Scalars['ID'];
};

export type VoidInvoicePayload = {
  __typename?: 'VoidInvoicePayload';
  invoice?: Maybe<Invoice>;
  isSuccessful: Scalars['Boolean'];
  userError?: Maybe<UserError>;
};

export type UserErrorFragment = { __typename?: 'UserError' } & Pick<
  UserError,
  'code' | 'message'
> & {
    errors: Array<
      { __typename?: 'ValidationError' } & Pick<
        ValidationError,
        'field' | 'message'
      >
    >;
  };

export type UserAccountFragment = { __typename?: 'UserAccount' } & Pick<
  UserAccount,
  | 'email'
  | 'phoneNumber'
  | 'countryCode'
  | 'isEmailVerified'
  | 'isPhoneVerified'
>;

export type UserFragment = { __typename?: 'User' } & Pick<
  User,
  'id' | 'isActive' | 'createdAt' | 'updatedAt'
> & {
    account: { __typename?: 'UserAccount' } & UserAccountFragment;
    profile: Maybe<{ __typename?: 'UserProfile' } & UserProfileFragment>;
  };

export type PolicyFragment = { __typename?: 'Policy' } & Pick<
  Policy,
  'id' | 'version' | 'name' | 'createdAt' | 'updatedAt'
> & {
    statements: Array<
      { __typename?: 'PolicyStatement' } & Pick<
        PolicyStatement,
        'effect' | 'actions'
      > & {
          resources: Array<
            { __typename?: 'PolicyResource' } & Pick<
              PolicyResource,
              'entity' | 'entityId' | 'locationId'
            >
          >;
          conditions: Array<
            { __typename?: 'PolicyCondition' } & Pick<
              PolicyCondition,
              'entity' | 'field' | 'value' | 'operator'
            >
          >;
        }
    >;
  };

export type CurrentUserFragment = { __typename?: 'User' } & {
  businesses: Array<{ __typename?: 'Business' } & BusinessFragment>;
  policies: Array<{ __typename?: 'Policy' } & PolicyFragment>;
} & UserFragment;

export type CurrentBusinessFragment = { __typename?: 'Business' } & {
  assignedLocations: Array<{ __typename?: 'Location' } & LocationFragment>;
} & BusinessFragment;

export type UserProfileFragment = { __typename?: 'UserProfile' } & Pick<
  UserProfile,
  'fullName' | 'gender'
> & { profileImage: Maybe<{ __typename?: 'Image' } & ImageFragment> };

export type BusinessFragment = { __typename?: 'Business' } & Pick<
  Business,
  | 'id'
  | 'name'
  | 'email'
  | 'countryCode'
  | 'phoneNumber'
  | 'facebookUrl'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> & {
    owner: { __typename?: 'User' } & UserFragment;
    logoImage: Maybe<{ __typename?: 'Image' } & ImageFragment>;
  };

export type EmployeeRoleFragment = { __typename?: 'EmployeeRole' } & Pick<
  EmployeeRole,
  'id' | 'name' | 'permissions'
>;

export type CalendarEventRecurrenceFragment = {
  __typename?: 'CalendarEventRecurrence';
} & Pick<
  CalendarEventRecurrence,
  | 'startDate'
  | 'frequency'
  | 'interval'
  | 'count'
  | 'weekStart'
  | 'until'
  | 'timezoneId'
  | 'bySetPosition'
  | 'byMonth'
  | 'byMonthDay'
  | 'byYearDay'
  | 'byWeekNumber'
  | 'byWeekDay'
  | 'byHour'
  | 'byMinute'
  | 'bySecond'
>;

export type ContactDetailsFragment = { __typename?: 'ContactDetails' } & Pick<
  ContactDetails,
  'countryCode' | 'phoneNumber' | 'email'
>;

export type AddressFragment = { __typename?: 'Address' } & Pick<
  Address,
  | 'streetAddressOne'
  | 'streetAddressTwo'
  | 'district'
  | 'city'
  | 'country'
  | 'postalCode'
>;

export type LocationFragment = { __typename?: 'Location' } & Pick<
  Location,
  'id' | 'name' | 'createdAt' | 'deletedAt' | 'updatedAt'
> & {
    contactDetails: Maybe<
      { __typename?: 'ContactDetails' } & ContactDetailsFragment
    >;
    address: Maybe<{ __typename?: 'Address' } & AddressFragment>;
    businessHours: Maybe<
      Array<
        { __typename?: 'CalendarEvent' } & Pick<
          CalendarEvent,
          'startDate' | 'endDate'
        > & {
            recurrence: Maybe<
              {
                __typename?: 'CalendarEventRecurrence';
              } & CalendarEventRecurrenceFragment
            >;
          }
      >
    >;
  };

export type LocationWithEmployeesFragment = { __typename?: 'Location' } & {
  employees: Array<{ __typename?: 'Employee' } & EmployeeFragment>;
} & LocationFragment;

export type LocationWithEmployeeRolesFragment = { __typename?: 'Location' } & {
  employeeRoles: Array<{ __typename?: 'EmployeeRole' } & EmployeeRoleFragment>;
} & LocationFragment;

export type ImageFragment = { __typename?: 'Image' } & Pick<
  Image,
  | 'id'
  | 'width'
  | 'height'
  | 'format'
  | 'url'
  | 'filename'
  | 'mimetype'
  | 'encoding'
  | 'createdAt'
  | 'cloudStorageProvider'
> & {
    sizes: Array<
      { __typename?: 'ImageSizeType' } & Pick<
        ImageSizeType,
        'width' | 'height' | 'size' | 'key' | 'url'
      >
    >;
  };

export type EmployeeInvitationFragment = {
  __typename?: 'EmployeeInvitation';
} & Pick<
  EmployeeInvitation,
  | 'id'
  | 'phoneNumber'
  | 'countryCode'
  | 'token'
  | 'expirationDate'
  | 'createdAt'
  | 'updatedAt'
>;

export type EmployeeInvitationWithBusinessInfoFragment = {
  __typename?: 'EmployeeInvitation';
} & {
  employee: { __typename?: 'Employee' } & {
    location: { __typename?: 'Location' } & {
      business: { __typename?: 'Business' } & BusinessFragment;
    } & LocationFragment;
  } & EmployeeFragment;
} & EmployeeInvitationFragment;

export type EmployeeSalarySettingsFragment = {
  __typename?: 'EmployeeSalarySettings';
} & Pick<
  EmployeeSalarySettings,
  'wage' | 'productCommission' | 'serviceCommission' | 'voucherCommission'
>;

export type EmployeeShiftSettingsFragment = {
  __typename?: 'EmployeeShiftSettings';
} & Pick<EmployeeShiftSettings, 'appointmentColor' | 'canHaveAppointments'>;

export type EmployeeEmploymentFragment = {
  __typename?: 'EmployeeEmployment';
} & Pick<
  EmployeeEmployment,
  'title' | 'employmentEndDate' | 'employmentStartDate'
>;

export type EmployeeFragment = { __typename?: 'Employee' } & Pick<
  Employee,
  'id' | 'notes' | 'createdAt' | 'deletedAt' | 'updatedAt'
> & {
    location: { __typename?: 'Location' } & LocationFragment;
    employeeRole: Maybe<{ __typename?: 'EmployeeRole' } & EmployeeRoleFragment>;
    contactDetails: Maybe<
      { __typename?: 'ContactDetails' } & ContactDetailsFragment
    >;
    user: Maybe<
      { __typename?: 'User' } & Pick<User, 'id' | 'isActive'> & {
          profile: Maybe<{ __typename?: 'UserProfile' } & UserProfileFragment>;
          account: { __typename?: 'UserAccount' } & UserAccountFragment;
        }
    >;
    profile: { __typename?: 'UserProfile' } & UserProfileFragment;
    salarySettings: Maybe<
      { __typename?: 'EmployeeSalarySettings' } & EmployeeSalarySettingsFragment
    >;
    shiftSettings: Maybe<
      { __typename?: 'EmployeeShiftSettings' } & EmployeeShiftSettingsFragment
    >;
    employment: Maybe<
      { __typename?: 'EmployeeEmployment' } & EmployeeEmploymentFragment
    >;
    invitation: Maybe<
      { __typename?: 'EmployeeInvitation' } & EmployeeInvitationFragment
    >;
  };

export type ClientFragment = { __typename?: 'Client' } & Pick<
  Client,
  | 'id'
  | 'isBanned'
  | 'notes'
  | 'importantNotes'
  | 'referralSource'
  | 'discount'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> & {
    contactDetails: Maybe<
      { __typename?: 'ContactDetails' } & ContactDetailsFragment
    >;
    profile: { __typename?: 'UserProfile' } & UserProfileFragment;
  };

export type ShiftRecurrenceFragment = { __typename?: 'ShiftRecurrence' } & Pick<
  ShiftRecurrence,
  'id' | 'createdAt' | 'updatedAt'
> & {
    recurrence: {
      __typename?: 'CalendarEventRecurrence';
    } & CalendarEventRecurrenceFragment;
  };

export type ShiftFragment = { __typename?: 'Shift' } & Pick<
  Shift,
  | 'id'
  | 'breakDuration'
  | 'startDate'
  | 'endDate'
  | 'notes'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'canceledAt'
  | 'startedAt'
  | 'completedAt'
  | 'markedNoShowAt'
> & {
    recurrence: Maybe<
      { __typename?: 'ShiftRecurrence' } & ShiftRecurrenceFragment
    >;
    employee: { __typename?: 'Employee' } & EmployeeFragment;
    location: { __typename?: 'Location' } & LocationFragment;
  };

export type CreateBusinessMutationVariables = {
  input: CreateBusinessInput;
};

export type CreateBusinessMutation = { __typename?: 'Mutation' } & {
  createBusiness: Maybe<
    { __typename?: 'CreateBusinessPayload' } & Pick<
      CreateBusinessPayload,
      'isSuccessful'
    > & {
        business: Maybe<{ __typename?: 'Business' } & BusinessFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type UpdateBusinessMutationVariables = {
  input: UpdateBusinessInput;
};

export type UpdateBusinessMutation = { __typename?: 'Mutation' } & {
  updateBusiness: Maybe<
    { __typename?: 'UpdateBusinessPayload' } & Pick<
      UpdateBusinessPayload,
      'isSuccessful'
    > & {
        business: Maybe<{ __typename?: 'Business' } & BusinessFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type DeleteBusinessMutationVariables = {
  input: DeleteBusinessInput;
};

export type DeleteBusinessMutation = { __typename?: 'Mutation' } & {
  deleteBusiness: Maybe<
    { __typename?: 'DeleteBusinessPayload' } & Pick<
      DeleteBusinessPayload,
      'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type CreateLocationMutationVariables = {
  input: CreateLocationInput;
};

export type CreateLocationMutation = { __typename?: 'Mutation' } & {
  createLocation: Maybe<
    { __typename?: 'CreateLocationPayload' } & Pick<
      CreateLocationPayload,
      'isSuccessful'
    > & {
        location: Maybe<{ __typename?: 'Location' } & LocationFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type UpdateLocationMutationVariables = {
  input: UpdateLocationInput;
};

export type UpdateLocationMutation = { __typename?: 'Mutation' } & {
  updateLocation: Maybe<
    { __typename?: 'UpdateLocationPayload' } & Pick<
      UpdateLocationPayload,
      'isSuccessful'
    > & {
        location: Maybe<{ __typename?: 'Location' } & LocationFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type DeleteLocationMutationVariables = {
  input: DeleteLocationInput;
};

export type DeleteLocationMutation = { __typename?: 'Mutation' } & {
  deleteLocation: Maybe<
    { __typename?: 'DeleteLocationPayload' } & Pick<
      DeleteLocationPayload,
      'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type LogInFacebookMutationVariables = {
  input: LogInFacebookInput;
};

export type LogInFacebookMutation = { __typename?: 'Mutation' } & {
  logInFacebook: Maybe<
    { __typename?: 'LogInFacebookPayload' } & Pick<
      LogInFacebookPayload,
      'isSuccessful' | 'accessToken'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type LogInGoogleMutationVariables = {
  input: LogInGoogleInput;
};

export type LogInGoogleMutation = { __typename?: 'Mutation' } & {
  logInGoogle: Maybe<
    { __typename?: 'LogInGooglePayload' } & Pick<
      LogInGooglePayload,
      'isSuccessful' | 'accessToken'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type LogInEmailStartMutationVariables = {
  input: LogInEmailStartInput;
};

export type LogInEmailStartMutation = { __typename?: 'Mutation' } & {
  logInEmailStart: Maybe<
    { __typename?: 'LogInEmailStartPayload' } & Pick<
      LogInEmailStartPayload,
      'state' | 'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type LogInEmailVerifyMutationVariables = {
  input: LogInEmailVerifyInput;
};

export type LogInEmailVerifyMutation = { __typename?: 'Mutation' } & {
  logInEmailVerify: Maybe<
    { __typename?: 'LogInEmailVerifyPayload' } & Pick<
      LogInEmailVerifyPayload,
      'accessToken' | 'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type LogInPhoneStartMutationVariables = {
  input: LogInPhoneStartInput;
};

export type LogInPhoneStartMutation = { __typename?: 'Mutation' } & {
  logInPhoneStart: Maybe<
    { __typename?: 'LogInPhoneStartPayload' } & Pick<
      LogInPhoneStartPayload,
      'state' | 'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type LogInPhoneVerifyMutationVariables = {
  input: LogInPhoneVerifyInput;
};

export type LogInPhoneVerifyMutation = { __typename?: 'Mutation' } & {
  logInPhoneVerify: Maybe<
    { __typename?: 'LogInPhoneVerifyPayload' } & Pick<
      LogInPhoneVerifyPayload,
      'accessToken' | 'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type UpdateUserEmailStartMutationVariables = {
  input: UpdateUserEmailStartInput;
};

export type UpdateUserEmailStartMutation = { __typename?: 'Mutation' } & {
  updateUserEmailStart: Maybe<
    { __typename?: 'UpdateUserEmailStartPayload' } & Pick<
      UpdateUserEmailStartPayload,
      'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type UpdateUserEmailVerifyMutationVariables = {
  input: UpdateUserEmailVerifyInput;
};

export type UpdateUserEmailVerifyMutation = { __typename?: 'Mutation' } & {
  updateUserEmailVerify: Maybe<
    { __typename?: 'UpdateUserEmailVerifyPayload' } & Pick<
      UpdateUserEmailVerifyPayload,
      'isSuccessful'
    > & {
        user: Maybe<
          { __typename?: 'User' } & Pick<User, 'id'> & {
              account: { __typename?: 'UserAccount' } & UserAccountFragment;
            }
        >;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type UpdateUserPhoneStartMutationVariables = {
  input: UpdateUserPhoneStartInput;
};

export type UpdateUserPhoneStartMutation = { __typename?: 'Mutation' } & {
  updateUserPhoneStart: Maybe<
    { __typename?: 'UpdateUserPhoneStartPayload' } & Pick<
      UpdateUserPhoneStartPayload,
      'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type UpdateUserPhoneVerifyMutationVariables = {
  input: UpdateUserPhoneVerifyInput;
};

export type UpdateUserPhoneVerifyMutation = { __typename?: 'Mutation' } & {
  updateUserPhoneVerify: Maybe<
    { __typename?: 'UpdateUserPhoneVerifyPayload' } & Pick<
      UpdateUserPhoneVerifyPayload,
      'isSuccessful'
    > & {
        user: Maybe<
          { __typename?: 'User' } & Pick<User, 'id'> & {
              account: { __typename?: 'UserAccount' } & UserAccountFragment;
            }
        >;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type UpdateUserProfileMutationVariables = {
  input: UpdateUserProfileInput;
};

export type UpdateUserProfileMutation = { __typename?: 'Mutation' } & {
  updateUserProfile: Maybe<
    { __typename?: 'UpdateUserProfilePayload' } & Pick<
      UpdateUserProfilePayload,
      'isSuccessful'
    > & {
        user: Maybe<
          { __typename?: 'User' } & Pick<User, 'id'> & {
              profile: Maybe<
                { __typename?: 'UserProfile' } & UserProfileFragment
              >;
            }
        >;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type LinkFacebookAccountMutationVariables = {
  input: LinkFacebookAccountInput;
};

export type LinkFacebookAccountMutation = { __typename?: 'Mutation' } & {
  linkFacebookAccount: Maybe<
    { __typename?: 'LinkFacebookAccountPayload' } & Pick<
      LinkFacebookAccountPayload,
      'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type DisconnectFacebookMutationVariables = {
  input: DisconnectFacebookInput;
};

export type DisconnectFacebookMutation = { __typename?: 'Mutation' } & {
  disconnectFacebook: Maybe<
    { __typename?: 'DisconnectFacebookPayload' } & Pick<
      DisconnectFacebookPayload,
      'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type LinkGoogleAccountMutationVariables = {
  input: LinkGoogleAccountInput;
};

export type LinkGoogleAccountMutation = { __typename?: 'Mutation' } & {
  linkGoogleAccount: Maybe<
    { __typename?: 'LinkGoogleAccountPayload' } & Pick<
      LinkGoogleAccountPayload,
      'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type DisconnectGoogleMutationVariables = {
  input: DisconnectGoogleInput;
};

export type DisconnectGoogleMutation = { __typename?: 'Mutation' } & {
  disconnectGoogle: Maybe<
    { __typename?: 'DisconnectGooglePayload' } & Pick<
      DisconnectGooglePayload,
      'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type DeactivateUserMutationVariables = {
  input: DeactivateUserInput;
};

export type DeactivateUserMutation = { __typename?: 'Mutation' } & {
  deactivateUser: Maybe<
    { __typename?: 'DeactivateUserPayload' } & Pick<
      DeactivateUserPayload,
      'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type CreateEmployeeMutationVariables = {
  input: CreateEmployeeInput;
};

export type CreateEmployeeMutation = { __typename?: 'Mutation' } & {
  createEmployee: Maybe<
    { __typename?: 'CreateEmployeePayload' } & Pick<
      CreateEmployeePayload,
      'isSuccessful'
    > & {
        employee: Maybe<{ __typename?: 'Employee' } & EmployeeFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type UpdateEmployeeMutationVariables = {
  input: UpdateEmployeeInput;
};

export type UpdateEmployeeMutation = { __typename?: 'Mutation' } & {
  updateEmployee: Maybe<
    { __typename?: 'UpdateEmployeePayload' } & Pick<
      UpdateEmployeePayload,
      'isSuccessful'
    > & {
        employee: Maybe<{ __typename?: 'Employee' } & EmployeeFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type UpdateEmployeeRoleMutationVariables = {
  input: UpdateEmployeeRoleInput;
};

export type UpdateEmployeeRoleMutation = { __typename?: 'Mutation' } & {
  updateEmployeeRole: Maybe<
    { __typename?: 'UpdateEmployeeRolePayload' } & Pick<
      UpdateEmployeeRolePayload,
      'isSuccessful'
    > & {
        employee: Maybe<{ __typename?: 'Employee' } & EmployeeFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type UpdateEmployeeRolePermissionsMutationVariables = {
  input: UpdateEmployeeRolePermissionsInput;
};

export type UpdateEmployeeRolePermissionsMutation = {
  __typename?: 'Mutation';
} & {
  updateEmployeeRolePermissions: Maybe<
    { __typename?: 'UpdateEmployeeRolePermissionsPayload' } & Pick<
      UpdateEmployeeRolePermissionsPayload,
      'isSuccessful'
    > & {
        employeeRole: { __typename?: 'EmployeeRole' } & EmployeeRoleFragment;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type DeleteEmployeeMutationVariables = {
  input: DeleteEmployeeInput;
};

export type DeleteEmployeeMutation = { __typename?: 'Mutation' } & {
  deleteEmployee: Maybe<
    { __typename?: 'DeleteEmployeePayload' } & Pick<
      DeleteEmployeePayload,
      'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type UpdateClientMutationVariables = {
  input: UpdateClientInput;
};

export type UpdateClientMutation = { __typename?: 'Mutation' } & {
  updateClient: Maybe<
    { __typename?: 'UpdateClientPayload' } & Pick<
      UpdateClientPayload,
      'isSuccessful'
    > & {
        client: Maybe<{ __typename?: 'Client' } & ClientFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type CreateClientMutationVariables = {
  input: CreateClientInput;
};

export type CreateClientMutation = { __typename?: 'Mutation' } & {
  createClient: Maybe<
    { __typename?: 'CreateClientPayload' } & Pick<
      CreateClientPayload,
      'isSuccessful'
    > & {
        client: Maybe<{ __typename?: 'Client' } & ClientFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type InviteEmployeeMutationVariables = {
  input: InviteEmployeeInput;
};

export type InviteEmployeeMutation = { __typename?: 'Mutation' } & {
  inviteEmployee: Maybe<
    { __typename?: 'InviteEmployeePayload' } & Pick<
      InviteEmployeePayload,
      'isSuccessful'
    > & {
        employee: Maybe<{ __typename?: 'Employee' } & EmployeeFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type AcceptEmployeeInvitationMutationVariables = {
  input: AcceptEmployeeInvitationInput;
};

export type AcceptEmployeeInvitationMutation = { __typename?: 'Mutation' } & {
  acceptEmployeeInvitation: Maybe<
    { __typename?: 'AcceptEmployeeInvitationPayload' } & Pick<
      AcceptEmployeeInvitationPayload,
      'isSuccessful'
    > & {
        employee: Maybe<{ __typename?: 'Employee' } & EmployeeFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type DeclineEmployeeInvitationMutationVariables = {
  input: DeclineEmployeeInvitationInput;
};

export type DeclineEmployeeInvitationMutation = { __typename?: 'Mutation' } & {
  declineEmployeeInvitation: Maybe<
    { __typename?: 'DeclineEmployeeInvitationPayload' } & Pick<
      DeclineEmployeeInvitationPayload,
      'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type CancelEmployeeInvitationMutationVariables = {
  input: CancelEmployeeInvitationInput;
};

export type CancelEmployeeInvitationMutation = { __typename?: 'Mutation' } & {
  cancelEmployeeInvitation: Maybe<
    { __typename?: 'CancelEmployeeInvitationPayload' } & Pick<
      CancelEmployeeInvitationPayload,
      'isSuccessful'
    > & {
        employee: Maybe<{ __typename?: 'Employee' } & EmployeeFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type UnlinkEmployeeMutationVariables = {
  input: UnlinkEmployeeInput;
};

export type UnlinkEmployeeMutation = { __typename?: 'Mutation' } & {
  unlinkEmployee: Maybe<
    { __typename?: 'UnlinkEmployeePayload' } & Pick<
      UnlinkEmployeePayload,
      'isSuccessful'
    > & {
        employee: Maybe<{ __typename?: 'Employee' } & EmployeeFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type CreateShiftMutationVariables = {
  input: CreateShiftInput;
};

export type CreateShiftMutation = { __typename?: 'Mutation' } & {
  createShift: Maybe<
    { __typename?: 'CreateShiftPayload' } & Pick<
      CreateShiftPayload,
      'isSuccessful'
    > & {
        shift: Maybe<{ __typename?: 'Shift' } & ShiftFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type UpdateShiftMutationVariables = {
  input: UpdateShiftInput;
};

export type UpdateShiftMutation = { __typename?: 'Mutation' } & {
  updateShift: Maybe<
    { __typename?: 'UpdateShiftPayload' } & Pick<
      UpdateShiftPayload,
      'isSuccessful'
    > & {
        shift: Maybe<{ __typename?: 'Shift' } & ShiftFragment>;
        userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment>;
      }
  >;
};

export type CancelShiftMutationVariables = {
  input: CancelShiftInput;
};

export type CancelShiftMutation = { __typename?: 'Mutation' } & {
  cancelShift: Maybe<
    { __typename?: 'CancelShiftPayload' } & Pick<
      CancelShiftPayload,
      'isSuccessful'
    > & { userError: Maybe<{ __typename?: 'UserError' } & UserErrorFragment> }
  >;
};

export type CurrentUserQueryVariables = {};

export type CurrentUserQuery = { __typename?: 'Query' } & {
  currentUser: Maybe<{ __typename?: 'User' } & CurrentUserFragment>;
};

export type CurrentBusinessQueryVariables = {};

export type CurrentBusinessQuery = { __typename?: 'Query' } & {
  currentBusiness: Maybe<{ __typename?: 'Business' } & CurrentBusinessFragment>;
};

export type EmployeesQueryVariables = {
  locationId: Scalars['ID'];
};

export type EmployeesQuery = { __typename?: 'Query' } & {
  employees: Array<{ __typename?: 'Employee' } & EmployeeFragment>;
};

export type EmployeesShiftsQueryVariables = {
  locationId: Scalars['ID'];
  filter: ShiftsFilter;
};

export type EmployeesShiftsQuery = { __typename?: 'Query' } & {
  employees: Array<
    { __typename?: 'Employee' } & {
      shifts: Array<{ __typename?: 'Shift' } & ShiftFragment>;
    } & EmployeeFragment
  >;
};

export type ShiftsQueryVariables = {
  locationId: Scalars['ID'];
  filter: ShiftsFilter;
};

export type ShiftsQuery = { __typename?: 'Query' } & {
  shifts: Array<{ __typename?: 'Shift' } & ShiftFragment>;
};

export type EmployeesAndShiftsQueryVariables = {
  locationId: Scalars['ID'];
  filter: ShiftsFilter;
};

export type EmployeesAndShiftsQuery = { __typename?: 'Query' } & {
  employees: Array<{ __typename?: 'Employee' } & EmployeeFragment>;
  shifts: Array<{ __typename?: 'Shift' } & ShiftFragment>;
};

export type EmployeeQueryVariables = {
  id: Scalars['ID'];
};

export type EmployeeQuery = { __typename?: 'Query' } & {
  employee: Maybe<{ __typename?: 'Employee' } & EmployeeFragment>;
};

export type EmployeeShiftsQueryVariables = {
  id: Scalars['ID'];
  filter: ShiftsFilter;
};

export type EmployeeShiftsQuery = { __typename?: 'Query' } & {
  employee: Maybe<
    { __typename?: 'Employee' } & {
      shifts: Array<{ __typename?: 'Shift' } & ShiftFragment>;
    } & EmployeeFragment
  >;
};

export type CurrentUserInvitationsQueryVariables = {};

export type CurrentUserInvitationsQuery = { __typename?: 'Query' } & {
  currentUser: Maybe<
    { __typename?: 'User' } & Pick<User, 'id'> & {
        employeeInvitations: Array<
          {
            __typename?: 'EmployeeInvitation';
          } & EmployeeInvitationWithBusinessInfoFragment
        >;
      }
  >;
};

export type EmployeeRolesQueryVariables = {
  locationId: Scalars['ID'];
};

export type EmployeeRolesQuery = { __typename?: 'Query' } & {
  employeeRoles: Array<{ __typename?: 'EmployeeRole' } & EmployeeRoleFragment>;
};

export type LocationsQueryVariables = {};

export type LocationsQuery = { __typename?: 'Query' } & {
  locations: Array<{ __typename?: 'Location' } & LocationFragment>;
};

export type ImageQueryVariables = {
  id: Scalars['ID'];
};

export type ImageQuery = { __typename?: 'Query' } & {
  image: Maybe<{ __typename?: 'Image' } & ImageFragment>;
};

export type LocationQueryVariables = {
  id: Scalars['ID'];
};

export type LocationQuery = { __typename?: 'Query' } & {
  location: Maybe<{ __typename?: 'Location' } & LocationFragment>;
};

export type ClientsQueryVariables = {
  businessId: Scalars['ID'];
};

export type ClientsQuery = { __typename?: 'Query' } & {
  clients: Array<{ __typename?: 'Client' } & ClientFragment>;
};

export type ShiftQueryVariables = {
  id: Scalars['ID'];
};

export type ShiftQuery = { __typename?: 'Query' } & {
  shift: Maybe<{ __typename?: 'Shift' } & ShiftFragment>;
};

export const UserErrorFragmentDoc = gql`
  fragment UserError on UserError {
    code
    message
    errors {
      field
      message
    }
  }
`;
export const UserAccountFragmentDoc = gql`
  fragment UserAccount on UserAccount {
    email
    phoneNumber
    countryCode
    isEmailVerified
    isPhoneVerified
  }
`;
export const ImageFragmentDoc = gql`
  fragment Image on Image {
    id
    width
    height
    format
    url
    filename
    mimetype
    encoding
    createdAt
    cloudStorageProvider
    sizes {
      width
      height
      size
      key
      url
    }
  }
`;
export const UserProfileFragmentDoc = gql`
  fragment UserProfile on UserProfile {
    fullName
    gender
    profileImage {
      ...Image
    }
  }
  ${ImageFragmentDoc}
`;
export const UserFragmentDoc = gql`
  fragment User on User {
    id
    isActive
    createdAt
    updatedAt
    account {
      ...UserAccount
    }
    profile {
      ...UserProfile
    }
  }
  ${UserAccountFragmentDoc}
  ${UserProfileFragmentDoc}
`;
export const BusinessFragmentDoc = gql`
  fragment Business on Business {
    id
    name
    email
    countryCode
    phoneNumber
    facebookUrl
    owner {
      ...User
    }
    createdAt
    updatedAt
    deletedAt
    logoImage {
      ...Image
    }
  }
  ${UserFragmentDoc}
  ${ImageFragmentDoc}
`;
export const PolicyFragmentDoc = gql`
  fragment Policy on Policy {
    id
    version
    name
    createdAt
    updatedAt
    statements {
      effect
      actions
      resources {
        entity
        entityId
        locationId
      }
      conditions {
        entity
        field
        value
        operator
      }
    }
  }
`;
export const CurrentUserFragmentDoc = gql`
  fragment CurrentUser on User {
    ...User
    businesses {
      ...Business
    }
    policies {
      ...Policy
    }
  }
  ${UserFragmentDoc}
  ${BusinessFragmentDoc}
  ${PolicyFragmentDoc}
`;
export const ContactDetailsFragmentDoc = gql`
  fragment ContactDetails on ContactDetails {
    countryCode
    phoneNumber
    email
  }
`;
export const AddressFragmentDoc = gql`
  fragment Address on Address {
    streetAddressOne
    streetAddressTwo
    district
    city
    country
    postalCode
  }
`;
export const CalendarEventRecurrenceFragmentDoc = gql`
  fragment CalendarEventRecurrence on CalendarEventRecurrence {
    startDate
    frequency
    interval
    count
    weekStart
    until
    timezoneId
    bySetPosition
    byMonth
    byMonthDay
    byYearDay
    byWeekNumber
    byWeekDay
    byHour
    byMinute
    bySecond
  }
`;
export const LocationFragmentDoc = gql`
  fragment Location on Location {
    id
    name
    contactDetails {
      ...ContactDetails
    }
    address {
      ...Address
    }
    businessHours {
      startDate
      endDate
      recurrence {
        ...CalendarEventRecurrence
      }
    }
    createdAt
    deletedAt
    updatedAt
  }
  ${ContactDetailsFragmentDoc}
  ${AddressFragmentDoc}
  ${CalendarEventRecurrenceFragmentDoc}
`;
export const CurrentBusinessFragmentDoc = gql`
  fragment CurrentBusiness on Business {
    ...Business
    assignedLocations {
      ...Location
    }
  }
  ${BusinessFragmentDoc}
  ${LocationFragmentDoc}
`;
export const EmployeeRoleFragmentDoc = gql`
  fragment EmployeeRole on EmployeeRole {
    id
    name
    permissions
  }
`;
export const EmployeeSalarySettingsFragmentDoc = gql`
  fragment EmployeeSalarySettings on EmployeeSalarySettings {
    wage
    productCommission
    serviceCommission
    voucherCommission
  }
`;
export const EmployeeShiftSettingsFragmentDoc = gql`
  fragment EmployeeShiftSettings on EmployeeShiftSettings {
    appointmentColor
    canHaveAppointments
  }
`;
export const EmployeeEmploymentFragmentDoc = gql`
  fragment EmployeeEmployment on EmployeeEmployment {
    title
    employmentEndDate
    employmentStartDate
  }
`;
export const EmployeeInvitationFragmentDoc = gql`
  fragment EmployeeInvitation on EmployeeInvitation {
    id
    phoneNumber
    countryCode
    token
    expirationDate
    createdAt
    updatedAt
  }
`;
export const EmployeeFragmentDoc = gql`
  fragment Employee on Employee {
    id
    location {
      ...Location
    }
    employeeRole {
      ...EmployeeRole
    }
    contactDetails {
      ...ContactDetails
    }
    user {
      id
      isActive
      profile {
        ...UserProfile
      }
      account {
        ...UserAccount
      }
    }
    profile {
      ...UserProfile
    }
    notes
    salarySettings {
      ...EmployeeSalarySettings
    }
    shiftSettings {
      ...EmployeeShiftSettings
    }
    employment {
      ...EmployeeEmployment
    }
    invitation {
      ...EmployeeInvitation
    }
    createdAt
    deletedAt
    updatedAt
  }
  ${LocationFragmentDoc}
  ${EmployeeRoleFragmentDoc}
  ${ContactDetailsFragmentDoc}
  ${UserProfileFragmentDoc}
  ${UserAccountFragmentDoc}
  ${EmployeeSalarySettingsFragmentDoc}
  ${EmployeeShiftSettingsFragmentDoc}
  ${EmployeeEmploymentFragmentDoc}
  ${EmployeeInvitationFragmentDoc}
`;
export const LocationWithEmployeesFragmentDoc = gql`
  fragment LocationWithEmployees on Location {
    ...Location
    employees {
      ...Employee
    }
  }
  ${LocationFragmentDoc}
  ${EmployeeFragmentDoc}
`;
export const LocationWithEmployeeRolesFragmentDoc = gql`
  fragment LocationWithEmployeeRoles on Location {
    ...Location
    employeeRoles {
      ...EmployeeRole
    }
  }
  ${LocationFragmentDoc}
  ${EmployeeRoleFragmentDoc}
`;
export const EmployeeInvitationWithBusinessInfoFragmentDoc = gql`
  fragment EmployeeInvitationWithBusinessInfo on EmployeeInvitation {
    ...EmployeeInvitation
    employee {
      ...Employee
      location {
        ...Location
        business {
          ...Business
        }
      }
    }
  }
  ${EmployeeInvitationFragmentDoc}
  ${EmployeeFragmentDoc}
  ${LocationFragmentDoc}
  ${BusinessFragmentDoc}
`;
export const ClientFragmentDoc = gql`
  fragment Client on Client {
    id
    isBanned
    contactDetails {
      ...ContactDetails
    }
    profile {
      ...UserProfile
    }
    notes
    importantNotes
    referralSource
    discount
    createdAt
    updatedAt
    deletedAt
  }
  ${ContactDetailsFragmentDoc}
  ${UserProfileFragmentDoc}
`;
export const ShiftRecurrenceFragmentDoc = gql`
  fragment ShiftRecurrence on ShiftRecurrence {
    id
    recurrence {
      ...CalendarEventRecurrence
    }
    createdAt
    updatedAt
  }
  ${CalendarEventRecurrenceFragmentDoc}
`;
export const ShiftFragmentDoc = gql`
  fragment Shift on Shift {
    id
    recurrence {
      ...ShiftRecurrence
    }
    employee {
      ...Employee
    }
    location {
      ...Location
    }
    breakDuration
    startDate
    endDate
    notes
    status
    createdAt
    updatedAt
    canceledAt
    startedAt
    completedAt
    markedNoShowAt
  }
  ${ShiftRecurrenceFragmentDoc}
  ${EmployeeFragmentDoc}
  ${LocationFragmentDoc}
`;
export const CreateBusinessDocument = gql`
  mutation CreateBusiness($input: CreateBusinessInput!) {
    createBusiness(input: $input) {
      business {
        ...Business
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${BusinessFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type CreateBusinessMutationFn = ApolloReactCommon.MutationFunction<
  CreateBusinessMutation,
  CreateBusinessMutationVariables
>;

/**
 * __useCreateBusinessMutation__
 *
 * To run a mutation, you first call `useCreateBusinessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBusinessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBusinessMutation, { data, loading, error }] = useCreateBusinessMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBusinessMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateBusinessMutation,
    CreateBusinessMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateBusinessMutation,
    CreateBusinessMutationVariables
  >(CreateBusinessDocument, baseOptions);
}
export type CreateBusinessMutationHookResult = ReturnType<
  typeof useCreateBusinessMutation
>;
export type CreateBusinessMutationResult = ApolloReactCommon.MutationResult<
  CreateBusinessMutation
>;
export type CreateBusinessMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateBusinessMutation,
  CreateBusinessMutationVariables
>;
export const UpdateBusinessDocument = gql`
  mutation UpdateBusiness($input: UpdateBusinessInput!) {
    updateBusiness(input: $input) {
      business {
        ...Business
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${BusinessFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type UpdateBusinessMutationFn = ApolloReactCommon.MutationFunction<
  UpdateBusinessMutation,
  UpdateBusinessMutationVariables
>;

/**
 * __useUpdateBusinessMutation__
 *
 * To run a mutation, you first call `useUpdateBusinessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBusinessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBusinessMutation, { data, loading, error }] = useUpdateBusinessMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBusinessMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateBusinessMutation,
    UpdateBusinessMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateBusinessMutation,
    UpdateBusinessMutationVariables
  >(UpdateBusinessDocument, baseOptions);
}
export type UpdateBusinessMutationHookResult = ReturnType<
  typeof useUpdateBusinessMutation
>;
export type UpdateBusinessMutationResult = ApolloReactCommon.MutationResult<
  UpdateBusinessMutation
>;
export type UpdateBusinessMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateBusinessMutation,
  UpdateBusinessMutationVariables
>;
export const DeleteBusinessDocument = gql`
  mutation DeleteBusiness($input: DeleteBusinessInput!) {
    deleteBusiness(input: $input) {
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type DeleteBusinessMutationFn = ApolloReactCommon.MutationFunction<
  DeleteBusinessMutation,
  DeleteBusinessMutationVariables
>;

/**
 * __useDeleteBusinessMutation__
 *
 * To run a mutation, you first call `useDeleteBusinessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBusinessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBusinessMutation, { data, loading, error }] = useDeleteBusinessMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteBusinessMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteBusinessMutation,
    DeleteBusinessMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    DeleteBusinessMutation,
    DeleteBusinessMutationVariables
  >(DeleteBusinessDocument, baseOptions);
}
export type DeleteBusinessMutationHookResult = ReturnType<
  typeof useDeleteBusinessMutation
>;
export type DeleteBusinessMutationResult = ApolloReactCommon.MutationResult<
  DeleteBusinessMutation
>;
export type DeleteBusinessMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeleteBusinessMutation,
  DeleteBusinessMutationVariables
>;
export const CreateLocationDocument = gql`
  mutation CreateLocation($input: CreateLocationInput!) {
    createLocation(input: $input) {
      location {
        ...Location
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${LocationFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type CreateLocationMutationFn = ApolloReactCommon.MutationFunction<
  CreateLocationMutation,
  CreateLocationMutationVariables
>;

/**
 * __useCreateLocationMutation__
 *
 * To run a mutation, you first call `useCreateLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLocationMutation, { data, loading, error }] = useCreateLocationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLocationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateLocationMutation,
    CreateLocationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateLocationMutation,
    CreateLocationMutationVariables
  >(CreateLocationDocument, baseOptions);
}
export type CreateLocationMutationHookResult = ReturnType<
  typeof useCreateLocationMutation
>;
export type CreateLocationMutationResult = ApolloReactCommon.MutationResult<
  CreateLocationMutation
>;
export type CreateLocationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateLocationMutation,
  CreateLocationMutationVariables
>;
export const UpdateLocationDocument = gql`
  mutation UpdateLocation($input: UpdateLocationInput!) {
    updateLocation(input: $input) {
      location {
        ...Location
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${LocationFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type UpdateLocationMutationFn = ApolloReactCommon.MutationFunction<
  UpdateLocationMutation,
  UpdateLocationMutationVariables
>;

/**
 * __useUpdateLocationMutation__
 *
 * To run a mutation, you first call `useUpdateLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocationMutation, { data, loading, error }] = useUpdateLocationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLocationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateLocationMutation,
    UpdateLocationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateLocationMutation,
    UpdateLocationMutationVariables
  >(UpdateLocationDocument, baseOptions);
}
export type UpdateLocationMutationHookResult = ReturnType<
  typeof useUpdateLocationMutation
>;
export type UpdateLocationMutationResult = ApolloReactCommon.MutationResult<
  UpdateLocationMutation
>;
export type UpdateLocationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateLocationMutation,
  UpdateLocationMutationVariables
>;
export const DeleteLocationDocument = gql`
  mutation DeleteLocation($input: DeleteLocationInput!) {
    deleteLocation(input: $input) {
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type DeleteLocationMutationFn = ApolloReactCommon.MutationFunction<
  DeleteLocationMutation,
  DeleteLocationMutationVariables
>;

/**
 * __useDeleteLocationMutation__
 *
 * To run a mutation, you first call `useDeleteLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLocationMutation, { data, loading, error }] = useDeleteLocationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteLocationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteLocationMutation,
    DeleteLocationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    DeleteLocationMutation,
    DeleteLocationMutationVariables
  >(DeleteLocationDocument, baseOptions);
}
export type DeleteLocationMutationHookResult = ReturnType<
  typeof useDeleteLocationMutation
>;
export type DeleteLocationMutationResult = ApolloReactCommon.MutationResult<
  DeleteLocationMutation
>;
export type DeleteLocationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeleteLocationMutation,
  DeleteLocationMutationVariables
>;
export const LogInFacebookDocument = gql`
  mutation LogInFacebook($input: LogInFacebookInput!) {
    logInFacebook(input: $input) {
      isSuccessful
      accessToken
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type LogInFacebookMutationFn = ApolloReactCommon.MutationFunction<
  LogInFacebookMutation,
  LogInFacebookMutationVariables
>;

/**
 * __useLogInFacebookMutation__
 *
 * To run a mutation, you first call `useLogInFacebookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInFacebookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInFacebookMutation, { data, loading, error }] = useLogInFacebookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLogInFacebookMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LogInFacebookMutation,
    LogInFacebookMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    LogInFacebookMutation,
    LogInFacebookMutationVariables
  >(LogInFacebookDocument, baseOptions);
}
export type LogInFacebookMutationHookResult = ReturnType<
  typeof useLogInFacebookMutation
>;
export type LogInFacebookMutationResult = ApolloReactCommon.MutationResult<
  LogInFacebookMutation
>;
export type LogInFacebookMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LogInFacebookMutation,
  LogInFacebookMutationVariables
>;
export const LogInGoogleDocument = gql`
  mutation LogInGoogle($input: LogInGoogleInput!) {
    logInGoogle(input: $input) {
      isSuccessful
      accessToken
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type LogInGoogleMutationFn = ApolloReactCommon.MutationFunction<
  LogInGoogleMutation,
  LogInGoogleMutationVariables
>;

/**
 * __useLogInGoogleMutation__
 *
 * To run a mutation, you first call `useLogInGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInGoogleMutation, { data, loading, error }] = useLogInGoogleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLogInGoogleMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LogInGoogleMutation,
    LogInGoogleMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    LogInGoogleMutation,
    LogInGoogleMutationVariables
  >(LogInGoogleDocument, baseOptions);
}
export type LogInGoogleMutationHookResult = ReturnType<
  typeof useLogInGoogleMutation
>;
export type LogInGoogleMutationResult = ApolloReactCommon.MutationResult<
  LogInGoogleMutation
>;
export type LogInGoogleMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LogInGoogleMutation,
  LogInGoogleMutationVariables
>;
export const LogInEmailStartDocument = gql`
  mutation LogInEmailStart($input: LogInEmailStartInput!) {
    logInEmailStart(input: $input) {
      state
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type LogInEmailStartMutationFn = ApolloReactCommon.MutationFunction<
  LogInEmailStartMutation,
  LogInEmailStartMutationVariables
>;

/**
 * __useLogInEmailStartMutation__
 *
 * To run a mutation, you first call `useLogInEmailStartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInEmailStartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInEmailStartMutation, { data, loading, error }] = useLogInEmailStartMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLogInEmailStartMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LogInEmailStartMutation,
    LogInEmailStartMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    LogInEmailStartMutation,
    LogInEmailStartMutationVariables
  >(LogInEmailStartDocument, baseOptions);
}
export type LogInEmailStartMutationHookResult = ReturnType<
  typeof useLogInEmailStartMutation
>;
export type LogInEmailStartMutationResult = ApolloReactCommon.MutationResult<
  LogInEmailStartMutation
>;
export type LogInEmailStartMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LogInEmailStartMutation,
  LogInEmailStartMutationVariables
>;
export const LogInEmailVerifyDocument = gql`
  mutation LogInEmailVerify($input: LogInEmailVerifyInput!) {
    logInEmailVerify(input: $input) {
      accessToken
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type LogInEmailVerifyMutationFn = ApolloReactCommon.MutationFunction<
  LogInEmailVerifyMutation,
  LogInEmailVerifyMutationVariables
>;

/**
 * __useLogInEmailVerifyMutation__
 *
 * To run a mutation, you first call `useLogInEmailVerifyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInEmailVerifyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInEmailVerifyMutation, { data, loading, error }] = useLogInEmailVerifyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLogInEmailVerifyMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LogInEmailVerifyMutation,
    LogInEmailVerifyMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    LogInEmailVerifyMutation,
    LogInEmailVerifyMutationVariables
  >(LogInEmailVerifyDocument, baseOptions);
}
export type LogInEmailVerifyMutationHookResult = ReturnType<
  typeof useLogInEmailVerifyMutation
>;
export type LogInEmailVerifyMutationResult = ApolloReactCommon.MutationResult<
  LogInEmailVerifyMutation
>;
export type LogInEmailVerifyMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LogInEmailVerifyMutation,
  LogInEmailVerifyMutationVariables
>;
export const LogInPhoneStartDocument = gql`
  mutation LogInPhoneStart($input: LogInPhoneStartInput!) {
    logInPhoneStart(input: $input) {
      state
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type LogInPhoneStartMutationFn = ApolloReactCommon.MutationFunction<
  LogInPhoneStartMutation,
  LogInPhoneStartMutationVariables
>;

/**
 * __useLogInPhoneStartMutation__
 *
 * To run a mutation, you first call `useLogInPhoneStartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInPhoneStartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInPhoneStartMutation, { data, loading, error }] = useLogInPhoneStartMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLogInPhoneStartMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LogInPhoneStartMutation,
    LogInPhoneStartMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    LogInPhoneStartMutation,
    LogInPhoneStartMutationVariables
  >(LogInPhoneStartDocument, baseOptions);
}
export type LogInPhoneStartMutationHookResult = ReturnType<
  typeof useLogInPhoneStartMutation
>;
export type LogInPhoneStartMutationResult = ApolloReactCommon.MutationResult<
  LogInPhoneStartMutation
>;
export type LogInPhoneStartMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LogInPhoneStartMutation,
  LogInPhoneStartMutationVariables
>;
export const LogInPhoneVerifyDocument = gql`
  mutation LogInPhoneVerify($input: LogInPhoneVerifyInput!) {
    logInPhoneVerify(input: $input) {
      accessToken
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type LogInPhoneVerifyMutationFn = ApolloReactCommon.MutationFunction<
  LogInPhoneVerifyMutation,
  LogInPhoneVerifyMutationVariables
>;

/**
 * __useLogInPhoneVerifyMutation__
 *
 * To run a mutation, you first call `useLogInPhoneVerifyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInPhoneVerifyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInPhoneVerifyMutation, { data, loading, error }] = useLogInPhoneVerifyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLogInPhoneVerifyMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LogInPhoneVerifyMutation,
    LogInPhoneVerifyMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    LogInPhoneVerifyMutation,
    LogInPhoneVerifyMutationVariables
  >(LogInPhoneVerifyDocument, baseOptions);
}
export type LogInPhoneVerifyMutationHookResult = ReturnType<
  typeof useLogInPhoneVerifyMutation
>;
export type LogInPhoneVerifyMutationResult = ApolloReactCommon.MutationResult<
  LogInPhoneVerifyMutation
>;
export type LogInPhoneVerifyMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LogInPhoneVerifyMutation,
  LogInPhoneVerifyMutationVariables
>;
export const UpdateUserEmailStartDocument = gql`
  mutation UpdateUserEmailStart($input: UpdateUserEmailStartInput!) {
    updateUserEmailStart(input: $input) {
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type UpdateUserEmailStartMutationFn = ApolloReactCommon.MutationFunction<
  UpdateUserEmailStartMutation,
  UpdateUserEmailStartMutationVariables
>;

/**
 * __useUpdateUserEmailStartMutation__
 *
 * To run a mutation, you first call `useUpdateUserEmailStartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserEmailStartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserEmailStartMutation, { data, loading, error }] = useUpdateUserEmailStartMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserEmailStartMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateUserEmailStartMutation,
    UpdateUserEmailStartMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateUserEmailStartMutation,
    UpdateUserEmailStartMutationVariables
  >(UpdateUserEmailStartDocument, baseOptions);
}
export type UpdateUserEmailStartMutationHookResult = ReturnType<
  typeof useUpdateUserEmailStartMutation
>;
export type UpdateUserEmailStartMutationResult = ApolloReactCommon.MutationResult<
  UpdateUserEmailStartMutation
>;
export type UpdateUserEmailStartMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateUserEmailStartMutation,
  UpdateUserEmailStartMutationVariables
>;
export const UpdateUserEmailVerifyDocument = gql`
  mutation UpdateUserEmailVerify($input: UpdateUserEmailVerifyInput!) {
    updateUserEmailVerify(input: $input) {
      user {
        id
        account {
          ...UserAccount
        }
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserAccountFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type UpdateUserEmailVerifyMutationFn = ApolloReactCommon.MutationFunction<
  UpdateUserEmailVerifyMutation,
  UpdateUserEmailVerifyMutationVariables
>;

/**
 * __useUpdateUserEmailVerifyMutation__
 *
 * To run a mutation, you first call `useUpdateUserEmailVerifyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserEmailVerifyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserEmailVerifyMutation, { data, loading, error }] = useUpdateUserEmailVerifyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserEmailVerifyMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateUserEmailVerifyMutation,
    UpdateUserEmailVerifyMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateUserEmailVerifyMutation,
    UpdateUserEmailVerifyMutationVariables
  >(UpdateUserEmailVerifyDocument, baseOptions);
}
export type UpdateUserEmailVerifyMutationHookResult = ReturnType<
  typeof useUpdateUserEmailVerifyMutation
>;
export type UpdateUserEmailVerifyMutationResult = ApolloReactCommon.MutationResult<
  UpdateUserEmailVerifyMutation
>;
export type UpdateUserEmailVerifyMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateUserEmailVerifyMutation,
  UpdateUserEmailVerifyMutationVariables
>;
export const UpdateUserPhoneStartDocument = gql`
  mutation UpdateUserPhoneStart($input: UpdateUserPhoneStartInput!) {
    updateUserPhoneStart(input: $input) {
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type UpdateUserPhoneStartMutationFn = ApolloReactCommon.MutationFunction<
  UpdateUserPhoneStartMutation,
  UpdateUserPhoneStartMutationVariables
>;

/**
 * __useUpdateUserPhoneStartMutation__
 *
 * To run a mutation, you first call `useUpdateUserPhoneStartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserPhoneStartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserPhoneStartMutation, { data, loading, error }] = useUpdateUserPhoneStartMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserPhoneStartMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateUserPhoneStartMutation,
    UpdateUserPhoneStartMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateUserPhoneStartMutation,
    UpdateUserPhoneStartMutationVariables
  >(UpdateUserPhoneStartDocument, baseOptions);
}
export type UpdateUserPhoneStartMutationHookResult = ReturnType<
  typeof useUpdateUserPhoneStartMutation
>;
export type UpdateUserPhoneStartMutationResult = ApolloReactCommon.MutationResult<
  UpdateUserPhoneStartMutation
>;
export type UpdateUserPhoneStartMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateUserPhoneStartMutation,
  UpdateUserPhoneStartMutationVariables
>;
export const UpdateUserPhoneVerifyDocument = gql`
  mutation UpdateUserPhoneVerify($input: UpdateUserPhoneVerifyInput!) {
    updateUserPhoneVerify(input: $input) {
      user {
        id
        account {
          ...UserAccount
        }
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserAccountFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type UpdateUserPhoneVerifyMutationFn = ApolloReactCommon.MutationFunction<
  UpdateUserPhoneVerifyMutation,
  UpdateUserPhoneVerifyMutationVariables
>;

/**
 * __useUpdateUserPhoneVerifyMutation__
 *
 * To run a mutation, you first call `useUpdateUserPhoneVerifyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserPhoneVerifyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserPhoneVerifyMutation, { data, loading, error }] = useUpdateUserPhoneVerifyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserPhoneVerifyMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateUserPhoneVerifyMutation,
    UpdateUserPhoneVerifyMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateUserPhoneVerifyMutation,
    UpdateUserPhoneVerifyMutationVariables
  >(UpdateUserPhoneVerifyDocument, baseOptions);
}
export type UpdateUserPhoneVerifyMutationHookResult = ReturnType<
  typeof useUpdateUserPhoneVerifyMutation
>;
export type UpdateUserPhoneVerifyMutationResult = ApolloReactCommon.MutationResult<
  UpdateUserPhoneVerifyMutation
>;
export type UpdateUserPhoneVerifyMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateUserPhoneVerifyMutation,
  UpdateUserPhoneVerifyMutationVariables
>;
export const UpdateUserProfileDocument = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      user {
        id
        profile {
          ...UserProfile
        }
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserProfileFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type UpdateUserProfileMutationFn = ApolloReactCommon.MutationFunction<
  UpdateUserProfileMutation,
  UpdateUserProfileMutationVariables
>;

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateUserProfileMutation,
    UpdateUserProfileMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateUserProfileMutation,
    UpdateUserProfileMutationVariables
  >(UpdateUserProfileDocument, baseOptions);
}
export type UpdateUserProfileMutationHookResult = ReturnType<
  typeof useUpdateUserProfileMutation
>;
export type UpdateUserProfileMutationResult = ApolloReactCommon.MutationResult<
  UpdateUserProfileMutation
>;
export type UpdateUserProfileMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateUserProfileMutation,
  UpdateUserProfileMutationVariables
>;
export const LinkFacebookAccountDocument = gql`
  mutation LinkFacebookAccount($input: LinkFacebookAccountInput!) {
    linkFacebookAccount(input: $input) {
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type LinkFacebookAccountMutationFn = ApolloReactCommon.MutationFunction<
  LinkFacebookAccountMutation,
  LinkFacebookAccountMutationVariables
>;

/**
 * __useLinkFacebookAccountMutation__
 *
 * To run a mutation, you first call `useLinkFacebookAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkFacebookAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkFacebookAccountMutation, { data, loading, error }] = useLinkFacebookAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLinkFacebookAccountMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LinkFacebookAccountMutation,
    LinkFacebookAccountMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    LinkFacebookAccountMutation,
    LinkFacebookAccountMutationVariables
  >(LinkFacebookAccountDocument, baseOptions);
}
export type LinkFacebookAccountMutationHookResult = ReturnType<
  typeof useLinkFacebookAccountMutation
>;
export type LinkFacebookAccountMutationResult = ApolloReactCommon.MutationResult<
  LinkFacebookAccountMutation
>;
export type LinkFacebookAccountMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LinkFacebookAccountMutation,
  LinkFacebookAccountMutationVariables
>;
export const DisconnectFacebookDocument = gql`
  mutation DisconnectFacebook($input: DisconnectFacebookInput!) {
    disconnectFacebook(input: $input) {
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type DisconnectFacebookMutationFn = ApolloReactCommon.MutationFunction<
  DisconnectFacebookMutation,
  DisconnectFacebookMutationVariables
>;

/**
 * __useDisconnectFacebookMutation__
 *
 * To run a mutation, you first call `useDisconnectFacebookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisconnectFacebookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disconnectFacebookMutation, { data, loading, error }] = useDisconnectFacebookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDisconnectFacebookMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DisconnectFacebookMutation,
    DisconnectFacebookMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    DisconnectFacebookMutation,
    DisconnectFacebookMutationVariables
  >(DisconnectFacebookDocument, baseOptions);
}
export type DisconnectFacebookMutationHookResult = ReturnType<
  typeof useDisconnectFacebookMutation
>;
export type DisconnectFacebookMutationResult = ApolloReactCommon.MutationResult<
  DisconnectFacebookMutation
>;
export type DisconnectFacebookMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DisconnectFacebookMutation,
  DisconnectFacebookMutationVariables
>;
export const LinkGoogleAccountDocument = gql`
  mutation LinkGoogleAccount($input: LinkGoogleAccountInput!) {
    linkGoogleAccount(input: $input) {
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type LinkGoogleAccountMutationFn = ApolloReactCommon.MutationFunction<
  LinkGoogleAccountMutation,
  LinkGoogleAccountMutationVariables
>;

/**
 * __useLinkGoogleAccountMutation__
 *
 * To run a mutation, you first call `useLinkGoogleAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkGoogleAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkGoogleAccountMutation, { data, loading, error }] = useLinkGoogleAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLinkGoogleAccountMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LinkGoogleAccountMutation,
    LinkGoogleAccountMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    LinkGoogleAccountMutation,
    LinkGoogleAccountMutationVariables
  >(LinkGoogleAccountDocument, baseOptions);
}
export type LinkGoogleAccountMutationHookResult = ReturnType<
  typeof useLinkGoogleAccountMutation
>;
export type LinkGoogleAccountMutationResult = ApolloReactCommon.MutationResult<
  LinkGoogleAccountMutation
>;
export type LinkGoogleAccountMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LinkGoogleAccountMutation,
  LinkGoogleAccountMutationVariables
>;
export const DisconnectGoogleDocument = gql`
  mutation DisconnectGoogle($input: DisconnectGoogleInput!) {
    disconnectGoogle(input: $input) {
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type DisconnectGoogleMutationFn = ApolloReactCommon.MutationFunction<
  DisconnectGoogleMutation,
  DisconnectGoogleMutationVariables
>;

/**
 * __useDisconnectGoogleMutation__
 *
 * To run a mutation, you first call `useDisconnectGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisconnectGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disconnectGoogleMutation, { data, loading, error }] = useDisconnectGoogleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDisconnectGoogleMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DisconnectGoogleMutation,
    DisconnectGoogleMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    DisconnectGoogleMutation,
    DisconnectGoogleMutationVariables
  >(DisconnectGoogleDocument, baseOptions);
}
export type DisconnectGoogleMutationHookResult = ReturnType<
  typeof useDisconnectGoogleMutation
>;
export type DisconnectGoogleMutationResult = ApolloReactCommon.MutationResult<
  DisconnectGoogleMutation
>;
export type DisconnectGoogleMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DisconnectGoogleMutation,
  DisconnectGoogleMutationVariables
>;
export const DeactivateUserDocument = gql`
  mutation DeactivateUser($input: DeactivateUserInput!) {
    deactivateUser(input: $input) {
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type DeactivateUserMutationFn = ApolloReactCommon.MutationFunction<
  DeactivateUserMutation,
  DeactivateUserMutationVariables
>;

/**
 * __useDeactivateUserMutation__
 *
 * To run a mutation, you first call `useDeactivateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeactivateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deactivateUserMutation, { data, loading, error }] = useDeactivateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeactivateUserMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeactivateUserMutation,
    DeactivateUserMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    DeactivateUserMutation,
    DeactivateUserMutationVariables
  >(DeactivateUserDocument, baseOptions);
}
export type DeactivateUserMutationHookResult = ReturnType<
  typeof useDeactivateUserMutation
>;
export type DeactivateUserMutationResult = ApolloReactCommon.MutationResult<
  DeactivateUserMutation
>;
export type DeactivateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeactivateUserMutation,
  DeactivateUserMutationVariables
>;
export const CreateEmployeeDocument = gql`
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      employee {
        ...Employee
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${EmployeeFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type CreateEmployeeMutationFn = ApolloReactCommon.MutationFunction<
  CreateEmployeeMutation,
  CreateEmployeeMutationVariables
>;

/**
 * __useCreateEmployeeMutation__
 *
 * To run a mutation, you first call `useCreateEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEmployeeMutation, { data, loading, error }] = useCreateEmployeeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEmployeeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateEmployeeMutation,
    CreateEmployeeMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateEmployeeMutation,
    CreateEmployeeMutationVariables
  >(CreateEmployeeDocument, baseOptions);
}
export type CreateEmployeeMutationHookResult = ReturnType<
  typeof useCreateEmployeeMutation
>;
export type CreateEmployeeMutationResult = ApolloReactCommon.MutationResult<
  CreateEmployeeMutation
>;
export type CreateEmployeeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateEmployeeMutation,
  CreateEmployeeMutationVariables
>;
export const UpdateEmployeeDocument = gql`
  mutation UpdateEmployee($input: UpdateEmployeeInput!) {
    updateEmployee(input: $input) {
      employee {
        ...Employee
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${EmployeeFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type UpdateEmployeeMutationFn = ApolloReactCommon.MutationFunction<
  UpdateEmployeeMutation,
  UpdateEmployeeMutationVariables
>;

/**
 * __useUpdateEmployeeMutation__
 *
 * To run a mutation, you first call `useUpdateEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEmployeeMutation, { data, loading, error }] = useUpdateEmployeeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEmployeeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateEmployeeMutation,
    UpdateEmployeeMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateEmployeeMutation,
    UpdateEmployeeMutationVariables
  >(UpdateEmployeeDocument, baseOptions);
}
export type UpdateEmployeeMutationHookResult = ReturnType<
  typeof useUpdateEmployeeMutation
>;
export type UpdateEmployeeMutationResult = ApolloReactCommon.MutationResult<
  UpdateEmployeeMutation
>;
export type UpdateEmployeeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateEmployeeMutation,
  UpdateEmployeeMutationVariables
>;
export const UpdateEmployeeRoleDocument = gql`
  mutation UpdateEmployeeRole($input: UpdateEmployeeRoleInput!) {
    updateEmployeeRole(input: $input) {
      employee {
        ...Employee
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${EmployeeFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type UpdateEmployeeRoleMutationFn = ApolloReactCommon.MutationFunction<
  UpdateEmployeeRoleMutation,
  UpdateEmployeeRoleMutationVariables
>;

/**
 * __useUpdateEmployeeRoleMutation__
 *
 * To run a mutation, you first call `useUpdateEmployeeRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEmployeeRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEmployeeRoleMutation, { data, loading, error }] = useUpdateEmployeeRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEmployeeRoleMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateEmployeeRoleMutation,
    UpdateEmployeeRoleMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateEmployeeRoleMutation,
    UpdateEmployeeRoleMutationVariables
  >(UpdateEmployeeRoleDocument, baseOptions);
}
export type UpdateEmployeeRoleMutationHookResult = ReturnType<
  typeof useUpdateEmployeeRoleMutation
>;
export type UpdateEmployeeRoleMutationResult = ApolloReactCommon.MutationResult<
  UpdateEmployeeRoleMutation
>;
export type UpdateEmployeeRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateEmployeeRoleMutation,
  UpdateEmployeeRoleMutationVariables
>;
export const UpdateEmployeeRolePermissionsDocument = gql`
  mutation UpdateEmployeeRolePermissions(
    $input: UpdateEmployeeRolePermissionsInput!
  ) {
    updateEmployeeRolePermissions(input: $input) {
      employeeRole {
        ...EmployeeRole
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${EmployeeRoleFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type UpdateEmployeeRolePermissionsMutationFn = ApolloReactCommon.MutationFunction<
  UpdateEmployeeRolePermissionsMutation,
  UpdateEmployeeRolePermissionsMutationVariables
>;

/**
 * __useUpdateEmployeeRolePermissionsMutation__
 *
 * To run a mutation, you first call `useUpdateEmployeeRolePermissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEmployeeRolePermissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEmployeeRolePermissionsMutation, { data, loading, error }] = useUpdateEmployeeRolePermissionsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEmployeeRolePermissionsMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateEmployeeRolePermissionsMutation,
    UpdateEmployeeRolePermissionsMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateEmployeeRolePermissionsMutation,
    UpdateEmployeeRolePermissionsMutationVariables
  >(UpdateEmployeeRolePermissionsDocument, baseOptions);
}
export type UpdateEmployeeRolePermissionsMutationHookResult = ReturnType<
  typeof useUpdateEmployeeRolePermissionsMutation
>;
export type UpdateEmployeeRolePermissionsMutationResult = ApolloReactCommon.MutationResult<
  UpdateEmployeeRolePermissionsMutation
>;
export type UpdateEmployeeRolePermissionsMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateEmployeeRolePermissionsMutation,
  UpdateEmployeeRolePermissionsMutationVariables
>;
export const DeleteEmployeeDocument = gql`
  mutation DeleteEmployee($input: DeleteEmployeeInput!) {
    deleteEmployee(input: $input) {
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type DeleteEmployeeMutationFn = ApolloReactCommon.MutationFunction<
  DeleteEmployeeMutation,
  DeleteEmployeeMutationVariables
>;

/**
 * __useDeleteEmployeeMutation__
 *
 * To run a mutation, you first call `useDeleteEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEmployeeMutation, { data, loading, error }] = useDeleteEmployeeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteEmployeeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteEmployeeMutation,
    DeleteEmployeeMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    DeleteEmployeeMutation,
    DeleteEmployeeMutationVariables
  >(DeleteEmployeeDocument, baseOptions);
}
export type DeleteEmployeeMutationHookResult = ReturnType<
  typeof useDeleteEmployeeMutation
>;
export type DeleteEmployeeMutationResult = ApolloReactCommon.MutationResult<
  DeleteEmployeeMutation
>;
export type DeleteEmployeeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeleteEmployeeMutation,
  DeleteEmployeeMutationVariables
>;
export const UpdateClientDocument = gql`
  mutation UpdateClient($input: UpdateClientInput!) {
    updateClient(input: $input) {
      isSuccessful
      client {
        ...Client
      }
      userError {
        ...UserError
      }
    }
  }
  ${ClientFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type UpdateClientMutationFn = ApolloReactCommon.MutationFunction<
  UpdateClientMutation,
  UpdateClientMutationVariables
>;

/**
 * __useUpdateClientMutation__
 *
 * To run a mutation, you first call `useUpdateClientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClientMutation, { data, loading, error }] = useUpdateClientMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateClientMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateClientMutation,
    UpdateClientMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateClientMutation,
    UpdateClientMutationVariables
  >(UpdateClientDocument, baseOptions);
}
export type UpdateClientMutationHookResult = ReturnType<
  typeof useUpdateClientMutation
>;
export type UpdateClientMutationResult = ApolloReactCommon.MutationResult<
  UpdateClientMutation
>;
export type UpdateClientMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateClientMutation,
  UpdateClientMutationVariables
>;
export const CreateClientDocument = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      isSuccessful
      client {
        ...Client
      }
      userError {
        ...UserError
      }
    }
  }
  ${ClientFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type CreateClientMutationFn = ApolloReactCommon.MutationFunction<
  CreateClientMutation,
  CreateClientMutationVariables
>;

/**
 * __useCreateClientMutation__
 *
 * To run a mutation, you first call `useCreateClientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClientMutation, { data, loading, error }] = useCreateClientMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateClientMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateClientMutation,
    CreateClientMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateClientMutation,
    CreateClientMutationVariables
  >(CreateClientDocument, baseOptions);
}
export type CreateClientMutationHookResult = ReturnType<
  typeof useCreateClientMutation
>;
export type CreateClientMutationResult = ApolloReactCommon.MutationResult<
  CreateClientMutation
>;
export type CreateClientMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateClientMutation,
  CreateClientMutationVariables
>;
export const InviteEmployeeDocument = gql`
  mutation InviteEmployee($input: InviteEmployeeInput!) {
    inviteEmployee(input: $input) {
      employee {
        ...Employee
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${EmployeeFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type InviteEmployeeMutationFn = ApolloReactCommon.MutationFunction<
  InviteEmployeeMutation,
  InviteEmployeeMutationVariables
>;

/**
 * __useInviteEmployeeMutation__
 *
 * To run a mutation, you first call `useInviteEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteEmployeeMutation, { data, loading, error }] = useInviteEmployeeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInviteEmployeeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    InviteEmployeeMutation,
    InviteEmployeeMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    InviteEmployeeMutation,
    InviteEmployeeMutationVariables
  >(InviteEmployeeDocument, baseOptions);
}
export type InviteEmployeeMutationHookResult = ReturnType<
  typeof useInviteEmployeeMutation
>;
export type InviteEmployeeMutationResult = ApolloReactCommon.MutationResult<
  InviteEmployeeMutation
>;
export type InviteEmployeeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  InviteEmployeeMutation,
  InviteEmployeeMutationVariables
>;
export const AcceptEmployeeInvitationDocument = gql`
  mutation AcceptEmployeeInvitation($input: AcceptEmployeeInvitationInput!) {
    acceptEmployeeInvitation(input: $input) {
      employee {
        ...Employee
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${EmployeeFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type AcceptEmployeeInvitationMutationFn = ApolloReactCommon.MutationFunction<
  AcceptEmployeeInvitationMutation,
  AcceptEmployeeInvitationMutationVariables
>;

/**
 * __useAcceptEmployeeInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptEmployeeInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptEmployeeInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptEmployeeInvitationMutation, { data, loading, error }] = useAcceptEmployeeInvitationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAcceptEmployeeInvitationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AcceptEmployeeInvitationMutation,
    AcceptEmployeeInvitationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    AcceptEmployeeInvitationMutation,
    AcceptEmployeeInvitationMutationVariables
  >(AcceptEmployeeInvitationDocument, baseOptions);
}
export type AcceptEmployeeInvitationMutationHookResult = ReturnType<
  typeof useAcceptEmployeeInvitationMutation
>;
export type AcceptEmployeeInvitationMutationResult = ApolloReactCommon.MutationResult<
  AcceptEmployeeInvitationMutation
>;
export type AcceptEmployeeInvitationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AcceptEmployeeInvitationMutation,
  AcceptEmployeeInvitationMutationVariables
>;
export const DeclineEmployeeInvitationDocument = gql`
  mutation DeclineEmployeeInvitation($input: DeclineEmployeeInvitationInput!) {
    declineEmployeeInvitation(input: $input) {
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type DeclineEmployeeInvitationMutationFn = ApolloReactCommon.MutationFunction<
  DeclineEmployeeInvitationMutation,
  DeclineEmployeeInvitationMutationVariables
>;

/**
 * __useDeclineEmployeeInvitationMutation__
 *
 * To run a mutation, you first call `useDeclineEmployeeInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeclineEmployeeInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [declineEmployeeInvitationMutation, { data, loading, error }] = useDeclineEmployeeInvitationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeclineEmployeeInvitationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeclineEmployeeInvitationMutation,
    DeclineEmployeeInvitationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    DeclineEmployeeInvitationMutation,
    DeclineEmployeeInvitationMutationVariables
  >(DeclineEmployeeInvitationDocument, baseOptions);
}
export type DeclineEmployeeInvitationMutationHookResult = ReturnType<
  typeof useDeclineEmployeeInvitationMutation
>;
export type DeclineEmployeeInvitationMutationResult = ApolloReactCommon.MutationResult<
  DeclineEmployeeInvitationMutation
>;
export type DeclineEmployeeInvitationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeclineEmployeeInvitationMutation,
  DeclineEmployeeInvitationMutationVariables
>;
export const CancelEmployeeInvitationDocument = gql`
  mutation CancelEmployeeInvitation($input: CancelEmployeeInvitationInput!) {
    cancelEmployeeInvitation(input: $input) {
      employee {
        ...Employee
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${EmployeeFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type CancelEmployeeInvitationMutationFn = ApolloReactCommon.MutationFunction<
  CancelEmployeeInvitationMutation,
  CancelEmployeeInvitationMutationVariables
>;

/**
 * __useCancelEmployeeInvitationMutation__
 *
 * To run a mutation, you first call `useCancelEmployeeInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelEmployeeInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelEmployeeInvitationMutation, { data, loading, error }] = useCancelEmployeeInvitationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCancelEmployeeInvitationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CancelEmployeeInvitationMutation,
    CancelEmployeeInvitationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CancelEmployeeInvitationMutation,
    CancelEmployeeInvitationMutationVariables
  >(CancelEmployeeInvitationDocument, baseOptions);
}
export type CancelEmployeeInvitationMutationHookResult = ReturnType<
  typeof useCancelEmployeeInvitationMutation
>;
export type CancelEmployeeInvitationMutationResult = ApolloReactCommon.MutationResult<
  CancelEmployeeInvitationMutation
>;
export type CancelEmployeeInvitationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CancelEmployeeInvitationMutation,
  CancelEmployeeInvitationMutationVariables
>;
export const UnlinkEmployeeDocument = gql`
  mutation UnlinkEmployee($input: UnlinkEmployeeInput!) {
    unlinkEmployee(input: $input) {
      employee {
        ...Employee
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${EmployeeFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type UnlinkEmployeeMutationFn = ApolloReactCommon.MutationFunction<
  UnlinkEmployeeMutation,
  UnlinkEmployeeMutationVariables
>;

/**
 * __useUnlinkEmployeeMutation__
 *
 * To run a mutation, you first call `useUnlinkEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlinkEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlinkEmployeeMutation, { data, loading, error }] = useUnlinkEmployeeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUnlinkEmployeeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UnlinkEmployeeMutation,
    UnlinkEmployeeMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UnlinkEmployeeMutation,
    UnlinkEmployeeMutationVariables
  >(UnlinkEmployeeDocument, baseOptions);
}
export type UnlinkEmployeeMutationHookResult = ReturnType<
  typeof useUnlinkEmployeeMutation
>;
export type UnlinkEmployeeMutationResult = ApolloReactCommon.MutationResult<
  UnlinkEmployeeMutation
>;
export type UnlinkEmployeeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UnlinkEmployeeMutation,
  UnlinkEmployeeMutationVariables
>;
export const CreateShiftDocument = gql`
  mutation CreateShift($input: CreateShiftInput!) {
    createShift(input: $input) {
      shift {
        ...Shift
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${ShiftFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type CreateShiftMutationFn = ApolloReactCommon.MutationFunction<
  CreateShiftMutation,
  CreateShiftMutationVariables
>;

/**
 * __useCreateShiftMutation__
 *
 * To run a mutation, you first call `useCreateShiftMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShiftMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShiftMutation, { data, loading, error }] = useCreateShiftMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateShiftMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateShiftMutation,
    CreateShiftMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateShiftMutation,
    CreateShiftMutationVariables
  >(CreateShiftDocument, baseOptions);
}
export type CreateShiftMutationHookResult = ReturnType<
  typeof useCreateShiftMutation
>;
export type CreateShiftMutationResult = ApolloReactCommon.MutationResult<
  CreateShiftMutation
>;
export type CreateShiftMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateShiftMutation,
  CreateShiftMutationVariables
>;
export const UpdateShiftDocument = gql`
  mutation UpdateShift($input: UpdateShiftInput!) {
    updateShift(input: $input) {
      shift {
        ...Shift
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${ShiftFragmentDoc}
  ${UserErrorFragmentDoc}
`;
export type UpdateShiftMutationFn = ApolloReactCommon.MutationFunction<
  UpdateShiftMutation,
  UpdateShiftMutationVariables
>;

/**
 * __useUpdateShiftMutation__
 *
 * To run a mutation, you first call `useUpdateShiftMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShiftMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShiftMutation, { data, loading, error }] = useUpdateShiftMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateShiftMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateShiftMutation,
    UpdateShiftMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateShiftMutation,
    UpdateShiftMutationVariables
  >(UpdateShiftDocument, baseOptions);
}
export type UpdateShiftMutationHookResult = ReturnType<
  typeof useUpdateShiftMutation
>;
export type UpdateShiftMutationResult = ApolloReactCommon.MutationResult<
  UpdateShiftMutation
>;
export type UpdateShiftMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateShiftMutation,
  UpdateShiftMutationVariables
>;
export const CancelShiftDocument = gql`
  mutation CancelShift($input: CancelShiftInput!) {
    cancelShift(input: $input) {
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ${UserErrorFragmentDoc}
`;
export type CancelShiftMutationFn = ApolloReactCommon.MutationFunction<
  CancelShiftMutation,
  CancelShiftMutationVariables
>;

/**
 * __useCancelShiftMutation__
 *
 * To run a mutation, you first call `useCancelShiftMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelShiftMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelShiftMutation, { data, loading, error }] = useCancelShiftMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCancelShiftMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CancelShiftMutation,
    CancelShiftMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CancelShiftMutation,
    CancelShiftMutationVariables
  >(CancelShiftDocument, baseOptions);
}
export type CancelShiftMutationHookResult = ReturnType<
  typeof useCancelShiftMutation
>;
export type CancelShiftMutationResult = ApolloReactCommon.MutationResult<
  CancelShiftMutation
>;
export type CancelShiftMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CancelShiftMutation,
  CancelShiftMutationVariables
>;
export const CurrentUserDocument = gql`
  query CurrentUser {
    currentUser {
      ...CurrentUser
    }
  }
  ${CurrentUserFragmentDoc}
`;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CurrentUserQuery,
    CurrentUserQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    baseOptions,
  );
}
export function useCurrentUserLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CurrentUserQuery,
    CurrentUserQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    CurrentUserQuery,
    CurrentUserQueryVariables
  >(CurrentUserDocument, baseOptions);
}
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<
  typeof useCurrentUserLazyQuery
>;
export type CurrentUserQueryResult = ApolloReactCommon.QueryResult<
  CurrentUserQuery,
  CurrentUserQueryVariables
>;
export const CurrentBusinessDocument = gql`
  query CurrentBusiness {
    currentBusiness {
      ...CurrentBusiness
    }
  }
  ${CurrentBusinessFragmentDoc}
`;

/**
 * __useCurrentBusinessQuery__
 *
 * To run a query within a React component, call `useCurrentBusinessQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentBusinessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentBusinessQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentBusinessQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CurrentBusinessQuery,
    CurrentBusinessQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    CurrentBusinessQuery,
    CurrentBusinessQueryVariables
  >(CurrentBusinessDocument, baseOptions);
}
export function useCurrentBusinessLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CurrentBusinessQuery,
    CurrentBusinessQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    CurrentBusinessQuery,
    CurrentBusinessQueryVariables
  >(CurrentBusinessDocument, baseOptions);
}
export type CurrentBusinessQueryHookResult = ReturnType<
  typeof useCurrentBusinessQuery
>;
export type CurrentBusinessLazyQueryHookResult = ReturnType<
  typeof useCurrentBusinessLazyQuery
>;
export type CurrentBusinessQueryResult = ApolloReactCommon.QueryResult<
  CurrentBusinessQuery,
  CurrentBusinessQueryVariables
>;
export const EmployeesDocument = gql`
  query Employees($locationId: ID!) {
    employees(locationId: $locationId) {
      ...Employee
    }
  }
  ${EmployeeFragmentDoc}
`;

/**
 * __useEmployeesQuery__
 *
 * To run a query within a React component, call `useEmployeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmployeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmployeesQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useEmployeesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    EmployeesQuery,
    EmployeesQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<EmployeesQuery, EmployeesQueryVariables>(
    EmployeesDocument,
    baseOptions,
  );
}
export function useEmployeesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EmployeesQuery,
    EmployeesQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<EmployeesQuery, EmployeesQueryVariables>(
    EmployeesDocument,
    baseOptions,
  );
}
export type EmployeesQueryHookResult = ReturnType<typeof useEmployeesQuery>;
export type EmployeesLazyQueryHookResult = ReturnType<
  typeof useEmployeesLazyQuery
>;
export type EmployeesQueryResult = ApolloReactCommon.QueryResult<
  EmployeesQuery,
  EmployeesQueryVariables
>;
export const EmployeesShiftsDocument = gql`
  query EmployeesShifts($locationId: ID!, $filter: ShiftsFilter!) {
    employees(locationId: $locationId) {
      ...Employee
      shifts(filter: $filter) {
        ...Shift
      }
    }
  }
  ${EmployeeFragmentDoc}
  ${ShiftFragmentDoc}
`;

/**
 * __useEmployeesShiftsQuery__
 *
 * To run a query within a React component, call `useEmployeesShiftsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmployeesShiftsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmployeesShiftsQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useEmployeesShiftsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    EmployeesShiftsQuery,
    EmployeesShiftsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    EmployeesShiftsQuery,
    EmployeesShiftsQueryVariables
  >(EmployeesShiftsDocument, baseOptions);
}
export function useEmployeesShiftsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EmployeesShiftsQuery,
    EmployeesShiftsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    EmployeesShiftsQuery,
    EmployeesShiftsQueryVariables
  >(EmployeesShiftsDocument, baseOptions);
}
export type EmployeesShiftsQueryHookResult = ReturnType<
  typeof useEmployeesShiftsQuery
>;
export type EmployeesShiftsLazyQueryHookResult = ReturnType<
  typeof useEmployeesShiftsLazyQuery
>;
export type EmployeesShiftsQueryResult = ApolloReactCommon.QueryResult<
  EmployeesShiftsQuery,
  EmployeesShiftsQueryVariables
>;
export const ShiftsDocument = gql`
  query Shifts($locationId: ID!, $filter: ShiftsFilter!) {
    shifts(locationId: $locationId, filter: $filter) {
      ...Shift
    }
  }
  ${ShiftFragmentDoc}
`;

/**
 * __useShiftsQuery__
 *
 * To run a query within a React component, call `useShiftsQuery` and pass it any options that fit your needs.
 * When your component renders, `useShiftsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShiftsQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useShiftsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ShiftsQuery,
    ShiftsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<ShiftsQuery, ShiftsQueryVariables>(
    ShiftsDocument,
    baseOptions,
  );
}
export function useShiftsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ShiftsQuery,
    ShiftsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<ShiftsQuery, ShiftsQueryVariables>(
    ShiftsDocument,
    baseOptions,
  );
}
export type ShiftsQueryHookResult = ReturnType<typeof useShiftsQuery>;
export type ShiftsLazyQueryHookResult = ReturnType<typeof useShiftsLazyQuery>;
export type ShiftsQueryResult = ApolloReactCommon.QueryResult<
  ShiftsQuery,
  ShiftsQueryVariables
>;
export const EmployeesAndShiftsDocument = gql`
  query EmployeesAndShifts($locationId: ID!, $filter: ShiftsFilter!) {
    employees(locationId: $locationId) {
      ...Employee
    }
    shifts(locationId: $locationId, filter: $filter) {
      ...Shift
    }
  }
  ${EmployeeFragmentDoc}
  ${ShiftFragmentDoc}
`;

/**
 * __useEmployeesAndShiftsQuery__
 *
 * To run a query within a React component, call `useEmployeesAndShiftsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmployeesAndShiftsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmployeesAndShiftsQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useEmployeesAndShiftsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    EmployeesAndShiftsQuery,
    EmployeesAndShiftsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    EmployeesAndShiftsQuery,
    EmployeesAndShiftsQueryVariables
  >(EmployeesAndShiftsDocument, baseOptions);
}
export function useEmployeesAndShiftsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EmployeesAndShiftsQuery,
    EmployeesAndShiftsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    EmployeesAndShiftsQuery,
    EmployeesAndShiftsQueryVariables
  >(EmployeesAndShiftsDocument, baseOptions);
}
export type EmployeesAndShiftsQueryHookResult = ReturnType<
  typeof useEmployeesAndShiftsQuery
>;
export type EmployeesAndShiftsLazyQueryHookResult = ReturnType<
  typeof useEmployeesAndShiftsLazyQuery
>;
export type EmployeesAndShiftsQueryResult = ApolloReactCommon.QueryResult<
  EmployeesAndShiftsQuery,
  EmployeesAndShiftsQueryVariables
>;
export const EmployeeDocument = gql`
  query Employee($id: ID!) {
    employee(id: $id) {
      ...Employee
    }
  }
  ${EmployeeFragmentDoc}
`;

/**
 * __useEmployeeQuery__
 *
 * To run a query within a React component, call `useEmployeeQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmployeeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmployeeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEmployeeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    EmployeeQuery,
    EmployeeQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<EmployeeQuery, EmployeeQueryVariables>(
    EmployeeDocument,
    baseOptions,
  );
}
export function useEmployeeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EmployeeQuery,
    EmployeeQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<EmployeeQuery, EmployeeQueryVariables>(
    EmployeeDocument,
    baseOptions,
  );
}
export type EmployeeQueryHookResult = ReturnType<typeof useEmployeeQuery>;
export type EmployeeLazyQueryHookResult = ReturnType<
  typeof useEmployeeLazyQuery
>;
export type EmployeeQueryResult = ApolloReactCommon.QueryResult<
  EmployeeQuery,
  EmployeeQueryVariables
>;
export const EmployeeShiftsDocument = gql`
  query EmployeeShifts($id: ID!, $filter: ShiftsFilter!) {
    employee(id: $id) {
      ...Employee
      shifts(filter: $filter) {
        ...Shift
      }
    }
  }
  ${EmployeeFragmentDoc}
  ${ShiftFragmentDoc}
`;

/**
 * __useEmployeeShiftsQuery__
 *
 * To run a query within a React component, call `useEmployeeShiftsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmployeeShiftsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmployeeShiftsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useEmployeeShiftsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    EmployeeShiftsQuery,
    EmployeeShiftsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    EmployeeShiftsQuery,
    EmployeeShiftsQueryVariables
  >(EmployeeShiftsDocument, baseOptions);
}
export function useEmployeeShiftsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EmployeeShiftsQuery,
    EmployeeShiftsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    EmployeeShiftsQuery,
    EmployeeShiftsQueryVariables
  >(EmployeeShiftsDocument, baseOptions);
}
export type EmployeeShiftsQueryHookResult = ReturnType<
  typeof useEmployeeShiftsQuery
>;
export type EmployeeShiftsLazyQueryHookResult = ReturnType<
  typeof useEmployeeShiftsLazyQuery
>;
export type EmployeeShiftsQueryResult = ApolloReactCommon.QueryResult<
  EmployeeShiftsQuery,
  EmployeeShiftsQueryVariables
>;
export const CurrentUserInvitationsDocument = gql`
  query CurrentUserInvitations {
    currentUser {
      id
      employeeInvitations {
        ...EmployeeInvitationWithBusinessInfo
      }
    }
  }
  ${EmployeeInvitationWithBusinessInfoFragmentDoc}
`;

/**
 * __useCurrentUserInvitationsQuery__
 *
 * To run a query within a React component, call `useCurrentUserInvitationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserInvitationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserInvitationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserInvitationsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CurrentUserInvitationsQuery,
    CurrentUserInvitationsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    CurrentUserInvitationsQuery,
    CurrentUserInvitationsQueryVariables
  >(CurrentUserInvitationsDocument, baseOptions);
}
export function useCurrentUserInvitationsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CurrentUserInvitationsQuery,
    CurrentUserInvitationsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    CurrentUserInvitationsQuery,
    CurrentUserInvitationsQueryVariables
  >(CurrentUserInvitationsDocument, baseOptions);
}
export type CurrentUserInvitationsQueryHookResult = ReturnType<
  typeof useCurrentUserInvitationsQuery
>;
export type CurrentUserInvitationsLazyQueryHookResult = ReturnType<
  typeof useCurrentUserInvitationsLazyQuery
>;
export type CurrentUserInvitationsQueryResult = ApolloReactCommon.QueryResult<
  CurrentUserInvitationsQuery,
  CurrentUserInvitationsQueryVariables
>;
export const EmployeeRolesDocument = gql`
  query EmployeeRoles($locationId: ID!) {
    employeeRoles(locationId: $locationId) {
      ...EmployeeRole
    }
  }
  ${EmployeeRoleFragmentDoc}
`;

/**
 * __useEmployeeRolesQuery__
 *
 * To run a query within a React component, call `useEmployeeRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmployeeRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmployeeRolesQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *   },
 * });
 */
export function useEmployeeRolesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    EmployeeRolesQuery,
    EmployeeRolesQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    EmployeeRolesQuery,
    EmployeeRolesQueryVariables
  >(EmployeeRolesDocument, baseOptions);
}
export function useEmployeeRolesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EmployeeRolesQuery,
    EmployeeRolesQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    EmployeeRolesQuery,
    EmployeeRolesQueryVariables
  >(EmployeeRolesDocument, baseOptions);
}
export type EmployeeRolesQueryHookResult = ReturnType<
  typeof useEmployeeRolesQuery
>;
export type EmployeeRolesLazyQueryHookResult = ReturnType<
  typeof useEmployeeRolesLazyQuery
>;
export type EmployeeRolesQueryResult = ApolloReactCommon.QueryResult<
  EmployeeRolesQuery,
  EmployeeRolesQueryVariables
>;
export const LocationsDocument = gql`
  query Locations {
    locations {
      ...Location
    }
  }
  ${LocationFragmentDoc}
`;

/**
 * __useLocationsQuery__
 *
 * To run a query within a React component, call `useLocationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLocationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLocationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLocationsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    LocationsQuery,
    LocationsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<LocationsQuery, LocationsQueryVariables>(
    LocationsDocument,
    baseOptions,
  );
}
export function useLocationsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    LocationsQuery,
    LocationsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<LocationsQuery, LocationsQueryVariables>(
    LocationsDocument,
    baseOptions,
  );
}
export type LocationsQueryHookResult = ReturnType<typeof useLocationsQuery>;
export type LocationsLazyQueryHookResult = ReturnType<
  typeof useLocationsLazyQuery
>;
export type LocationsQueryResult = ApolloReactCommon.QueryResult<
  LocationsQuery,
  LocationsQueryVariables
>;
export const ImageDocument = gql`
  query Image($id: ID!) {
    image(id: $id) {
      ...Image
    }
  }
  ${ImageFragmentDoc}
`;

/**
 * __useImageQuery__
 *
 * To run a query within a React component, call `useImageQuery` and pass it any options that fit your needs.
 * When your component renders, `useImageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useImageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useImageQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ImageQuery,
    ImageQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<ImageQuery, ImageQueryVariables>(
    ImageDocument,
    baseOptions,
  );
}
export function useImageLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ImageQuery,
    ImageQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<ImageQuery, ImageQueryVariables>(
    ImageDocument,
    baseOptions,
  );
}
export type ImageQueryHookResult = ReturnType<typeof useImageQuery>;
export type ImageLazyQueryHookResult = ReturnType<typeof useImageLazyQuery>;
export type ImageQueryResult = ApolloReactCommon.QueryResult<
  ImageQuery,
  ImageQueryVariables
>;
export const LocationDocument = gql`
  query Location($id: ID!) {
    location(id: $id) {
      ...Location
    }
  }
  ${LocationFragmentDoc}
`;

/**
 * __useLocationQuery__
 *
 * To run a query within a React component, call `useLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLocationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useLocationQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    LocationQuery,
    LocationQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<LocationQuery, LocationQueryVariables>(
    LocationDocument,
    baseOptions,
  );
}
export function useLocationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    LocationQuery,
    LocationQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<LocationQuery, LocationQueryVariables>(
    LocationDocument,
    baseOptions,
  );
}
export type LocationQueryHookResult = ReturnType<typeof useLocationQuery>;
export type LocationLazyQueryHookResult = ReturnType<
  typeof useLocationLazyQuery
>;
export type LocationQueryResult = ApolloReactCommon.QueryResult<
  LocationQuery,
  LocationQueryVariables
>;
export const ClientsDocument = gql`
  query Clients($businessId: ID!) {
    clients(businessId: $businessId) {
      ...Client
    }
  }
  ${ClientFragmentDoc}
`;

/**
 * __useClientsQuery__
 *
 * To run a query within a React component, call `useClientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientsQuery({
 *   variables: {
 *      businessId: // value for 'businessId'
 *   },
 * });
 */
export function useClientsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ClientsQuery,
    ClientsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<ClientsQuery, ClientsQueryVariables>(
    ClientsDocument,
    baseOptions,
  );
}
export function useClientsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ClientsQuery,
    ClientsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<ClientsQuery, ClientsQueryVariables>(
    ClientsDocument,
    baseOptions,
  );
}
export type ClientsQueryHookResult = ReturnType<typeof useClientsQuery>;
export type ClientsLazyQueryHookResult = ReturnType<typeof useClientsLazyQuery>;
export type ClientsQueryResult = ApolloReactCommon.QueryResult<
  ClientsQuery,
  ClientsQueryVariables
>;
export const ShiftDocument = gql`
  query Shift($id: ID!) {
    shift(id: $id) {
      ...Shift
    }
  }
  ${ShiftFragmentDoc}
`;

/**
 * __useShiftQuery__
 *
 * To run a query within a React component, call `useShiftQuery` and pass it any options that fit your needs.
 * When your component renders, `useShiftQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShiftQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useShiftQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ShiftQuery,
    ShiftQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<ShiftQuery, ShiftQueryVariables>(
    ShiftDocument,
    baseOptions,
  );
}
export function useShiftLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ShiftQuery,
    ShiftQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<ShiftQuery, ShiftQueryVariables>(
    ShiftDocument,
    baseOptions,
  );
}
export type ShiftQueryHookResult = ReturnType<typeof useShiftQuery>;
export type ShiftLazyQueryHookResult = ReturnType<typeof useShiftLazyQuery>;
export type ShiftQueryResult = ApolloReactCommon.QueryResult<
  ShiftQuery,
  ShiftQueryVariables
>;
export function acceptEmployeeInvitationInputValidationSchema(
  nullable?: boolean,
) {
  return object().shape<AcceptEmployeeInvitationInput>({
    invitationToken: string()
      .required()
      .nullable(false),
  });
}

export function addressInputValidationSchema(nullable?: boolean) {
  return object().shape<AddressInput>({
    city: string().nullable(true),
    country: string().nullable(true),
    district: string().nullable(true),
    postalCode: string().nullable(true),
    streetAddressOne: string().nullable(true),
    streetAddressTwo: string().nullable(true),
  });
}

export function applyRecurrenceValidationSchema(nullable = false) {
  return nullable
    ? mixed().oneOf([null, 'ONLY_THIS_ONE', 'THIS_AND_FOLLOWING', 'ALL'])
    : mixed().oneOf(['ONLY_THIS_ONE', 'THIS_AND_FOLLOWING', 'ALL']);
}
export function appointmentServiceInputValidationSchema(nullable?: boolean) {
  return object().shape<AppointmentServiceInput>({
    clientId: string().nullable(true),
    clientNumber: number()
      .required()
      .nullable(false),
    duration: number()
      .required()
      .nullable(false),
    employeeId: string().nullable(true),
    id: string().nullable(true),
    isEmployeeRequestedByClient: boolean()
      .required()
      .nullable(false),
    order: number()
      .required()
      .nullable(false),
    serviceId: string()
      .required()
      .nullable(false),
    startDate: date()
      .required()
      .nullable(false),
  });
}

export function appointmentStatusValidationSchema(nullable = false) {
  return nullable
    ? mixed().oneOf([null, 'NEW', 'CONFIRMED', 'ARRIVED', 'STARTED'])
    : mixed().oneOf(['NEW', 'CONFIRMED', 'ARRIVED', 'STARTED']);
}
export function calendarEventInputValidationSchema(nullable?: boolean) {
  return object().shape<CalendarEventInput>({
    endDate: date()
      .required()
      .nullable(false),
    recurrence: calendarEventRecurrenceInputValidationSchema(true).nullable(
      true,
    ),
    startDate: date()
      .required()
      .nullable(false),
  });
}

export function calendarEventRecurrenceFrequencyValidationSchema(
  nullable = false,
) {
  return nullable
    ? mixed().oneOf([null, 'YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY'])
    : mixed().oneOf(['YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY']);
}
export function calendarEventRecurrenceInputValidationSchema(
  nullable?: boolean,
) {
  return object().shape<CalendarEventRecurrenceInput>({
    byHour: array()
      .of(number().nullable(false))
      .nullable(true),
    byMinute: array()
      .of(number().nullable(false))
      .nullable(true),
    byMonth: array()
      .of(number().nullable(false))
      .nullable(true),
    byMonthDay: array()
      .of(number().nullable(false))
      .nullable(true),
    bySecond: array()
      .of(number().nullable(false))
      .nullable(true),
    bySetPosition: array()
      .of(number().nullable(false))
      .nullable(true),
    byWeekDay: array()
      .of(number().nullable(false))
      .nullable(true),
    byWeekNumber: array()
      .of(number().nullable(false))
      .nullable(true),
    byYearDay: array()
      .of(number().nullable(false))
      .nullable(true),
    count: number().nullable(true),
    frequency: calendarEventRecurrenceFrequencyValidationSchema(false)
      .required()
      .nullable(false),
    interval: number().nullable(true),
    timezoneId: string().nullable(true),
    until: date().nullable(true),
    weekStart: number().nullable(true),
  });
}

export function cancelAppointmentInputValidationSchema(nullable?: boolean) {
  return object().shape<CancelAppointmentInput>({
    applyRecurrence: applyRecurrenceValidationSchema(true).nullable(true),
    cancellationReason: string().nullable(true),
    id: string()
      .required()
      .nullable(false),
  });
}

export function cancelEmployeeInvitationInputValidationSchema(
  nullable?: boolean,
) {
  return object().shape<CancelEmployeeInvitationInput>({
    employeeId: string()
      .required()
      .nullable(false),
  });
}

export function cancelShiftInputValidationSchema(nullable?: boolean) {
  return object().shape<CancelShiftInput>({
    applyRecurrence: applyRecurrenceValidationSchema(false)
      .required()
      .nullable(false),
    id: string()
      .required()
      .nullable(false),
  });
}

export function checkOutAppointmentInputValidationSchema(nullable?: boolean) {
  return object().shape<CheckOutAppointmentInput>({
    id: string()
      .required()
      .nullable(false),
    invoiceId: string()
      .required()
      .nullable(false),
  });
}

export function cloudStorageProviderValidationSchema(nullable = false) {
  return nullable ? mixed().oneOf([null, 'S3']) : mixed().oneOf(['S3']);
}
export function contactDetailsInputValidationSchema(nullable?: boolean) {
  return object().shape<ContactDetailsInput>({
    countryCode: string().nullable(true),
    email: string().nullable(true),
    phoneNumber: string().nullable(true),
  });
}

export function createAppointmentInputValidationSchema(nullable?: boolean) {
  return object().shape<CreateAppointmentInput>({
    clientId: string().nullable(true),
    id: string().nullable(true),
    internalNotes: string().nullable(true),
    locationId: string()
      .required()
      .nullable(false),
    recurrence: calendarEventRecurrenceInputValidationSchema(true).nullable(
      true,
    ),
    services: array()
      .of(
        appointmentServiceInputValidationSchema(false)
          .required()
          .nullable(false),
      )
      .nullable(false),
  });
}

export function createBusinessInputValidationSchema(nullable?: boolean) {
  return object().shape<CreateBusinessInput>({
    countryCode: string().nullable(true),
    email: string().nullable(true),
    facebookUrl: string().nullable(true),
    id: string().nullable(true),
    logoImageId: string().nullable(true),
    name: string()
      .required()
      .nullable(false),
    phoneNumber: string().nullable(true),
  });
}

export function createClientInputValidationSchema(nullable?: boolean) {
  return object().shape<CreateClientInput>({
    contactDetails: contactDetailsInputValidationSchema(false)
      .required()
      .nullable(false),
    discount: number().nullable(true),
    id: string().nullable(true),
    importantNotes: string().nullable(true),
    isBanned: boolean().nullable(true),
    notes: string().nullable(true),
    profile: userProfileInputValidationSchema(false)
      .required()
      .nullable(false),
    referralSource: string().nullable(true),
  });
}

export function createEmployeeInputValidationSchema(nullable?: boolean) {
  return object().shape<CreateEmployeeInput>({
    contactDetails: contactDetailsInputValidationSchema(true).nullable(true),
    employment: employeeEmploymentInputValidationSchema(true).nullable(true),
    locationId: string()
      .required()
      .nullable(false),
    notes: string().nullable(true),
    profile: userProfileInputValidationSchema(false)
      .required()
      .nullable(false),
    salarySettings: employeeSalarySettingsInputValidationSchema(true).nullable(
      true,
    ),
    serviceIds: array()
      .of(string().nullable(false))
      .nullable(true),
    shiftSettings: employeeShiftSettingsInputValidationSchema(true).nullable(
      true,
    ),
  });
}

export function createInvoiceInputValidationSchema(nullable?: boolean) {
  return object().shape<CreateInvoiceInput>({
    clientId: string().nullable(true),
    discount: discountInputValidationSchema(true).nullable(true),
    id: string().nullable(true),
    lineItems: array()
      .of(
        invoiceLineItemInputValidationSchema(false)
          .required()
          .nullable(false),
      )
      .nullable(false),
    locationId: string()
      .required()
      .nullable(false),
    note: string().nullable(true),
    payment: paymentInputValidationSchema(false)
      .required()
      .nullable(false),
    tip: tipInputValidationSchema(true).nullable(true),
  });
}

export function createLocationInputValidationSchema(nullable?: boolean) {
  return object().shape<CreateLocationInput>({
    address: addressInputValidationSchema(true).nullable(true),
    businessHours: array()
      .of(calendarEventInputValidationSchema(true).nullable(false))
      .nullable(true),
    contactDetails: contactDetailsInputValidationSchema(true).nullable(true),
    id: string().nullable(true),
    name: string()
      .required()
      .nullable(false),
  });
}

export function createServiceCategoryInputValidationSchema(nullable?: boolean) {
  return object().shape<CreateServiceCategoryInput>({
    name: string()
      .required()
      .nullable(false),
  });
}

export function createServiceInputValidationSchema(nullable?: boolean) {
  return object().shape<CreateServiceInput>({
    description: string().nullable(true),
    id: string().nullable(true),
    imageIds: array()
      .of(
        string()
          .required()
          .nullable(false),
      )
      .nullable(false),
    intervalTime: number().nullable(true),
    locationId: string()
      .required()
      .nullable(false),
    name: string()
      .required()
      .nullable(false),
    noteToClient: string().nullable(true),
    paddingTime: servicePaddingTimeInputValidationSchema(true).nullable(true),
    parallelClientsCount: number().nullable(true),
    pricingOptions: array()
      .of(
        servicePricingOptionInputValidationSchema(false)
          .required()
          .nullable(false),
      )
      .nullable(false),
    primaryImageId: string().nullable(true),
    processingTimeAfterServiceEnd: number().nullable(true),
    processingTimeDuringService: serviceProcessingTimeDuringServiceEndInputValidationSchema(
      true,
    ).nullable(true),
    questionsForClient: array()
      .of(
        string()
          .required()
          .nullable(false),
      )
      .nullable(false),
    serviceCategoryId: string().nullable(true),
  });
}

export function createShiftInputValidationSchema(nullable?: boolean) {
  return object().shape<CreateShiftInput>({
    breakDuration: number().nullable(true),
    employeeId: string()
      .required()
      .nullable(false),
    endDate: date()
      .required()
      .nullable(false),
    id: string().nullable(true),
    locationId: string()
      .required()
      .nullable(false),
    notes: string().nullable(true),
    recurrence: calendarEventRecurrenceInputValidationSchema(true).nullable(
      true,
    ),
    startDate: date()
      .required()
      .nullable(false),
    status: shiftStatusValidationSchema(true).nullable(true),
  });
}

export function deactivateUserInputValidationSchema(nullable?: boolean) {
  return object().shape<DeactivateUserInput>({
    id: string()
      .required()
      .nullable(false),
  });
}

export function declineEmployeeInvitationInputValidationSchema(
  nullable?: boolean,
) {
  return object().shape<DeclineEmployeeInvitationInput>({
    employeeId: string()
      .required()
      .nullable(false),
  });
}

export function deleteBusinessInputValidationSchema(nullable?: boolean) {
  return object().shape<DeleteBusinessInput>({
    id: string()
      .required()
      .nullable(false),
  });
}

export function deleteClientInputValidationSchema(nullable?: boolean) {
  return object().shape<DeleteClientInput>({
    id: string()
      .required()
      .nullable(false),
  });
}

export function deleteEmployeeInputValidationSchema(nullable?: boolean) {
  return object().shape<DeleteEmployeeInput>({
    id: string()
      .required()
      .nullable(false),
  });
}

export function deleteLocationInputValidationSchema(nullable?: boolean) {
  return object().shape<DeleteLocationInput>({
    id: string()
      .required()
      .nullable(false),
  });
}

export function deleteServiceCategoryInputValidationSchema(nullable?: boolean) {
  return object().shape<DeleteServiceCategoryInput>({
    id: string()
      .required()
      .nullable(false),
  });
}

export function deleteServiceInputValidationSchema(nullable?: boolean) {
  return object().shape<DeleteServiceInput>({
    id: string()
      .required()
      .nullable(false),
  });
}

export function disconnectFacebookInputValidationSchema(nullable?: boolean) {
  return object().shape<DisconnectFacebookInput>({
    userId: string()
      .required()
      .nullable(false),
  });
}

export function disconnectGoogleInputValidationSchema(nullable?: boolean) {
  return object().shape<DisconnectGoogleInput>({
    userId: string()
      .required()
      .nullable(false),
  });
}

export function discountInputValidationSchema(nullable?: boolean) {
  return object().shape<DiscountInput>({
    amount: number()
      .required()
      .nullable(false),
  });
}

export function employeeEmploymentInputValidationSchema(nullable?: boolean) {
  return object().shape<EmployeeEmploymentInput>({
    employmentEndDate: date().nullable(true),
    employmentStartDate: date().nullable(true),
    title: string().nullable(true),
  });
}

export function employeeSalarySettingsInputValidationSchema(
  nullable?: boolean,
) {
  return object().shape<EmployeeSalarySettingsInput>({
    productCommission: number().nullable(true),
    serviceCommission: number().nullable(true),
    voucherCommission: number().nullable(true),
    wage: number().nullable(true),
  });
}

export function employeeShiftSettingsInputValidationSchema(nullable?: boolean) {
  return object().shape<EmployeeShiftSettingsInput>({
    appointmentColor: string().nullable(true),
    canHaveAppointments: boolean().nullable(true),
  });
}

export function graphQLPersonGenderValidationSchema(nullable = false) {
  return nullable
    ? mixed().oneOf([null, 'MALE', 'FEMALE'])
    : mixed().oneOf(['MALE', 'FEMALE']);
}
export function imageSupportedFormatValidationSchema(nullable = false) {
  return nullable
    ? mixed().oneOf([null, 'JPG', 'JPEG', 'PNG'])
    : mixed().oneOf(['JPG', 'JPEG', 'PNG']);
}
export function inviteEmployeeInputValidationSchema(nullable?: boolean) {
  return object().shape<InviteEmployeeInput>({
    countryCode: string()
      .required()
      .nullable(false),
    employeeId: string()
      .required()
      .nullable(false),
    employeeRoleId: string()
      .required()
      .nullable(false),
    phoneNumber: string()
      .required()
      .nullable(false),
  });
}

export function invoiceLineItemInputValidationSchema(nullable?: boolean) {
  return object().shape<InvoiceLineItemInput>({
    discount: discountInputValidationSchema(true).nullable(true),
    employeeId: string()
      .required()
      .nullable(false),
    id: string().nullable(true),
    price: number()
      .required()
      .nullable(false),
    quantity: number()
      .required()
      .nullable(false),
    type: invoiceLineItemTypeValidationSchema(false)
      .required()
      .nullable(false),
    typeId: string()
      .required()
      .nullable(false),
  });
}

export function invoiceLineItemTypeValidationSchema(nullable = false) {
  return nullable
    ? mixed().oneOf([null, 'SERVICE', 'PRODUCT'])
    : mixed().oneOf(['SERVICE', 'PRODUCT']);
}
export function invoiceStatusValidationSchema(nullable = false) {
  return nullable
    ? mixed().oneOf([null, 'VOID', 'REFUNDED', 'COMPLETED'])
    : mixed().oneOf(['VOID', 'REFUNDED', 'COMPLETED']);
}
export function linkFacebookAccountInputValidationSchema(nullable?: boolean) {
  return object().shape<LinkFacebookAccountInput>({
    facebookAccessToken: string()
      .required()
      .nullable(false),
    userId: string()
      .required()
      .nullable(false),
  });
}

export function linkGoogleAccountInputValidationSchema(nullable?: boolean) {
  return object().shape<LinkGoogleAccountInput>({
    googleIdToken: string()
      .required()
      .nullable(false),
    userId: string()
      .required()
      .nullable(false),
  });
}

export function logInEmailStartInputValidationSchema(nullable?: boolean) {
  return object().shape<LogInEmailStartInput>({
    email: string()
      .required()
      .nullable(false),
  });
}

export function logInEmailVerifyInputValidationSchema(nullable?: boolean) {
  return object().shape<LogInEmailVerifyInput>({
    code: string()
      .required()
      .nullable(false),
    state: string()
      .required()
      .nullable(false),
  });
}

export function logInFacebookInputValidationSchema(nullable?: boolean) {
  return object().shape<LogInFacebookInput>({
    facebookAccessToken: string()
      .required()
      .nullable(false),
  });
}

export function logInGoogleInputValidationSchema(nullable?: boolean) {
  return object().shape<LogInGoogleInput>({
    googleIdToken: string()
      .required()
      .nullable(false),
  });
}

export function logInPhoneStartInputValidationSchema(nullable?: boolean) {
  return object().shape<LogInPhoneStartInput>({
    countryCode: string()
      .required()
      .nullable(false),
    phoneNumber: string()
      .required()
      .nullable(false),
  });
}

export function logInPhoneVerifyInputValidationSchema(nullable?: boolean) {
  return object().shape<LogInPhoneVerifyInput>({
    code: string()
      .required()
      .nullable(false),
    state: string()
      .required()
      .nullable(false),
  });
}

export function logInSilentInputValidationSchema(nullable?: boolean) {
  return object().shape<LogInSilentInput>({
    userId: string()
      .required()
      .nullable(false),
  });
}

export function markNoShowAppointmentInputValidationSchema(nullable?: boolean) {
  return object().shape<MarkNoShowAppointmentInput>({
    id: string()
      .required()
      .nullable(false),
  });
}

export function paymentInputValidationSchema(nullable?: boolean) {
  return object().shape<PaymentInput>({
    amount: number()
      .required()
      .nullable(false),
    method: paymentMethodInputValidationSchema(true).nullable(true),
  });
}

export function paymentMethodInputValidationSchema(nullable?: boolean) {
  return object().shape<PaymentMethodInput>({
    name: string()
      .required()
      .nullable(false),
  });
}

export function policyEffectValidationSchema(nullable = false) {
  return nullable
    ? mixed().oneOf([null, 'ALLOW', 'DENY'])
    : mixed().oneOf(['ALLOW', 'DENY']);
}
export function predefinedImageSizeValidationSchema(nullable = false) {
  return nullable
    ? mixed().oneOf([
        null,
        'ORIGINAL',
        'SMALL',
        'MEDIUM',
        'LARGE',
        'XLARGE',
        'XXLARGE',
      ])
    : mixed().oneOf([
        'ORIGINAL',
        'SMALL',
        'MEDIUM',
        'LARGE',
        'XLARGE',
        'XXLARGE',
      ]);
}
export function refundInvoiceInputValidationSchema(nullable?: boolean) {
  return object().shape<RefundInvoiceInput>({
    id: string()
      .required()
      .nullable(false),
    lineItems: array()
      .of(
        refundInvoiceLineItemInputValidationSchema(false)
          .required()
          .nullable(false),
      )
      .nullable(false),
    payment: paymentInputValidationSchema(false)
      .required()
      .nullable(false),
  });
}

export function refundInvoiceLineItemInputValidationSchema(nullable?: boolean) {
  return object().shape<RefundInvoiceLineItemInput>({
    id: string()
      .required()
      .nullable(false),
    quantity: number()
      .required()
      .nullable(false),
  });
}

export function servicePaddingTimeInputValidationSchema(nullable?: boolean) {
  return object().shape<ServicePaddingTimeInput>({
    duration: number()
      .required()
      .nullable(false),
    type: servicePaddingTimeTypeValidationSchema(false)
      .required()
      .nullable(false),
  });
}

export function servicePaddingTimeTypeValidationSchema(nullable = false) {
  return nullable
    ? mixed().oneOf([null, 'BEFORE', 'AFTER', 'BEFORE_AND_AFTER'])
    : mixed().oneOf(['BEFORE', 'AFTER', 'BEFORE_AND_AFTER']);
}
export function servicePricingOptionInputValidationSchema(nullable?: boolean) {
  return object().shape<ServicePricingOptionInput>({
    duration: number()
      .required()
      .nullable(false),
    name: string().nullable(true),
    price: number()
      .required()
      .nullable(false),
    type: string()
      .required()
      .nullable(false),
  });
}

export function serviceProcessingTimeDuringServiceEndInputValidationSchema(
  nullable?: boolean,
) {
  return object().shape<ServiceProcessingTimeDuringServiceEndInput>({
    after: number()
      .required()
      .nullable(false),
    duration: number()
      .required()
      .nullable(false),
  });
}

export function shiftsFilterValidationSchema(nullable?: boolean) {
  return object().shape<ShiftsFilter>({
    endDate: date()
      .required()
      .nullable(false),
    startDate: date()
      .required()
      .nullable(false),
    status: shiftStatusValidationSchema(true).nullable(true),
  });
}

export function shiftStatusValidationSchema(nullable = false) {
  return nullable
    ? mixed().oneOf([
        null,
        'DRAFT',
        'PUBLISHED',
        'CONFIRMED',
        'STARTED',
        'COMPLETED',
        'CALLED_SICK',
      ])
    : mixed().oneOf([
        'DRAFT',
        'PUBLISHED',
        'CONFIRMED',
        'STARTED',
        'COMPLETED',
        'CALLED_SICK',
      ]);
}
export function tipInputValidationSchema(nullable?: boolean) {
  return object().shape<TipInput>({
    amount: number()
      .required()
      .nullable(false),
  });
}

export function unlinkEmployeeInputValidationSchema(nullable?: boolean) {
  return object().shape<UnlinkEmployeeInput>({
    employeeId: string()
      .required()
      .nullable(false),
  });
}

export function updateAppointmentInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateAppointmentInput>({
    applyRecurrence: applyRecurrenceValidationSchema(true).nullable(true),
    canceledAt: date().nullable(true),
    cancellationReason: string().nullable(true),
    clientId: string().nullable(true),
    clientNotes: string().nullable(true),
    id: string()
      .required()
      .nullable(false),
    internalNotes: string().nullable(true),
    recurrence: calendarEventRecurrenceInputValidationSchema(true).nullable(
      true,
    ),
    services: array()
      .of(appointmentServiceInputValidationSchema(true).nullable(false))
      .nullable(true),
    status: appointmentStatusValidationSchema(true).nullable(true),
  });
}

export function updateBusinessInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateBusinessInput>({
    countryCode: string().nullable(true),
    email: string().nullable(true),
    facebookUrl: string().nullable(true),
    id: string()
      .required()
      .nullable(false),
    logoImageId: string().nullable(true),
    name: string().nullable(true),
    phoneNumber: string().nullable(true),
  });
}

export function updateClientInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateClientInput>({
    contactDetails: contactDetailsInputValidationSchema(true).nullable(true),
    discount: number().nullable(true),
    id: string()
      .required()
      .nullable(false),
    importantNotes: string().nullable(true),
    isBanned: boolean().nullable(true),
    notes: string().nullable(true),
    profile: userProfileInputValidationSchema(true).nullable(true),
    referralSource: string().nullable(true),
  });
}

export function updateEmployeeInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateEmployeeInput>({
    contactDetails: contactDetailsInputValidationSchema(true).nullable(true),
    employment: employeeEmploymentInputValidationSchema(true).nullable(true),
    id: string()
      .required()
      .nullable(false),
    notes: string().nullable(true),
    profile: userProfileInputValidationSchema(true).nullable(true),
    salarySettings: employeeSalarySettingsInputValidationSchema(true).nullable(
      true,
    ),
    serviceIds: array()
      .of(string().nullable(false))
      .nullable(true),
    shiftSettings: employeeShiftSettingsInputValidationSchema(true).nullable(
      true,
    ),
  });
}

export function updateEmployeeRoleInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateEmployeeRoleInput>({
    employeeRoleId: string()
      .required()
      .nullable(false),
    id: string()
      .required()
      .nullable(false),
  });
}

export function updateEmployeeRolePermissionsInputValidationSchema(
  nullable?: boolean,
) {
  return object().shape<UpdateEmployeeRolePermissionsInput>({
    id: string()
      .required()
      .nullable(false),
    permissions: array()
      .of(
        string()
          .required()
          .nullable(false),
      )
      .nullable(false),
  });
}

export function updateLocationInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateLocationInput>({
    address: addressInputValidationSchema(true).nullable(true),
    businessHours: array()
      .of(calendarEventInputValidationSchema(true).nullable(false))
      .nullable(true),
    contactDetails: contactDetailsInputValidationSchema(true).nullable(true),
    id: string()
      .required()
      .nullable(false),
    name: string().nullable(true),
  });
}

export function updateServiceCategoryInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateServiceCategoryInput>({
    id: string()
      .required()
      .nullable(false),
    name: string()
      .required()
      .nullable(false),
  });
}

export function updateServiceInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateServiceInput>({
    description: string().nullable(true),
    id: string()
      .required()
      .nullable(false),
    imageIds: array()
      .of(
        string()
          .required()
          .nullable(false),
      )
      .nullable(false),
    intervalTime: number().nullable(true),
    name: string().nullable(true),
    noteToClient: string().nullable(true),
    paddingTime: servicePaddingTimeInputValidationSchema(true).nullable(true),
    parallelClientsCount: number().nullable(true),
    pricingOptions: array()
      .of(
        servicePricingOptionInputValidationSchema(false)
          .required()
          .nullable(false),
      )
      .nullable(false),
    primaryImageId: string().nullable(true),
    processingTimeAfterServiceEnd: number().nullable(true),
    processingTimeDuringService: serviceProcessingTimeDuringServiceEndInputValidationSchema(
      true,
    ).nullable(true),
    questionsForClient: array()
      .of(
        string()
          .required()
          .nullable(false),
      )
      .nullable(false),
    serviceCategoryId: string().nullable(true),
  });
}

export function updateShiftInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateShiftInput>({
    applyRecurrence: applyRecurrenceValidationSchema(false)
      .required()
      .nullable(false),
    breakDuration: number().nullable(true),
    canceledAt: date().nullable(true),
    employeeId: string()
      .required()
      .nullable(false),
    endDate: date()
      .required()
      .nullable(false),
    id: string()
      .required()
      .nullable(false),
    locationId: string().nullable(true),
    notes: string().nullable(true),
    recurrence: calendarEventRecurrenceInputValidationSchema(true).nullable(
      true,
    ),
    startDate: date()
      .required()
      .nullable(false),
    status: shiftStatusValidationSchema(true).nullable(true),
  });
}

export function updateUserEmailStartInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateUserEmailStartInput>({
    email: string()
      .required()
      .nullable(false),
    id: string()
      .required()
      .nullable(false),
  });
}

export function updateUserEmailVerifyInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateUserEmailVerifyInput>({
    code: string()
      .required()
      .nullable(false),
    email: string()
      .required()
      .nullable(false),
    id: string()
      .required()
      .nullable(false),
  });
}

export function updateUserPhoneStartInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateUserPhoneStartInput>({
    countryCode: string()
      .required()
      .nullable(false),
    id: string()
      .required()
      .nullable(false),
    phoneNumber: string()
      .required()
      .nullable(false),
  });
}

export function updateUserPhoneVerifyInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateUserPhoneVerifyInput>({
    code: string()
      .required()
      .nullable(false),
    countryCode: string()
      .required()
      .nullable(false),
    id: string()
      .required()
      .nullable(false),
    phoneNumber: string()
      .required()
      .nullable(false),
  });
}

export function updateUserProfileInputValidationSchema(nullable?: boolean) {
  return object().shape<UpdateUserProfileInput>({
    id: string()
      .required()
      .nullable(false),
    profile: userProfileInputValidationSchema(true).nullable(true),
  });
}

export function userProfileInputValidationSchema(nullable?: boolean) {
  return object().shape<UserProfileInput>({
    birthday: date().nullable(true),
    fullName: string()
      .required()
      .nullable(false),
    gender: graphQLPersonGenderValidationSchema(true).nullable(true),
    profileImageId: string().nullable(true),
  });
}

export function voidInvoiceInputValidationSchema(nullable?: boolean) {
  return object().shape<VoidInvoiceInput>({
    id: string()
      .required()
      .nullable(false),
  });
}

export const validateAcceptEmployeeInvitationInput = validateForUserError<
  AcceptEmployeeInvitationInput
>(acceptEmployeeInvitationInputValidationSchema());

export const validateAddressInput = validateForUserError<AddressInput>(
  addressInputValidationSchema(),
);

export const validateAppointmentServiceInput = validateForUserError<
  AppointmentServiceInput
>(appointmentServiceInputValidationSchema());

export const validateCalendarEventInput = validateForUserError<
  CalendarEventInput
>(calendarEventInputValidationSchema());

export const validateCalendarEventRecurrenceInput = validateForUserError<
  CalendarEventRecurrenceInput
>(calendarEventRecurrenceInputValidationSchema());

export const validateCancelAppointmentInput = validateForUserError<
  CancelAppointmentInput
>(cancelAppointmentInputValidationSchema());

export const validateCancelEmployeeInvitationInput = validateForUserError<
  CancelEmployeeInvitationInput
>(cancelEmployeeInvitationInputValidationSchema());

export const validateCancelShiftInput = validateForUserError<CancelShiftInput>(
  cancelShiftInputValidationSchema(),
);

export const validateCheckOutAppointmentInput = validateForUserError<
  CheckOutAppointmentInput
>(checkOutAppointmentInputValidationSchema());

export const validateContactDetailsInput = validateForUserError<
  ContactDetailsInput
>(contactDetailsInputValidationSchema());

export const validateCreateAppointmentInput = validateForUserError<
  CreateAppointmentInput
>(createAppointmentInputValidationSchema());

export const validateCreateBusinessInput = validateForUserError<
  CreateBusinessInput
>(createBusinessInputValidationSchema());

export const validateCreateClientInput = validateForUserError<
  CreateClientInput
>(createClientInputValidationSchema());

export const validateCreateEmployeeInput = validateForUserError<
  CreateEmployeeInput
>(createEmployeeInputValidationSchema());

export const validateCreateInvoiceInput = validateForUserError<
  CreateInvoiceInput
>(createInvoiceInputValidationSchema());

export const validateCreateLocationInput = validateForUserError<
  CreateLocationInput
>(createLocationInputValidationSchema());

export const validateCreateServiceCategoryInput = validateForUserError<
  CreateServiceCategoryInput
>(createServiceCategoryInputValidationSchema());

export const validateCreateServiceInput = validateForUserError<
  CreateServiceInput
>(createServiceInputValidationSchema());

export const validateCreateShiftInput = validateForUserError<CreateShiftInput>(
  createShiftInputValidationSchema(),
);

export const validateDeactivateUserInput = validateForUserError<
  DeactivateUserInput
>(deactivateUserInputValidationSchema());

export const validateDeclineEmployeeInvitationInput = validateForUserError<
  DeclineEmployeeInvitationInput
>(declineEmployeeInvitationInputValidationSchema());

export const validateDeleteBusinessInput = validateForUserError<
  DeleteBusinessInput
>(deleteBusinessInputValidationSchema());

export const validateDeleteClientInput = validateForUserError<
  DeleteClientInput
>(deleteClientInputValidationSchema());

export const validateDeleteEmployeeInput = validateForUserError<
  DeleteEmployeeInput
>(deleteEmployeeInputValidationSchema());

export const validateDeleteLocationInput = validateForUserError<
  DeleteLocationInput
>(deleteLocationInputValidationSchema());

export const validateDeleteServiceCategoryInput = validateForUserError<
  DeleteServiceCategoryInput
>(deleteServiceCategoryInputValidationSchema());

export const validateDeleteServiceInput = validateForUserError<
  DeleteServiceInput
>(deleteServiceInputValidationSchema());

export const validateDisconnectFacebookInput = validateForUserError<
  DisconnectFacebookInput
>(disconnectFacebookInputValidationSchema());

export const validateDisconnectGoogleInput = validateForUserError<
  DisconnectGoogleInput
>(disconnectGoogleInputValidationSchema());

export const validateDiscountInput = validateForUserError<DiscountInput>(
  discountInputValidationSchema(),
);

export const validateEmployeeEmploymentInput = validateForUserError<
  EmployeeEmploymentInput
>(employeeEmploymentInputValidationSchema());

export const validateEmployeeSalarySettingsInput = validateForUserError<
  EmployeeSalarySettingsInput
>(employeeSalarySettingsInputValidationSchema());

export const validateEmployeeShiftSettingsInput = validateForUserError<
  EmployeeShiftSettingsInput
>(employeeShiftSettingsInputValidationSchema());

export const validateInviteEmployeeInput = validateForUserError<
  InviteEmployeeInput
>(inviteEmployeeInputValidationSchema());

export const validateInvoiceLineItemInput = validateForUserError<
  InvoiceLineItemInput
>(invoiceLineItemInputValidationSchema());

export const validateLinkFacebookAccountInput = validateForUserError<
  LinkFacebookAccountInput
>(linkFacebookAccountInputValidationSchema());

export const validateLinkGoogleAccountInput = validateForUserError<
  LinkGoogleAccountInput
>(linkGoogleAccountInputValidationSchema());

export const validateLogInEmailStartInput = validateForUserError<
  LogInEmailStartInput
>(logInEmailStartInputValidationSchema());

export const validateLogInEmailVerifyInput = validateForUserError<
  LogInEmailVerifyInput
>(logInEmailVerifyInputValidationSchema());

export const validateLogInFacebookInput = validateForUserError<
  LogInFacebookInput
>(logInFacebookInputValidationSchema());

export const validateLogInGoogleInput = validateForUserError<LogInGoogleInput>(
  logInGoogleInputValidationSchema(),
);

export const validateLogInPhoneStartInput = validateForUserError<
  LogInPhoneStartInput
>(logInPhoneStartInputValidationSchema());

export const validateLogInPhoneVerifyInput = validateForUserError<
  LogInPhoneVerifyInput
>(logInPhoneVerifyInputValidationSchema());

export const validateLogInSilentInput = validateForUserError<LogInSilentInput>(
  logInSilentInputValidationSchema(),
);

export const validateMarkNoShowAppointmentInput = validateForUserError<
  MarkNoShowAppointmentInput
>(markNoShowAppointmentInputValidationSchema());

export const validatePaymentInput = validateForUserError<PaymentInput>(
  paymentInputValidationSchema(),
);

export const validatePaymentMethodInput = validateForUserError<
  PaymentMethodInput
>(paymentMethodInputValidationSchema());

export const validateRefundInvoiceInput = validateForUserError<
  RefundInvoiceInput
>(refundInvoiceInputValidationSchema());

export const validateRefundInvoiceLineItemInput = validateForUserError<
  RefundInvoiceLineItemInput
>(refundInvoiceLineItemInputValidationSchema());

export const validateServicePaddingTimeInput = validateForUserError<
  ServicePaddingTimeInput
>(servicePaddingTimeInputValidationSchema());

export const validateServicePricingOptionInput = validateForUserError<
  ServicePricingOptionInput
>(servicePricingOptionInputValidationSchema());

export const validateServiceProcessingTimeDuringServiceEndInput = validateForUserError<
  ServiceProcessingTimeDuringServiceEndInput
>(serviceProcessingTimeDuringServiceEndInputValidationSchema());

export const validateShiftsFilter = validateForUserError<ShiftsFilter>(
  shiftsFilterValidationSchema(),
);

export const validateTipInput = validateForUserError<TipInput>(
  tipInputValidationSchema(),
);

export const validateUnlinkEmployeeInput = validateForUserError<
  UnlinkEmployeeInput
>(unlinkEmployeeInputValidationSchema());

export const validateUpdateAppointmentInput = validateForUserError<
  UpdateAppointmentInput
>(updateAppointmentInputValidationSchema());

export const validateUpdateBusinessInput = validateForUserError<
  UpdateBusinessInput
>(updateBusinessInputValidationSchema());

export const validateUpdateClientInput = validateForUserError<
  UpdateClientInput
>(updateClientInputValidationSchema());

export const validateUpdateEmployeeInput = validateForUserError<
  UpdateEmployeeInput
>(updateEmployeeInputValidationSchema());

export const validateUpdateEmployeeRoleInput = validateForUserError<
  UpdateEmployeeRoleInput
>(updateEmployeeRoleInputValidationSchema());

export const validateUpdateEmployeeRolePermissionsInput = validateForUserError<
  UpdateEmployeeRolePermissionsInput
>(updateEmployeeRolePermissionsInputValidationSchema());

export const validateUpdateLocationInput = validateForUserError<
  UpdateLocationInput
>(updateLocationInputValidationSchema());

export const validateUpdateServiceCategoryInput = validateForUserError<
  UpdateServiceCategoryInput
>(updateServiceCategoryInputValidationSchema());

export const validateUpdateServiceInput = validateForUserError<
  UpdateServiceInput
>(updateServiceInputValidationSchema());

export const validateUpdateShiftInput = validateForUserError<UpdateShiftInput>(
  updateShiftInputValidationSchema(),
);

export const validateUpdateUserEmailStartInput = validateForUserError<
  UpdateUserEmailStartInput
>(updateUserEmailStartInputValidationSchema());

export const validateUpdateUserEmailVerifyInput = validateForUserError<
  UpdateUserEmailVerifyInput
>(updateUserEmailVerifyInputValidationSchema());

export const validateUpdateUserPhoneStartInput = validateForUserError<
  UpdateUserPhoneStartInput
>(updateUserPhoneStartInputValidationSchema());

export const validateUpdateUserPhoneVerifyInput = validateForUserError<
  UpdateUserPhoneVerifyInput
>(updateUserPhoneVerifyInputValidationSchema());

export const validateUpdateUserProfileInput = validateForUserError<
  UpdateUserProfileInput
>(updateUserProfileInputValidationSchema());

export const validateUserProfileInput = validateForUserError<UserProfileInput>(
  userProfileInputValidationSchema(),
);

export const validateVoidInvoiceInput = validateForUserError<VoidInvoiceInput>(
  voidInvoiceInputValidationSchema(),
);

export interface UseCreateBusinessProps
  extends Omit<FormikConfig<CreateBusinessInput>, 'onSubmit'> {
  onCompleted?: (
    data: CreateBusinessMutation,
    helpers: FormikHelpers<CreateBusinessInput>,
  ) => void;
}

export const useCreateBusinessForm = (props: UseCreateBusinessProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useCreateBusinessMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<CreateBusinessInput>({
    initialStatus: {},
    validationSchema: createBusinessInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.createBusiness &&
          result.data.createBusiness.userError
        ) {
          if (result.data.createBusiness.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.createBusiness.userError),
            );
          } else {
            setStatus(result.data.createBusiness.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUpdateBusinessProps
  extends Omit<FormikConfig<UpdateBusinessInput>, 'onSubmit'> {
  onCompleted?: (
    data: UpdateBusinessMutation,
    helpers: FormikHelpers<UpdateBusinessInput>,
  ) => void;
}

export const useUpdateBusinessForm = (props: UseUpdateBusinessProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUpdateBusinessMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UpdateBusinessInput>({
    initialStatus: {},
    validationSchema: updateBusinessInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.updateBusiness &&
          result.data.updateBusiness.userError
        ) {
          if (result.data.updateBusiness.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.updateBusiness.userError),
            );
          } else {
            setStatus(result.data.updateBusiness.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseDeleteBusinessProps
  extends Omit<FormikConfig<DeleteBusinessInput>, 'onSubmit'> {
  onCompleted?: (
    data: DeleteBusinessMutation,
    helpers: FormikHelpers<DeleteBusinessInput>,
  ) => void;
}

export const useDeleteBusinessForm = (props: UseDeleteBusinessProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useDeleteBusinessMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<DeleteBusinessInput>({
    initialStatus: {},
    validationSchema: deleteBusinessInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.deleteBusiness &&
          result.data.deleteBusiness.userError
        ) {
          if (result.data.deleteBusiness.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.deleteBusiness.userError),
            );
          } else {
            setStatus(result.data.deleteBusiness.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseCreateLocationProps
  extends Omit<FormikConfig<CreateLocationInput>, 'onSubmit'> {
  onCompleted?: (
    data: CreateLocationMutation,
    helpers: FormikHelpers<CreateLocationInput>,
  ) => void;
}

export const useCreateLocationForm = (props: UseCreateLocationProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useCreateLocationMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<CreateLocationInput>({
    initialStatus: {},
    validationSchema: createLocationInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.createLocation &&
          result.data.createLocation.userError
        ) {
          if (result.data.createLocation.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.createLocation.userError),
            );
          } else {
            setStatus(result.data.createLocation.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUpdateLocationProps
  extends Omit<FormikConfig<UpdateLocationInput>, 'onSubmit'> {
  onCompleted?: (
    data: UpdateLocationMutation,
    helpers: FormikHelpers<UpdateLocationInput>,
  ) => void;
}

export const useUpdateLocationForm = (props: UseUpdateLocationProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUpdateLocationMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UpdateLocationInput>({
    initialStatus: {},
    validationSchema: updateLocationInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.updateLocation &&
          result.data.updateLocation.userError
        ) {
          if (result.data.updateLocation.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.updateLocation.userError),
            );
          } else {
            setStatus(result.data.updateLocation.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseDeleteLocationProps
  extends Omit<FormikConfig<DeleteLocationInput>, 'onSubmit'> {
  onCompleted?: (
    data: DeleteLocationMutation,
    helpers: FormikHelpers<DeleteLocationInput>,
  ) => void;
}

export const useDeleteLocationForm = (props: UseDeleteLocationProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useDeleteLocationMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<DeleteLocationInput>({
    initialStatus: {},
    validationSchema: deleteLocationInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.deleteLocation &&
          result.data.deleteLocation.userError
        ) {
          if (result.data.deleteLocation.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.deleteLocation.userError),
            );
          } else {
            setStatus(result.data.deleteLocation.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseLogInFacebookProps
  extends Omit<FormikConfig<LogInFacebookInput>, 'onSubmit'> {
  onCompleted?: (
    data: LogInFacebookMutation,
    helpers: FormikHelpers<LogInFacebookInput>,
  ) => void;
}

export const useLogInFacebookForm = (props: UseLogInFacebookProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useLogInFacebookMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<LogInFacebookInput>({
    initialStatus: {},
    validationSchema: logInFacebookInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (result.data.logInFacebook && result.data.logInFacebook.userError) {
          if (result.data.logInFacebook.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.logInFacebook.userError),
            );
          } else {
            setStatus(result.data.logInFacebook.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseLogInGoogleProps
  extends Omit<FormikConfig<LogInGoogleInput>, 'onSubmit'> {
  onCompleted?: (
    data: LogInGoogleMutation,
    helpers: FormikHelpers<LogInGoogleInput>,
  ) => void;
}

export const useLogInGoogleForm = (props: UseLogInGoogleProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useLogInGoogleMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<LogInGoogleInput>({
    initialStatus: {},
    validationSchema: logInGoogleInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (result.data.logInGoogle && result.data.logInGoogle.userError) {
          if (result.data.logInGoogle.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.logInGoogle.userError),
            );
          } else {
            setStatus(result.data.logInGoogle.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseLogInEmailStartProps
  extends Omit<FormikConfig<LogInEmailStartInput>, 'onSubmit'> {
  onCompleted?: (
    data: LogInEmailStartMutation,
    helpers: FormikHelpers<LogInEmailStartInput>,
  ) => void;
}

export const useLogInEmailStartForm = (props: UseLogInEmailStartProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useLogInEmailStartMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<LogInEmailStartInput>({
    initialStatus: {},
    validationSchema: logInEmailStartInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.logInEmailStart &&
          result.data.logInEmailStart.userError
        ) {
          if (result.data.logInEmailStart.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.logInEmailStart.userError),
            );
          } else {
            setStatus(result.data.logInEmailStart.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseLogInEmailVerifyProps
  extends Omit<FormikConfig<LogInEmailVerifyInput>, 'onSubmit'> {
  onCompleted?: (
    data: LogInEmailVerifyMutation,
    helpers: FormikHelpers<LogInEmailVerifyInput>,
  ) => void;
}

export const useLogInEmailVerifyForm = (props: UseLogInEmailVerifyProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useLogInEmailVerifyMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<LogInEmailVerifyInput>({
    initialStatus: {},
    validationSchema: logInEmailVerifyInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.logInEmailVerify &&
          result.data.logInEmailVerify.userError
        ) {
          if (result.data.logInEmailVerify.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.logInEmailVerify.userError),
            );
          } else {
            setStatus(result.data.logInEmailVerify.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseLogInPhoneStartProps
  extends Omit<FormikConfig<LogInPhoneStartInput>, 'onSubmit'> {
  onCompleted?: (
    data: LogInPhoneStartMutation,
    helpers: FormikHelpers<LogInPhoneStartInput>,
  ) => void;
}

export const useLogInPhoneStartForm = (props: UseLogInPhoneStartProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useLogInPhoneStartMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<LogInPhoneStartInput>({
    initialStatus: {},
    validationSchema: logInPhoneStartInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.logInPhoneStart &&
          result.data.logInPhoneStart.userError
        ) {
          if (result.data.logInPhoneStart.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.logInPhoneStart.userError),
            );
          } else {
            setStatus(result.data.logInPhoneStart.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseLogInPhoneVerifyProps
  extends Omit<FormikConfig<LogInPhoneVerifyInput>, 'onSubmit'> {
  onCompleted?: (
    data: LogInPhoneVerifyMutation,
    helpers: FormikHelpers<LogInPhoneVerifyInput>,
  ) => void;
}

export const useLogInPhoneVerifyForm = (props: UseLogInPhoneVerifyProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useLogInPhoneVerifyMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<LogInPhoneVerifyInput>({
    initialStatus: {},
    validationSchema: logInPhoneVerifyInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.logInPhoneVerify &&
          result.data.logInPhoneVerify.userError
        ) {
          if (result.data.logInPhoneVerify.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.logInPhoneVerify.userError),
            );
          } else {
            setStatus(result.data.logInPhoneVerify.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUpdateUserEmailStartProps
  extends Omit<FormikConfig<UpdateUserEmailStartInput>, 'onSubmit'> {
  onCompleted?: (
    data: UpdateUserEmailStartMutation,
    helpers: FormikHelpers<UpdateUserEmailStartInput>,
  ) => void;
}

export const useUpdateUserEmailStartForm = (
  props: UseUpdateUserEmailStartProps,
) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUpdateUserEmailStartMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UpdateUserEmailStartInput>({
    initialStatus: {},
    validationSchema: updateUserEmailStartInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.updateUserEmailStart &&
          result.data.updateUserEmailStart.userError
        ) {
          if (result.data.updateUserEmailStart.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(
                result.data.updateUserEmailStart.userError,
              ),
            );
          } else {
            setStatus(result.data.updateUserEmailStart.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUpdateUserEmailVerifyProps
  extends Omit<FormikConfig<UpdateUserEmailVerifyInput>, 'onSubmit'> {
  onCompleted?: (
    data: UpdateUserEmailVerifyMutation,
    helpers: FormikHelpers<UpdateUserEmailVerifyInput>,
  ) => void;
}

export const useUpdateUserEmailVerifyForm = (
  props: UseUpdateUserEmailVerifyProps,
) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUpdateUserEmailVerifyMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UpdateUserEmailVerifyInput>({
    initialStatus: {},
    validationSchema: updateUserEmailVerifyInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.updateUserEmailVerify &&
          result.data.updateUserEmailVerify.userError
        ) {
          if (result.data.updateUserEmailVerify.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(
                result.data.updateUserEmailVerify.userError,
              ),
            );
          } else {
            setStatus(result.data.updateUserEmailVerify.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUpdateUserPhoneStartProps
  extends Omit<FormikConfig<UpdateUserPhoneStartInput>, 'onSubmit'> {
  onCompleted?: (
    data: UpdateUserPhoneStartMutation,
    helpers: FormikHelpers<UpdateUserPhoneStartInput>,
  ) => void;
}

export const useUpdateUserPhoneStartForm = (
  props: UseUpdateUserPhoneStartProps,
) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUpdateUserPhoneStartMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UpdateUserPhoneStartInput>({
    initialStatus: {},
    validationSchema: updateUserPhoneStartInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.updateUserPhoneStart &&
          result.data.updateUserPhoneStart.userError
        ) {
          if (result.data.updateUserPhoneStart.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(
                result.data.updateUserPhoneStart.userError,
              ),
            );
          } else {
            setStatus(result.data.updateUserPhoneStart.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUpdateUserPhoneVerifyProps
  extends Omit<FormikConfig<UpdateUserPhoneVerifyInput>, 'onSubmit'> {
  onCompleted?: (
    data: UpdateUserPhoneVerifyMutation,
    helpers: FormikHelpers<UpdateUserPhoneVerifyInput>,
  ) => void;
}

export const useUpdateUserPhoneVerifyForm = (
  props: UseUpdateUserPhoneVerifyProps,
) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUpdateUserPhoneVerifyMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UpdateUserPhoneVerifyInput>({
    initialStatus: {},
    validationSchema: updateUserPhoneVerifyInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.updateUserPhoneVerify &&
          result.data.updateUserPhoneVerify.userError
        ) {
          if (result.data.updateUserPhoneVerify.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(
                result.data.updateUserPhoneVerify.userError,
              ),
            );
          } else {
            setStatus(result.data.updateUserPhoneVerify.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUpdateUserProfileProps
  extends Omit<FormikConfig<UpdateUserProfileInput>, 'onSubmit'> {
  onCompleted?: (
    data: UpdateUserProfileMutation,
    helpers: FormikHelpers<UpdateUserProfileInput>,
  ) => void;
}

export const useUpdateUserProfileForm = (props: UseUpdateUserProfileProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUpdateUserProfileMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UpdateUserProfileInput>({
    initialStatus: {},
    validationSchema: updateUserProfileInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.updateUserProfile &&
          result.data.updateUserProfile.userError
        ) {
          if (result.data.updateUserProfile.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.updateUserProfile.userError),
            );
          } else {
            setStatus(result.data.updateUserProfile.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseLinkFacebookAccountProps
  extends Omit<FormikConfig<LinkFacebookAccountInput>, 'onSubmit'> {
  onCompleted?: (
    data: LinkFacebookAccountMutation,
    helpers: FormikHelpers<LinkFacebookAccountInput>,
  ) => void;
}

export const useLinkFacebookAccountForm = (
  props: UseLinkFacebookAccountProps,
) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useLinkFacebookAccountMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<LinkFacebookAccountInput>({
    initialStatus: {},
    validationSchema: linkFacebookAccountInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.linkFacebookAccount &&
          result.data.linkFacebookAccount.userError
        ) {
          if (result.data.linkFacebookAccount.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.linkFacebookAccount.userError),
            );
          } else {
            setStatus(result.data.linkFacebookAccount.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseDisconnectFacebookProps
  extends Omit<FormikConfig<DisconnectFacebookInput>, 'onSubmit'> {
  onCompleted?: (
    data: DisconnectFacebookMutation,
    helpers: FormikHelpers<DisconnectFacebookInput>,
  ) => void;
}

export const useDisconnectFacebookForm = (
  props: UseDisconnectFacebookProps,
) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useDisconnectFacebookMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<DisconnectFacebookInput>({
    initialStatus: {},
    validationSchema: disconnectFacebookInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.disconnectFacebook &&
          result.data.disconnectFacebook.userError
        ) {
          if (result.data.disconnectFacebook.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.disconnectFacebook.userError),
            );
          } else {
            setStatus(result.data.disconnectFacebook.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseLinkGoogleAccountProps
  extends Omit<FormikConfig<LinkGoogleAccountInput>, 'onSubmit'> {
  onCompleted?: (
    data: LinkGoogleAccountMutation,
    helpers: FormikHelpers<LinkGoogleAccountInput>,
  ) => void;
}

export const useLinkGoogleAccountForm = (props: UseLinkGoogleAccountProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useLinkGoogleAccountMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<LinkGoogleAccountInput>({
    initialStatus: {},
    validationSchema: linkGoogleAccountInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.linkGoogleAccount &&
          result.data.linkGoogleAccount.userError
        ) {
          if (result.data.linkGoogleAccount.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.linkGoogleAccount.userError),
            );
          } else {
            setStatus(result.data.linkGoogleAccount.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseDisconnectGoogleProps
  extends Omit<FormikConfig<DisconnectGoogleInput>, 'onSubmit'> {
  onCompleted?: (
    data: DisconnectGoogleMutation,
    helpers: FormikHelpers<DisconnectGoogleInput>,
  ) => void;
}

export const useDisconnectGoogleForm = (props: UseDisconnectGoogleProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useDisconnectGoogleMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<DisconnectGoogleInput>({
    initialStatus: {},
    validationSchema: disconnectGoogleInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.disconnectGoogle &&
          result.data.disconnectGoogle.userError
        ) {
          if (result.data.disconnectGoogle.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.disconnectGoogle.userError),
            );
          } else {
            setStatus(result.data.disconnectGoogle.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseDeactivateUserProps
  extends Omit<FormikConfig<DeactivateUserInput>, 'onSubmit'> {
  onCompleted?: (
    data: DeactivateUserMutation,
    helpers: FormikHelpers<DeactivateUserInput>,
  ) => void;
}

export const useDeactivateUserForm = (props: UseDeactivateUserProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useDeactivateUserMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<DeactivateUserInput>({
    initialStatus: {},
    validationSchema: deactivateUserInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.deactivateUser &&
          result.data.deactivateUser.userError
        ) {
          if (result.data.deactivateUser.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.deactivateUser.userError),
            );
          } else {
            setStatus(result.data.deactivateUser.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseCreateEmployeeProps
  extends Omit<FormikConfig<CreateEmployeeInput>, 'onSubmit'> {
  onCompleted?: (
    data: CreateEmployeeMutation,
    helpers: FormikHelpers<CreateEmployeeInput>,
  ) => void;
}

export const useCreateEmployeeForm = (props: UseCreateEmployeeProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useCreateEmployeeMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<CreateEmployeeInput>({
    initialStatus: {},
    validationSchema: createEmployeeInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.createEmployee &&
          result.data.createEmployee.userError
        ) {
          if (result.data.createEmployee.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.createEmployee.userError),
            );
          } else {
            setStatus(result.data.createEmployee.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUpdateEmployeeProps
  extends Omit<FormikConfig<UpdateEmployeeInput>, 'onSubmit'> {
  onCompleted?: (
    data: UpdateEmployeeMutation,
    helpers: FormikHelpers<UpdateEmployeeInput>,
  ) => void;
}

export const useUpdateEmployeeForm = (props: UseUpdateEmployeeProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUpdateEmployeeMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UpdateEmployeeInput>({
    initialStatus: {},
    validationSchema: updateEmployeeInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.updateEmployee &&
          result.data.updateEmployee.userError
        ) {
          if (result.data.updateEmployee.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.updateEmployee.userError),
            );
          } else {
            setStatus(result.data.updateEmployee.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUpdateEmployeeRoleProps
  extends Omit<FormikConfig<UpdateEmployeeRoleInput>, 'onSubmit'> {
  onCompleted?: (
    data: UpdateEmployeeRoleMutation,
    helpers: FormikHelpers<UpdateEmployeeRoleInput>,
  ) => void;
}

export const useUpdateEmployeeRoleForm = (
  props: UseUpdateEmployeeRoleProps,
) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUpdateEmployeeRoleMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UpdateEmployeeRoleInput>({
    initialStatus: {},
    validationSchema: updateEmployeeRoleInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.updateEmployeeRole &&
          result.data.updateEmployeeRole.userError
        ) {
          if (result.data.updateEmployeeRole.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.updateEmployeeRole.userError),
            );
          } else {
            setStatus(result.data.updateEmployeeRole.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUpdateEmployeeRolePermissionsProps
  extends Omit<FormikConfig<UpdateEmployeeRolePermissionsInput>, 'onSubmit'> {
  onCompleted?: (
    data: UpdateEmployeeRolePermissionsMutation,
    helpers: FormikHelpers<UpdateEmployeeRolePermissionsInput>,
  ) => void;
}

export const useUpdateEmployeeRolePermissionsForm = (
  props: UseUpdateEmployeeRolePermissionsProps,
) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUpdateEmployeeRolePermissionsMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UpdateEmployeeRolePermissionsInput>({
    initialStatus: {},
    validationSchema: updateEmployeeRolePermissionsInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.updateEmployeeRolePermissions &&
          result.data.updateEmployeeRolePermissions.userError
        ) {
          if (
            result.data.updateEmployeeRolePermissions.userError.errors.length >
            0
          ) {
            setErrors(
              transformToErrorObject(
                result.data.updateEmployeeRolePermissions.userError,
              ),
            );
          } else {
            setStatus(result.data.updateEmployeeRolePermissions.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseDeleteEmployeeProps
  extends Omit<FormikConfig<DeleteEmployeeInput>, 'onSubmit'> {
  onCompleted?: (
    data: DeleteEmployeeMutation,
    helpers: FormikHelpers<DeleteEmployeeInput>,
  ) => void;
}

export const useDeleteEmployeeForm = (props: UseDeleteEmployeeProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useDeleteEmployeeMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<DeleteEmployeeInput>({
    initialStatus: {},
    validationSchema: deleteEmployeeInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.deleteEmployee &&
          result.data.deleteEmployee.userError
        ) {
          if (result.data.deleteEmployee.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.deleteEmployee.userError),
            );
          } else {
            setStatus(result.data.deleteEmployee.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUpdateClientProps
  extends Omit<FormikConfig<UpdateClientInput>, 'onSubmit'> {
  onCompleted?: (
    data: UpdateClientMutation,
    helpers: FormikHelpers<UpdateClientInput>,
  ) => void;
}

export const useUpdateClientForm = (props: UseUpdateClientProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUpdateClientMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UpdateClientInput>({
    initialStatus: {},
    validationSchema: updateClientInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (result.data.updateClient && result.data.updateClient.userError) {
          if (result.data.updateClient.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.updateClient.userError),
            );
          } else {
            setStatus(result.data.updateClient.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseCreateClientProps
  extends Omit<FormikConfig<CreateClientInput>, 'onSubmit'> {
  onCompleted?: (
    data: CreateClientMutation,
    helpers: FormikHelpers<CreateClientInput>,
  ) => void;
}

export const useCreateClientForm = (props: UseCreateClientProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useCreateClientMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<CreateClientInput>({
    initialStatus: {},
    validationSchema: createClientInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (result.data.createClient && result.data.createClient.userError) {
          if (result.data.createClient.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.createClient.userError),
            );
          } else {
            setStatus(result.data.createClient.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseInviteEmployeeProps
  extends Omit<FormikConfig<InviteEmployeeInput>, 'onSubmit'> {
  onCompleted?: (
    data: InviteEmployeeMutation,
    helpers: FormikHelpers<InviteEmployeeInput>,
  ) => void;
}

export const useInviteEmployeeForm = (props: UseInviteEmployeeProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useInviteEmployeeMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<InviteEmployeeInput>({
    initialStatus: {},
    validationSchema: inviteEmployeeInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.inviteEmployee &&
          result.data.inviteEmployee.userError
        ) {
          if (result.data.inviteEmployee.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.inviteEmployee.userError),
            );
          } else {
            setStatus(result.data.inviteEmployee.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseAcceptEmployeeInvitationProps
  extends Omit<FormikConfig<AcceptEmployeeInvitationInput>, 'onSubmit'> {
  onCompleted?: (
    data: AcceptEmployeeInvitationMutation,
    helpers: FormikHelpers<AcceptEmployeeInvitationInput>,
  ) => void;
}

export const useAcceptEmployeeInvitationForm = (
  props: UseAcceptEmployeeInvitationProps,
) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useAcceptEmployeeInvitationMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<AcceptEmployeeInvitationInput>({
    initialStatus: {},
    validationSchema: acceptEmployeeInvitationInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.acceptEmployeeInvitation &&
          result.data.acceptEmployeeInvitation.userError
        ) {
          if (
            result.data.acceptEmployeeInvitation.userError.errors.length > 0
          ) {
            setErrors(
              transformToErrorObject(
                result.data.acceptEmployeeInvitation.userError,
              ),
            );
          } else {
            setStatus(result.data.acceptEmployeeInvitation.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseDeclineEmployeeInvitationProps
  extends Omit<FormikConfig<DeclineEmployeeInvitationInput>, 'onSubmit'> {
  onCompleted?: (
    data: DeclineEmployeeInvitationMutation,
    helpers: FormikHelpers<DeclineEmployeeInvitationInput>,
  ) => void;
}

export const useDeclineEmployeeInvitationForm = (
  props: UseDeclineEmployeeInvitationProps,
) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useDeclineEmployeeInvitationMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<DeclineEmployeeInvitationInput>({
    initialStatus: {},
    validationSchema: declineEmployeeInvitationInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.declineEmployeeInvitation &&
          result.data.declineEmployeeInvitation.userError
        ) {
          if (
            result.data.declineEmployeeInvitation.userError.errors.length > 0
          ) {
            setErrors(
              transformToErrorObject(
                result.data.declineEmployeeInvitation.userError,
              ),
            );
          } else {
            setStatus(result.data.declineEmployeeInvitation.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseCancelEmployeeInvitationProps
  extends Omit<FormikConfig<CancelEmployeeInvitationInput>, 'onSubmit'> {
  onCompleted?: (
    data: CancelEmployeeInvitationMutation,
    helpers: FormikHelpers<CancelEmployeeInvitationInput>,
  ) => void;
}

export const useCancelEmployeeInvitationForm = (
  props: UseCancelEmployeeInvitationProps,
) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useCancelEmployeeInvitationMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<CancelEmployeeInvitationInput>({
    initialStatus: {},
    validationSchema: cancelEmployeeInvitationInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.cancelEmployeeInvitation &&
          result.data.cancelEmployeeInvitation.userError
        ) {
          if (
            result.data.cancelEmployeeInvitation.userError.errors.length > 0
          ) {
            setErrors(
              transformToErrorObject(
                result.data.cancelEmployeeInvitation.userError,
              ),
            );
          } else {
            setStatus(result.data.cancelEmployeeInvitation.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUnlinkEmployeeProps
  extends Omit<FormikConfig<UnlinkEmployeeInput>, 'onSubmit'> {
  onCompleted?: (
    data: UnlinkEmployeeMutation,
    helpers: FormikHelpers<UnlinkEmployeeInput>,
  ) => void;
}

export const useUnlinkEmployeeForm = (props: UseUnlinkEmployeeProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUnlinkEmployeeMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UnlinkEmployeeInput>({
    initialStatus: {},
    validationSchema: unlinkEmployeeInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (
          result.data.unlinkEmployee &&
          result.data.unlinkEmployee.userError
        ) {
          if (result.data.unlinkEmployee.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.unlinkEmployee.userError),
            );
          } else {
            setStatus(result.data.unlinkEmployee.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseCreateShiftProps
  extends Omit<FormikConfig<CreateShiftInput>, 'onSubmit'> {
  onCompleted?: (
    data: CreateShiftMutation,
    helpers: FormikHelpers<CreateShiftInput>,
  ) => void;
}

export const useCreateShiftForm = (props: UseCreateShiftProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useCreateShiftMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<CreateShiftInput>({
    initialStatus: {},
    validationSchema: createShiftInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (result.data.createShift && result.data.createShift.userError) {
          if (result.data.createShift.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.createShift.userError),
            );
          } else {
            setStatus(result.data.createShift.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseUpdateShiftProps
  extends Omit<FormikConfig<UpdateShiftInput>, 'onSubmit'> {
  onCompleted?: (
    data: UpdateShiftMutation,
    helpers: FormikHelpers<UpdateShiftInput>,
  ) => void;
}

export const useUpdateShiftForm = (props: UseUpdateShiftProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useUpdateShiftMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<UpdateShiftInput>({
    initialStatus: {},
    validationSchema: updateShiftInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (result.data.updateShift && result.data.updateShift.userError) {
          if (result.data.updateShift.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.updateShift.userError),
            );
          } else {
            setStatus(result.data.updateShift.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface UseCancelShiftProps
  extends Omit<FormikConfig<CancelShiftInput>, 'onSubmit'> {
  onCompleted?: (
    data: CancelShiftMutation,
    helpers: FormikHelpers<CancelShiftInput>,
  ) => void;
}

export const useCancelShiftForm = (props: UseCancelShiftProps) => {
  const { onCompleted = () => {}, ...formikConfig } = props;
  const { danger } = useToast();

  const [mutate] = useCancelShiftMutation({
    onError: err => {
      danger({ description: err.message.replace('GraphQL error: ', '') });
    },
  });

  return useFormik<CancelShiftInput>({
    initialStatus: {},
    validationSchema: cancelShiftInputValidationSchema,
    onSubmit: async (input, helpers) => {
      const { setErrors, setSubmitting, setStatus } = helpers;
      const result = await mutate({ variables: { input } });

      setSubmitting(false);

      if (result && result.data) {
        if (result.data.cancelShift && result.data.cancelShift.userError) {
          if (result.data.cancelShift.userError.errors.length > 0) {
            setErrors(
              transformToErrorObject(result.data.cancelShift.userError),
            );
          } else {
            setStatus(result.data.cancelShift.userError);
          }
        } else {
          onCompleted(result.data, helpers);
        }
      }
    },
    ...formikConfig,
  });
};

export interface CurrentUserQueryProps
  extends ApolloReactHooks.QueryHookOptions<
    CurrentUserQuery,
    CurrentUserQueryVariables
  > {
  children: (
    props: CurrentUserQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const CurrentUserQuery = (props: CurrentUserQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useCurrentUserQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in CurrentUserQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface CurrentBusinessQueryProps
  extends ApolloReactHooks.QueryHookOptions<
    CurrentBusinessQuery,
    CurrentBusinessQueryVariables
  > {
  children: (
    props: CurrentBusinessQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const CurrentBusinessQuery = (props: CurrentBusinessQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useCurrentBusinessQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in CurrentBusinessQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface EmployeesQueryProps
  extends ApolloReactHooks.QueryHookOptions<
    EmployeesQuery,
    EmployeesQueryVariables
  > {
  children: (
    props: EmployeesQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const EmployeesQuery = (props: EmployeesQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useEmployeesQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in EmployeesQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface EmployeesShiftsQueryProps
  extends ApolloReactHooks.QueryHookOptions<
    EmployeesShiftsQuery,
    EmployeesShiftsQueryVariables
  > {
  children: (
    props: EmployeesShiftsQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const EmployeesShiftsQuery = (props: EmployeesShiftsQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useEmployeesShiftsQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in EmployeesShiftsQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface ShiftsQueryProps
  extends ApolloReactHooks.QueryHookOptions<ShiftsQuery, ShiftsQueryVariables> {
  children: (
    props: ShiftsQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const ShiftsQuery = (props: ShiftsQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useShiftsQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in ShiftsQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface EmployeesAndShiftsQueryProps
  extends ApolloReactHooks.QueryHookOptions<
    EmployeesAndShiftsQuery,
    EmployeesAndShiftsQueryVariables
  > {
  children: (
    props: EmployeesAndShiftsQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const EmployeesAndShiftsQuery = (
  props: EmployeesAndShiftsQueryProps,
) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useEmployeesAndShiftsQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in EmployeesAndShiftsQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface EmployeeQueryProps
  extends ApolloReactHooks.QueryHookOptions<
    EmployeeQuery,
    EmployeeQueryVariables
  > {
  children: (
    props: EmployeeQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const EmployeeQuery = (props: EmployeeQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useEmployeeQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in EmployeeQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface EmployeeShiftsQueryProps
  extends ApolloReactHooks.QueryHookOptions<
    EmployeeShiftsQuery,
    EmployeeShiftsQueryVariables
  > {
  children: (
    props: EmployeeShiftsQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const EmployeeShiftsQuery = (props: EmployeeShiftsQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useEmployeeShiftsQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in EmployeeShiftsQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface CurrentUserInvitationsQueryProps
  extends ApolloReactHooks.QueryHookOptions<
    CurrentUserInvitationsQuery,
    CurrentUserInvitationsQueryVariables
  > {
  children: (
    props: CurrentUserInvitationsQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const CurrentUserInvitationsQuery = (
  props: CurrentUserInvitationsQueryProps,
) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useCurrentUserInvitationsQuery(
    options,
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in CurrentUserInvitationsQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface EmployeeRolesQueryProps
  extends ApolloReactHooks.QueryHookOptions<
    EmployeeRolesQuery,
    EmployeeRolesQueryVariables
  > {
  children: (
    props: EmployeeRolesQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const EmployeeRolesQuery = (props: EmployeeRolesQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useEmployeeRolesQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in EmployeeRolesQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface LocationsQueryProps
  extends ApolloReactHooks.QueryHookOptions<
    LocationsQuery,
    LocationsQueryVariables
  > {
  children: (
    props: LocationsQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const LocationsQuery = (props: LocationsQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useLocationsQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in LocationsQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface ImageQueryProps
  extends ApolloReactHooks.QueryHookOptions<ImageQuery, ImageQueryVariables> {
  children: (
    props: ImageQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const ImageQuery = (props: ImageQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useImageQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in ImageQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface LocationQueryProps
  extends ApolloReactHooks.QueryHookOptions<
    LocationQuery,
    LocationQueryVariables
  > {
  children: (
    props: LocationQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const LocationQuery = (props: LocationQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useLocationQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in LocationQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface ClientsQueryProps
  extends ApolloReactHooks.QueryHookOptions<
    ClientsQuery,
    ClientsQueryVariables
  > {
  children: (
    props: ClientsQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const ClientsQuery = (props: ClientsQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useClientsQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in ClientsQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};

export interface ShiftQueryProps
  extends ApolloReactHooks.QueryHookOptions<ShiftQuery, ShiftQueryVariables> {
  children: (
    props: ShiftQuery & { refetch: () => Promise<void> },
  ) => JSX.Element;
}
export const ShiftQuery = (props: ShiftQueryProps) => {
  const { children, ...options } = props;
  const { data, loading, error, refetch } = useShiftQuery(options);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data) {
    throw new Error('Expected data in ShiftQuery');
  }

  return children({
    ...data,
    refetch: async () => {
      await refetch(options.variables);
    },
  });
};
