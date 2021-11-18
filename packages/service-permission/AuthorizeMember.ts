import { extractUserId, RequestContext } from '@kedul/common-server';
import { isEmpty } from 'lodash';

import { checkPolicies } from './checkPolicies';
import { findPoliciesByUserId } from './PolicyQueries';
import { PolicyResource } from './PolicyTypes';
import { unauthorized } from './unauthorized';

// TODO: Check that the business member has accepted invitation

export const authorizeMember = async (
  action: string,
  resource: PolicyResource,
  context: RequestContext,
) => {
  const policies = await findPoliciesByUserId(
    { userId: extractUserId(context) },
    context,
  );

  const errors = checkPolicies(policies, action, resource);

  if (!isEmpty(errors)) {
    unauthorized();
  }
};
