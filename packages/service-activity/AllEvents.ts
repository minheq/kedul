import { subscribe } from '@kedul/common-server';

import { createActivity } from './ActivityMutations';
import { enhance } from './RequestContext';

subscribe('*', event => {
  const activityServiceRequestContext = enhance(event.context);

  createActivity(event, activityServiceRequestContext);
});
