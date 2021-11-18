import { ApolloProvider, useApolloClient } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import React from 'react';

export const useGraphQLClient = useApolloClient;

export interface GraphQLProviderProps {
  client: ApolloClient<any>;
  children?: React.ReactNode;
}

export const GraphQLProvider = (props: GraphQLProviderProps) => {
  const { children, client } = props;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
