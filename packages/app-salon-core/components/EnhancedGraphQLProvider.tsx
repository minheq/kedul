import { GraphQLProvider } from '@kedul/common-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import React from 'react';
import { AsyncStorage } from 'react-native';

import { env } from '../env';

import {
  ASYNC_STORAGE_TOKEN,
  ASYNC_STORAGE_BUSINESS_ID,
  ASYNC_STORAGE_LOCATION_ID,
} from './Storage';

export interface EnhancedGraphQLProviderProps {
  children?: React.ReactNode;
}

const getRequestHeaders = async () => {
  const userToken = await AsyncStorage.getItem(ASYNC_STORAGE_TOKEN);
  const businessId = await AsyncStorage.getItem(ASYNC_STORAGE_BUSINESS_ID);
  const locationId = await AsyncStorage.getItem(ASYNC_STORAGE_LOCATION_ID);

  return {
    ...(userToken
      ? {
          authorization: `Bearer ${userToken}`,
        }
      : {}),
    ...(businessId
      ? {
          ['x-business-id']: businessId,
        }
      : {}),
    ...(locationId
      ? {
          ['x-location-id']: locationId,
        }
      : {}),
  };
};

export const EnhancedGraphQLProvider = (
  props: EnhancedGraphQLProviderProps,
) => {
  const { children } = props;

  const cache = new InMemoryCache();

  const httpLink = createUploadLink({
    uri: env.gateway.graphqlUri,
  });

  const middlewareLink = setContext(async () => {
    const headers = await getRequestHeaders();

    return { headers };
  });

  const errorLink = onError(errorResponse => {
    // TODO: Logout if server responds with unauthorized error
    // TODO: Send error report if server responds with any error
  });

  const link = ApolloLink.from([errorLink, middlewareLink, httpLink]);

  const client = new ApolloClient({ cache, link });

  return <GraphQLProvider client={client}>{children}</GraphQLProvider>;
};
