import { useGraphQLClient } from '@kedul/common-client';
import React from 'react';
import { AsyncStorage } from 'react-native';

import {
  CurrentUserFragment,
  useCurrentUserQuery,
} from '../generated/MutationsAndQueries';

import { ASYNC_STORAGE_TOKEN } from './Storage';

export interface CurrentUserContext {
  setUser: (accessToken: string) => Promise<void>;
  unsetUser: () => Promise<void>;
  currentUser: null | CurrentUserFragment;
  isUserLoading: boolean;
}

const defaultUseContext: CurrentUserContext = {
  currentUser: null,
  isUserLoading: true,
  setUser: async () => {},
  unsetUser: async () => {},
};

export const CurrentUserContext = React.createContext(defaultUseContext);

export const useCurrentUser = () => {
  return React.useContext(CurrentUserContext);
};

export interface CurrentUserProviderProps {
  children: React.ReactNode;
}

const saveAccessToken = async (accessToken: string) => {
  return AsyncStorage.setItem(ASYNC_STORAGE_TOKEN, accessToken);
};

const removeAccessToken = async () => {
  return AsyncStorage.removeItem(ASYNC_STORAGE_TOKEN);
};

export const CurrentUserProvider = (props: CurrentUserProviderProps) => {
  const { children } = props;
  const graphqlClient = useGraphQLClient();
  const { loading, data, refetch } = useCurrentUserQuery();

  const handleUnsetUser = React.useCallback(async () => {
    await removeAccessToken();
    await graphqlClient.resetStore();
  }, [graphqlClient]);

  const handleSetUser = React.useCallback(
    async (accessToken: string) => {
      await saveAccessToken(accessToken);
      await refetch();
    },
    [refetch],
  );

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser: (data && data.currentUser) || null,
        isUserLoading: loading,
        setUser: handleSetUser,
        unsetUser: handleUnsetUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
