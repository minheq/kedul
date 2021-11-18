import { subscribe } from '@kedul/common-server';
import { Location, Event } from '@kedul/service-location';

import { createEmployeeRoles } from './EmployeeRoleMutations';

subscribe<Location>(Event.LOCATION_CREATED, async props => {
  const { data, context } = props;

  await createEmployeeRoles(data, context);
});
