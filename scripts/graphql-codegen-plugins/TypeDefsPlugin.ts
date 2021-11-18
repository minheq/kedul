import { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { GraphQLSchema, printSchema } from 'graphql';

export const plugin: PluginFunction = (schema: GraphQLSchema) => {
  const printedSchema = printSchema(schema);

  return {
    content: `export const typeDefs = \`${printedSchema}\``,
  };
};
