import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { camelCase } from 'change-case';
import {
  EnumTypeDefinitionNode,
  EnumValueDefinitionNode,
  GraphQLSchema,
  parse,
  visit,
} from 'graphql';
import { printSchemaWithDirectives } from 'graphql-toolkit';

const getEnumValue = (node: EnumValueDefinitionNode) => {
  return `${camelCase(node.name.value)}: (
    validationErrors: UserValidationError[] = [],
  ) => ({
    code: UserErrorCode.${node.name.value},
    errors: validationErrors,
    message: '${node.description!.value}',
  })
  `;
};

const ERROR_ENUM_NAME = 'UserErrorCode';

const makeErrorsVisitor = () => {
  return {
    DirectiveDefinition: () => null,
    UnionTypeDefinition: () => null,
    InterfaceTypeDefinition: () => null,
    ScalarTypeDefinition: () => null,
    InputObjectTypeDefinition: () => null,
    ObjectTypeDefinition: () => null,

    EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
      if (node.name.value === ERROR_ENUM_NAME) {
        return `export const userErrors = {
          ${node.values!.map(getEnumValue)}
        }`;
      }

      return null;
    },
  };
};

export const plugin: PluginFunction = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
) => {
  const printedSchema = printSchemaWithDirectives(schema);
  const astNode = parse(printedSchema);

  const visitor = makeErrorsVisitor();
  const result = visit(astNode, { leave: visitor });

  return {
    prepend: [`import { UserValidationError } from '@kedul/common-utils';`],
    content: result.definitions.join('\n'),
  };
};
