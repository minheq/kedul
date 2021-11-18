import {
  parseJsonColumn,
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';
import Knex from 'knex';

import {
  EmployeeDbObject,
  EmployeeInvitationDbObject,
  Table,
} from './Database';
import { Employee, EmployeeInvitation } from './EmployeeTypes';

interface JoinedEmployeeAndEmployeeInvitationDbObject
  extends EmployeeDbObject,
    EmployeeInvitationDbObject {
  [`EMPLOYEE_INVITATION:id`]: string;
  [`EMPLOYEE_INVITATION:employeeId`]: string;
  [`EMPLOYEE_INVITATION:invitedByUserId`]: string;
  [`EMPLOYEE_INVITATION:phoneNumber`]: string;
  [`EMPLOYEE_INVITATION:countryCode`]: string;
  [`EMPLOYEE_INVITATION:expirationDate`]: Date;
  [`EMPLOYEE_INVITATION:token`]: string;
  [`EMPLOYEE_INVITATION:businessId`]: string;
  [`EMPLOYEE_INVITATION:createdAt`]: Date;
  [`EMPLOYEE_INVITATION:updatedAt`]: Date;
}

interface EmployeeDbObjects {
  employeeDbObject: EmployeeDbObject;
  employeeInvitationDbObject?: EmployeeInvitationDbObject | null;
}

export interface EmployeeRepository {
  findById: (id: string) => Promise<Employee | null>;
  getById: (id: string) => Promise<Employee>;
  save: (entity: Employee) => Promise<void>;
  update: (entity: Employee) => Promise<void>;
  remove: (entity: Employee) => Promise<void>;
  findManyByUserId(userId: string): Promise<Employee[]>;
  findManyByIds(ids: string[]): Promise<(Employee | null)[]>;
  findByToken(invitationToken: string): Promise<Employee | null>;
  findByUserIdAndLocationId(
    userId: string,
    locationId: string,
  ): Promise<Employee | null>;
  findEmployeeInvitationsByPhoneNumber(
    phoneNumber: string,
    countryCode: string,
  ): Promise<EmployeeInvitation[]>;
  findManyByLocationId(locationId: string): Promise<Employee[]>;
}

const extractEmployeeDbObject = (
  data: JoinedEmployeeAndEmployeeInvitationDbObject,
): Employee => {
  return {
    id: data.id,
    employeeRoleId: data.employeeRoleId,
    locationId: data.locationId,
    businessId: data.businessId,
    userId: data.userId,
    notes: data.notes,
    acceptedInvitationAt: data.acceptedInvitationAt,
    createdAt: data.createdAt,
    deletedAt: data.deletedAt,
    updatedAt: data.updatedAt,

    contactDetails: data.contactDetails
      ? parseJsonColumn(data.contactDetails)
      : null,
    profile: parseJsonColumn(data.profile),
    shiftSettings: data.shiftSettings
      ? parseJsonColumn(data.shiftSettings)
      : null,
    salarySettings: data.salarySettings
      ? parseJsonColumn(data.salarySettings)
      : null,
    employment: data.employment ? parseJsonColumn(data.employment) : null,
    serviceIds: parseJsonColumn(data.serviceIds),
  };
};

const extractEmployeeInvitationDbObject = (
  data: JoinedEmployeeAndEmployeeInvitationDbObject,
) => {
  if (
    !data['EMPLOYEE_INVITATION:id'] ||
    !data['EMPLOYEE_INVITATION:invitedByUserId']
  ) {
    return null;
  }

  return {
    id: data['EMPLOYEE_INVITATION:id'],
    createdAt: data['EMPLOYEE_INVITATION:createdAt'],
    updatedAt: data['EMPLOYEE_INVITATION:updatedAt'],
    countryCode: data['EMPLOYEE_INVITATION:countryCode'],
    invitedByUserId: data['EMPLOYEE_INVITATION:invitedByUserId'],
    phoneNumber: data['EMPLOYEE_INVITATION:phoneNumber'],
    token: data['EMPLOYEE_INVITATION:token'],
    employeeId: data['EMPLOYEE_INVITATION:employeeId'],
    businessId: data['EMPLOYEE_INVITATION:businessId'],
    expirationDate: data['EMPLOYEE_INVITATION:expirationDate'],
  };
};

const toEntity = (
  data: JoinedEmployeeAndEmployeeInvitationDbObject,
): Employee => {
  return {
    ...extractEmployeeDbObject(data),
    invitation: extractEmployeeInvitationDbObject(data),
  };
};

const fromEmployee = (employee: Employee): EmployeeDbObject => {
  return {
    locationId: employee.locationId,
    businessId: employee.businessId,
    id: employee.id,
    employeeRoleId: employee.employeeRoleId || null,

    contactDetails: employee.contactDetails
      ? JSON.stringify(employee.contactDetails)
      : null,
    userId: employee.userId || null,

    notes: employee.notes || null,

    acceptedInvitationAt: employee.acceptedInvitationAt || null,
    createdAt: employee.createdAt,
    deletedAt: employee.deletedAt || null,
    updatedAt: employee.updatedAt,

    shiftSettings: employee.shiftSettings
      ? JSON.stringify(employee.shiftSettings)
      : null,
    salarySettings: employee.salarySettings
      ? JSON.stringify(employee.salarySettings)
      : null,
    employment: employee.employment
      ? JSON.stringify(employee.employment)
      : null,
    serviceIds: JSON.stringify(employee.serviceIds),
    profile: JSON.stringify(employee.profile),
  };
};

const fromEntity = (context: RequestContext) => (
  employee: Employee,
): EmployeeDbObjects => {
  return {
    employeeDbObject: fromEmployee(employee),
    employeeInvitationDbObject: employee.invitation,
  };
};

const employeeQuery = (knex: Knex) => {
  return knex
    .select([
      `${Table.EMPLOYEE}.*`,
      `${Table.EMPLOYEE_INVITATION}.id as ${Table.EMPLOYEE_INVITATION}:id`,
      `${Table.EMPLOYEE_INVITATION}.employeeId as ${
        Table.EMPLOYEE_INVITATION
      }:employeeId`,
      `${Table.EMPLOYEE_INVITATION}.invitedByUserId as ${
        Table.EMPLOYEE_INVITATION
      }:invitedByUserId`,
      `${Table.EMPLOYEE_INVITATION}.phoneNumber as ${
        Table.EMPLOYEE_INVITATION
      }:phoneNumber`,
      `${Table.EMPLOYEE_INVITATION}.countryCode as ${
        Table.EMPLOYEE_INVITATION
      }:countryCode`,
      `${Table.EMPLOYEE_INVITATION}.expirationDate as ${
        Table.EMPLOYEE_INVITATION
      }:expirationDate`,
      `${Table.EMPLOYEE_INVITATION}.token as ${
        Table.EMPLOYEE_INVITATION
      }:token`,
      `${Table.EMPLOYEE_INVITATION}.createdAt as ${
        Table.EMPLOYEE_INVITATION
      }:createdAt`,
      `${Table.EMPLOYEE_INVITATION}.updatedAt as ${
        Table.EMPLOYEE_INVITATION
      }:updatedAt`,
      `${Table.EMPLOYEE_INVITATION}.businessId as ${
        Table.EMPLOYEE_INVITATION
      }:businessId`,
    ])
    .leftJoin(
      Table.EMPLOYEE_INVITATION,
      `${Table.EMPLOYEE}.id`,
      `${Table.EMPLOYEE_INVITATION}.employeeId`,
    )
    .from(Table.EMPLOYEE);
};

const findById = (context: RequestContext) => async (id: string) => {
  const { knex } = context.dependencies;

  const data = (await employeeQuery(knex)
    .where(`${Table.EMPLOYEE}.id`, '=', id)
    .first()) as JoinedEmployeeAndEmployeeInvitationDbObject | null;

  return data ? toEntity(data) : null;
};

const findEmployeeInvitationsByPhoneNumber = (
  context: RequestContext,
) => async (phoneNumber: string, countryCode: string) => {
  const { knex } = context.dependencies;

  return (await knex
    .select()
    .from(Table.EMPLOYEE_INVITATION)
    .where({
      phoneNumber,
      countryCode,
    })) as EmployeeInvitationDbObject[];
};

const findByUserIdAndLocationId = (context: RequestContext) => async (
  userId: string,
  locationId: string,
) => {
  const { knex } = context.dependencies;

  const employee = (await employeeQuery(knex)
    .where({ userId, locationId })
    .first()) as JoinedEmployeeAndEmployeeInvitationDbObject | null;

  return employee ? toEntity(employee) : null;
};

const getById = (context: RequestContext) => async (id: string) => {
  const employee = await findById(context)(id);
  if (!employee) throw new Error(`${id} in ${Table.EMPLOYEE}`);

  return employee;
};

const findByToken = (context: RequestContext) => async (
  invitationToken: string,
) => {
  const { knex } = context.dependencies;

  const employee = (await employeeQuery(knex)
    .where({ token: invitationToken })
    .first()) as JoinedEmployeeAndEmployeeInvitationDbObject | null;

  return employee ? toEntity(employee) : null;
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const employees = (await employeeQuery(knex).whereIn(
    `${Table.EMPLOYEE}.id`,
    ids,
  )) as JoinedEmployeeAndEmployeeInvitationDbObject[];

  return upholdDataLoaderConstraints(employees.map(toEntity), ids);
};

const findManyByLocationId = (context: RequestContext) => async (
  locationId: string,
) => {
  const { knex } = context.dependencies;

  const employees = (await employeeQuery(knex).where({
    locationId,
  })) as JoinedEmployeeAndEmployeeInvitationDbObject[];

  return employees.map(toEntity);
};

const findManyByUserId = (context: RequestContext) => async (
  userId: string,
) => {
  const { knex } = context.dependencies;

  const employees = (await employeeQuery(knex).where({
    userId,
  })) as JoinedEmployeeAndEmployeeInvitationDbObject[];

  return employees.map(toEntity);
};

const save = (context: RequestContext) => async (employee: Employee) => {
  const { knex } = context.dependencies;

  const { employeeDbObject, employeeInvitationDbObject } = fromEntity(context)(
    employee,
  );

  await knex.insert(employeeDbObject).into(Table.EMPLOYEE);

  if (employeeInvitationDbObject) {
    await knex
      .insert(employeeInvitationDbObject)
      .into(Table.EMPLOYEE_INVITATION);
  }
};

const update = (context: RequestContext) => async (employee: Employee) => {
  const { knex } = context.dependencies;

  const { employeeDbObject, employeeInvitationDbObject } = fromEntity(context)(
    employee,
  );

  await knex(Table.EMPLOYEE)
    .update({
      ...employeeDbObject,
      updatedAt: new Date(),
    })
    .where({ id: employee.id });

  if (employeeInvitationDbObject) {
    const employeeInvitation = (await knex
      .select()
      .from(Table.EMPLOYEE_INVITATION)
      .where({ employeeId: employee.id })
      .first()) as EmployeeInvitationDbObject | null;

    if (employeeInvitation) {
      await knex(Table.EMPLOYEE_INVITATION)
        .update(employeeInvitationDbObject)
        .where({ employeeId: employee.id });
    } else {
      await knex
        .insert(employeeInvitationDbObject)
        .into(Table.EMPLOYEE_INVITATION);
    }
  } else {
    await knex(Table.EMPLOYEE_INVITATION)
      .del()
      .where({ employeeId: employee.id });
  }
};

const remove = (context: RequestContext) => async (employee: Employee) => {
  const { knex } = context.dependencies;

  await knex(Table.EMPLOYEE)
    .del()
    .where({ id: employee.id });

  await knex(Table.EMPLOYEE_INVITATION)
    .del()
    .where({ employeeId: employee.id });
};

export const makeEmployeeRepository = (
  context: RequestContext,
): EmployeeRepository => ({
  findById: findById(context),
  findEmployeeInvitationsByPhoneNumber: findEmployeeInvitationsByPhoneNumber(
    context,
  ),
  findByUserIdAndLocationId: findByUserIdAndLocationId(context),
  findManyByIds: findManyByIds(context),
  findManyByUserId: findManyByUserId(context),
  findByToken: findByToken(context),
  findManyByLocationId: findManyByLocationId(context),
  getById: getById(context),
  remove: remove(context),
  save: save(context),
  update: update(context),
});
