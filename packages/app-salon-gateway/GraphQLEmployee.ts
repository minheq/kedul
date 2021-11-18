import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { RequestContext } from '@kedul/common-server';
import {
  findEmployeeById,
  findEmployees,
  findShifts,
  QueryFindEmployeeByIdArgs,
  QueryFindEmployeesArgs,
  createEmployee,
  CreateEmployeeInput,
  unlinkEmployee,
  declineEmployeeInvitation,
  DeclineEmployeeInvitationInput,
  UnlinkEmployeeInput,
  cancelEmployeeInvitation,
  CancelEmployeeInvitationInput,
  AcceptEmployeeInvitationInput,
  acceptEmployeeInvitation,
  inviteEmployee,
  InviteEmployeeInput,
  deleteEmployee,
  DeleteEmployeeInput,
  updateEmployee,
  UpdateEmployeeInput,
  Employee,
  QueryFindShiftsArgs,
  findEmployeeRoles,
  QueryFindEmployeeRolesArgs,
  findEmployeeRoleById,
  EmployeeRole,
  UpdateEmployeeRoleInput,
  updateEmployeeRole,
  getEmployeeRolePermissions,
  UpdateEmployeeRolePermissionsInput,
  updateEmployeeRolePermissions,
} from '@kedul/service-employee';
import { findLocationById } from '@kedul/service-location';
import { findUserById } from '@kedul/service-user';

import { GraphQLUser } from './GraphQLUser';
import {
  GraphQLDate,
  GraphQLContactDetailsInput,
  GraphQLUserProfileInput,
  GraphQLUserError,
  GraphQLUserProfile,
  GraphQLContactDetails,
} from './GraphQLCommon';
import { GraphQLLocation } from './GraphQLLocation';
import { GraphQLShift, GraphQLShiftsFilter } from './GraphQLShift';
import { makeQuery, makeMutation } from './GraphQLUtils';

const GraphQLSalary: GraphQLObjectType = new GraphQLObjectType({
  name: 'Salary',
  fields: () => ({
    commissions: { type: new GraphQLNonNull(GraphQLFloat) },
    hourly: { type: new GraphQLNonNull(GraphQLFloat) },
    tips: { type: new GraphQLNonNull(GraphQLFloat) },
    total: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const GraphQLEmployeeSalarySettings: GraphQLObjectType = new GraphQLObjectType({
  name: 'EmployeeSalarySettings',
  fields: () => ({
    wage: { type: GraphQLFloat },
    productCommission: { type: GraphQLFloat },
    serviceCommission: { type: GraphQLFloat },
    voucherCommission: { type: GraphQLFloat },
  }),
});

const GraphQLEmployeeShiftSettings: GraphQLObjectType = new GraphQLObjectType({
  name: 'EmployeeShiftSettings',
  fields: () => ({
    appointmentColor: { type: GraphQLString },
    canHaveAppointments: { type: GraphQLBoolean },
  }),
});

const GraphQLEmployeeEmployment: GraphQLObjectType = new GraphQLObjectType({
  name: 'EmployeeEmployment',
  fields: () => ({
    title: { type: GraphQLString },
    employmentEndDate: { type: GraphQLDate },
    employmentStartDate: { type: GraphQLDate },
  }),
});

export const GraphQLEmployeeRole = new GraphQLObjectType({
  name: 'EmployeeRole',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLLocation) },
    permissions: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString)),
      ),
      resolve: async (root: EmployeeRole, args, context) =>
        getEmployeeRolePermissions(root, context),
    },
  }),
});

export const GraphQLEmployee: GraphQLObjectType<
  Employee,
  RequestContext,
  any
> = new GraphQLObjectType({
  name: 'Employee',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    employeeRole: {
      type: GraphQLEmployeeRole,
      resolve: async (root, args, context) =>
        root.employeeRoleId
          ? findEmployeeRoleById({ id: root.employeeRoleId }, context)
          : null,
    },
    notes: { type: GraphQLString },
    acceptedInvitationAt: { type: GraphQLDate },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    deletedAt: { type: GraphQLDate },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
    contactDetails: { type: GraphQLContactDetails },
    profile: { type: new GraphQLNonNull(GraphQLUserProfile) },
    salarySettings: { type: GraphQLEmployeeSalarySettings },
    shiftSettings: { type: GraphQLEmployeeShiftSettings },
    employment: { type: GraphQLEmployeeEmployment },
    serviceIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))),
    },
    location: {
      type: new GraphQLNonNull(GraphQLLocation),
      resolve: async (root, args, context) => {
        const location = await findLocationById(
          { id: root.locationId },
          context,
        );

        if (!location) throw new Error('Could not find location');

        return location;
      },
    },
    user: {
      type: GraphQLUser,
      resolve: (root, args, context) =>
        root.userId ? findUserById({ id: root.userId }, context) : null,
    },
    invitation: { type: GraphQLEmployeeInvitation },
    shifts: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLShift)),
      ),
      args: {
        filter: { type: GraphQLShiftsFilter },
      },
      resolve: (root, args: QueryFindShiftsArgs, context) =>
        findShifts(
          {
            filter: {
              ...args.filter,
              employeeId: root.id,
            },
          },
          context,
        ),
    },
  }),
});

const GraphQLEmployeeSalarySettingsInput = new GraphQLInputObjectType({
  name: 'EmployeeSalarySettingsInput',
  fields: () => ({
    wage: { type: GraphQLFloat },
    productCommission: { type: GraphQLFloat },
    serviceCommission: { type: GraphQLFloat },
    voucherCommission: { type: GraphQLFloat },
  }),
});

const GraphQLEmployeeShiftSettingsInput = new GraphQLInputObjectType({
  name: 'EmployeeShiftSettingsInput',
  fields: () => ({
    appointmentColor: { type: GraphQLString },
    canHaveAppointments: { type: GraphQLBoolean },
  }),
});

const GraphQLEmployeeEmploymentInput = new GraphQLInputObjectType({
  name: 'EmployeeEmploymentInput',
  fields: () => ({
    title: { type: GraphQLString },
    employmentEndDate: { type: GraphQLDate },
    employmentStartDate: { type: GraphQLDate },
  }),
});

export const GraphQLEmployeeInvitation: GraphQLObjectType = new GraphQLObjectType(
  {
    name: 'EmployeeInvitation',
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLID) },
      employee: {
        type: new GraphQLNonNull(GraphQLEmployee),
        resolve: async (root, args, context) => {
          const employee = await findEmployeeById(
            { id: root.employeeId },
            context,
          );

          if (!employee) throw new Error('Could not find employee');

          return employee;
        },
      },
      invitedByUser: { type: new GraphQLNonNull(GraphQLUser) },
      phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
      countryCode: { type: new GraphQLNonNull(GraphQLString) },
      expirationDate: { type: new GraphQLNonNull(GraphQLDate) },
      token: { type: new GraphQLNonNull(GraphQLString) },
      createdAt: { type: new GraphQLNonNull(GraphQLDate) },
      updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
    }),
  },
);

export const CreateEmployeeMutation = makeMutation({
  name: 'CreateEmployee',
  inputFields: {
    notes: { type: GraphQLString },
    locationId: { type: new GraphQLNonNull(GraphQLID) },
    contactDetails: { type: GraphQLContactDetailsInput },
    profile: { type: new GraphQLNonNull(GraphQLUserProfileInput) },
    serviceIds: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
    },
    salarySettings: { type: GraphQLEmployeeSalarySettingsInput },
    shiftSettings: { type: GraphQLEmployeeShiftSettingsInput },
    employment: { type: GraphQLEmployeeEmploymentInput },
  },
  outputFields: {
    employee: { type: GraphQLEmployee },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: CreateEmployeeInput, context: RequestContext) =>
    createEmployee(input, context),
});

export const UpdateEmployeeMutation = makeMutation({
  name: 'UpdateEmployee',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    notes: { type: GraphQLString },
    contactDetails: { type: GraphQLContactDetailsInput },
    profile: { type: GraphQLUserProfileInput },
    serviceIds: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
    },
    salarySettings: { type: GraphQLEmployeeSalarySettingsInput },
    shiftSettings: { type: GraphQLEmployeeShiftSettingsInput },
    employment: { type: GraphQLEmployeeEmploymentInput },
  },
  outputFields: {
    employee: { type: GraphQLEmployee },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: UpdateEmployeeInput, context: RequestContext) =>
    updateEmployee(input, context),
});

export const UpdateEmployeeRoleMutation = makeMutation({
  name: 'UpdateEmployeeRole',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    employeeRoleId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    employee: { type: GraphQLEmployee },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: UpdateEmployeeRoleInput,
    context: RequestContext,
  ) => updateEmployeeRole(input, context),
});

export const UpdateEmployeeRolePermissionsMutation = makeMutation({
  name: 'UpdateEmployeeRolePermissions',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    permissions: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString)),
      ),
    },
  },
  outputFields: {
    employeeRole: { type: GraphQLEmployeeRole },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: UpdateEmployeeRolePermissionsInput,
    context: RequestContext,
  ) => updateEmployeeRolePermissions(input, context),
});

export const DeleteEmployeeMutation = makeMutation({
  name: 'DeleteEmployee',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    employee: { type: GraphQLEmployee },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: DeleteEmployeeInput, context: RequestContext) =>
    deleteEmployee(input, context),
});

export const InviteEmployeeMutation = makeMutation({
  name: 'InviteEmployee',
  inputFields: {
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    countryCode: { type: new GraphQLNonNull(GraphQLString) },
    employeeRoleId: { type: new GraphQLNonNull(GraphQLID) },
    employeeId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    employee: { type: GraphQLEmployee },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: InviteEmployeeInput, context: RequestContext) =>
    inviteEmployee(input, context),
});

export const AcceptEmployeeInvitationMutation = makeMutation({
  name: 'AcceptEmployeeInvitation',
  inputFields: {
    invitationToken: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    employee: { type: GraphQLEmployee },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: AcceptEmployeeInvitationInput,
    context: RequestContext,
  ) => acceptEmployeeInvitation(input, context),
});

export const CancelEmployeeInvitationMutation = makeMutation({
  name: 'CancelEmployeeInvitation',
  inputFields: {
    employeeId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    employee: { type: GraphQLEmployee },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: CancelEmployeeInvitationInput,
    context: RequestContext,
  ) => cancelEmployeeInvitation(input, context),
});

export const UnlinkEmployeeMutation = makeMutation({
  name: 'UnlinkEmployee',
  inputFields: {
    employeeId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    employee: { type: GraphQLEmployee },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: UnlinkEmployeeInput, context: RequestContext) =>
    unlinkEmployee(input, context),
});

export const DeclineEmployeeInvitationMutation = makeMutation({
  name: 'DeclineEmployeeInvitation',
  inputFields: {
    employeeId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    employee: { type: GraphQLEmployee },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (
    input: DeclineEmployeeInvitationInput,
    context: RequestContext,
  ) => declineEmployeeInvitation(input, context),
});

export const EmployeeQuery = makeQuery({
  type: GraphQLEmployee,
  args: {
    id: { type: GraphQLID },
  },
  resolve: (
    root: {},
    args: QueryFindEmployeeByIdArgs,
    context: RequestContext,
  ) => findEmployeeById(args, context),
});

export const EmployeeRolesQuery = makeQuery({
  type: new GraphQLNonNull(
    new GraphQLList(new GraphQLNonNull(GraphQLEmployeeRole)),
  ),
  args: {
    locationId: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: (
    root: {},
    args: QueryFindEmployeeRolesArgs,
    context: RequestContext,
  ) => findEmployeeRoles(args, context),
});

export const EmployeesQuery = makeQuery({
  type: new GraphQLNonNull(
    new GraphQLList(new GraphQLNonNull(GraphQLEmployee)),
  ),
  args: {
    locationId: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: (root: {}, args: QueryFindEmployeesArgs, context: RequestContext) =>
    findEmployees(args, context),
});
