import {
  GraphQLFieldConfig,
  GraphQLOutputType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLInputType,
} from 'graphql';
import { RequestContext } from '@kedul/common-server';

interface MutationConfig<
  TInput extends object = any,
  TPayload extends object = any
> {
  name: string;
  description?: string;
  deprecationReason?: string;
  inputFields: { [field in keyof TInput]: { type: GraphQLInputType } };
  outputFields: { [field in keyof TPayload]: { type: GraphQLOutputType } };
  mutateAndGetPayload: (
    input: TInput,
    context: RequestContext,
    info: GraphQLResolveInfo,
  ) => Promise<TPayload>;
}

export const makeMutation = <
  TInput extends object = any,
  TPayload extends object = any
>(
  config: MutationConfig<TInput, TPayload>,
): GraphQLFieldConfig<{}, RequestContext> => {
  const {
    name,
    description,
    deprecationReason,
    inputFields,
    outputFields,
    mutateAndGetPayload,
  } = config;

  const outputType = new GraphQLObjectType({
    name: name + 'Payload',
    fields: outputFields,
  });

  const inputType = new GraphQLInputObjectType({
    name: name + 'Input',
    fields: inputFields,
  });

  return {
    type: outputType,
    description,
    deprecationReason,
    args: {
      input: { type: new GraphQLNonNull(inputType) },
    },
    resolve: (_, { input }, context, info) =>
      mutateAndGetPayload(input, context, info),
  };
};

interface QueryConfig<
  TArgs extends object = any,
  TResult extends object | null = any
> {
  type: GraphQLOutputType;
  args?: { [field in keyof TArgs]: { type: GraphQLInputType } };
  resolve: (root: {}, args: TArgs, context: RequestContext) => Promise<TResult>;
}

export const makeQuery = <
  TArgs extends object = any,
  TResult extends object | null = any
>(
  config: QueryConfig<TArgs, TResult>,
): GraphQLFieldConfig<{}, RequestContext, TArgs> => {
  return {
    type: config.type,
    args: config.args,
    resolve: config.resolve,
  };
};
