import {
  checkPolicies,
  Policy,
  PolicyResource,
} from '@kedul/service-permission';
import { isEmpty } from 'lodash';
import React from 'react';

import { useCurrentUser } from './CurrentUserProvider';

export interface PermissionsContext {
  check: (action: string, resource: PolicyResource) => boolean;
}

const defaultPermissionsContext: PermissionsContext = {
  check: () => false,
};

export const PermissionsContext = React.createContext(
  defaultPermissionsContext,
);

export const usePermissions = () => {
  return React.useContext(PermissionsContext);
};

export interface PermissionsProviderProps {
  children: React.ReactNode;
}

export const PermissionsProvider = (props: PermissionsProviderProps) => {
  const { children } = props;
  const { currentUser } = useCurrentUser();

  return (
    <PermissionsContext.Provider
      value={{
        check: (action, resource) => {
          if (!currentUser) return false;

          const errors = checkPolicies(
            currentUser.policies as Policy[],
            action,
            resource,
          );

          return isEmpty(errors);
        },
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};
