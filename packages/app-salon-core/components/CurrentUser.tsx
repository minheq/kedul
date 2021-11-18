import { isFunction } from 'lodash';
import React from 'react';

import { CurrentUserFragment } from '../generated/MutationsAndQueries';
import { LoginScreen } from '../screens';

import { Loading } from './Loading';
import { useCurrentUser } from './CurrentUserProvider';

export interface CurrentUserProps {
  children:
    | ((currentUser: CurrentUserFragment) => React.ReactNode)
    | React.ReactNode;
}

export const CurrentUser = (props: CurrentUserProps) => {
  const { children } = props;
  const { isUserLoading, currentUser } = useCurrentUser();

  if (isUserLoading) return <Loading />;
  if (!currentUser) return <LoginScreen />;

  if (isFunction(children)) return <>{children(currentUser)}</>;

  return <>{children}</>;
};
