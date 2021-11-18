import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import {
  concatAST,
  GraphQLSchema,
  OperationDefinitionNode,
  parse,
  visit,
} from 'graphql';
import { printSchemaWithDirectives } from 'graphql-toolkit';

const makeFormVisitor = () => {
  return {
    DirectiveDefinition: () => null,
    UnionTypeDefinition: () => null,
    InterfaceTypeDefinition: () => null,
    ScalarTypeDefinition: () => null,
    FragmentDefinition: () => null,
    EnumTypeDefinition: () => null,
    InputObjectTypeDefinition: () => null,
    ObjectTypeDefinition: () => null,

    OperationDefinition: (node: OperationDefinitionNode) => {
      if (node.operation === 'query') {
        const queryName = node.name!.value;

        return `
        export interface ${queryName}QueryProps extends ApolloReactHooks.QueryHookOptions<
        ${queryName}Query,
        ${queryName}QueryVariables
      > {
        children: (
          props: ${queryName}Query & { refetch: () => Promise<void>; },
        ) => JSX.Element;
      }
        export const ${queryName}Query = (props: ${queryName}QueryProps) => {
          const { children, ...options } = props;
          const { data, loading, error, refetch } = use${queryName}Query(options);

          if (loading) {
            return <Loading />;
          }

          if (error) {
            return <ErrorText>{error.message}</ErrorText>;
          }

          if (!data) {
            throw new Error('Expected data in ${queryName}Query')
          }

          return children({
            ...data,
            refetch: async () => {
              await refetch(options.variables)
            },
          });
        }
        `;
      }

      return '';
    },
  };
};

export const plugin: PluginFunction = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
) => {
  const printedSchema = printSchemaWithDirectives(schema);
  const astNode = parse(printedSchema);

  const allAst = concatAST(
    documents
      // @ts-ignore
      .reduce((prev, v) => {
        return [...prev, v.content];
      }, [])
      .concat(astNode),
  );

  const formVisitor = makeFormVisitor();
  const formResult = visit(allAst, { leave: formVisitor });

  return {
    prepend: [
      `import React from 'react';`,
      `import { ErrorText, Loading } from '@kedul/common-client';`,
    ],
    content: formResult.definitions.join('\n'),
  };
};
