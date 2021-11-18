import { PluginFunction } from '@graphql-codegen/plugin-helpers';
import {
  getBaseTypeNode,
  indent,
} from '@graphql-codegen/visitor-plugin-common';
import { lowerCaseFirst } from 'change-case';
import {
  EnumTypeDefinitionNode,
  GraphQLSchema,
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  Kind,
  parse,
  printSchema,
  visit,
} from 'graphql';

import { makeBaseVisitor } from './PluginUtils';

const suffix = 'ValidationSchema';

const validationSchemaName = (
  node: InputObjectTypeDefinitionNode | EnumTypeDefinitionNode,
) => `${lowerCaseFirst(node.name.value)}${suffix}`;

export const makeValidatorVisitor = () => {
  return {
    ...makeBaseVisitor(),
    InputObjectTypeDefinition: (node: InputObjectTypeDefinitionNode) => {
      return `export const validate${node.name.value} = validateForUserError<${
        node.name.value
      }>(${validationSchemaName(node)}())\n`;
    },
  };
};

// eslint-disable-next-line
export const makeYupVisitor = () => {
  const scalars = {
    Boolean: 'boolean()',
    Date: 'date()',
    Float: 'number()',
    ID: 'string()',
    Int: 'number()',
    String: 'string()',
    Upload: `mixed()`,
  };

  return {
    DirectiveDefinition: () => null,
    UnionTypeDefinition: () => null,
    InterfaceTypeDefinition: () => null,
    ObjectTypeDefinition: () => null,
    ScalarTypeDefinition: () => null,

    EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
      const getVal = (value: any) => `'${value.name.value}'`;

      return `export function ${validationSchemaName(node)} (nullable = false) {
      return nullable
        ? mixed().oneOf([null, ${node.values!.map(getVal)}])
        : mixed().oneOf([${node.values!.map(getVal)}]);
    }`;
    },

    InputValueDefinition: (node: InputValueDefinitionNode) => {
      const coreType = getBaseTypeNode(node.type);
      const type = coreType.name.value;
      // @ts-ignore
      const scalarValue = scalars[type];

      const isRequired = node.type.kind === Kind.NON_NULL_TYPE;
      const isList =
        node.type.kind === Kind.LIST_TYPE ||
        // @ts-ignore
        (node.type.type && node.type.type.kind === Kind.LIST_TYPE);
      const required = isRequired ? '.required()' : '';
      const nullable =
        isRequired || isList ? '.nullable(false)' : '.nullable(true)';
      const isListNullable =
        isRequired && isList ? '.nullable(false)' : '.nullable(true)';

      const wrapInArray = (value: any) => {
        if (isList) return `array().of(${value})${isListNullable}`;

        return value;
      };

      if (scalarValue) {
        const scalar = `${scalarValue}${required}${nullable}`;
        return indent(`${node.name.value}: ${wrapInArray(scalar)},`);
      }
      const baseSchema = `${lowerCaseFirst(type)}${suffix}(${
        isRequired ? 'false' : 'true'
      })`;
      const schema = `${baseSchema}${required}${nullable}`;

      return indent(`${node.name.value}: ${wrapInArray(schema)},`);
    },

    InputObjectTypeDefinition: (node: InputObjectTypeDefinitionNode) => {
      const sortedFields = node.fields!.slice(0).sort();

      return `export function ${validationSchemaName(
        node,
      )} (nullable?: boolean) {
        return object().shape<${node.name.value}>({
      ${sortedFields.join('\n')}
      })
      }\n`;
    },
  };
};

export const plugin: PluginFunction = (schema: GraphQLSchema) => {
  const printedSchema = printSchema(schema);
  const astNode = parse(printedSchema);

  const yupVisitor = makeYupVisitor();
  const yupResult = visit(astNode, { leave: yupVisitor });

  const validatorVisitor = makeValidatorVisitor();
  const validatorResult = visit(astNode, { leave: validatorVisitor });

  return {
    prepend: [
      `import { validateForUserError } from '@kedul/common-utils';`,
      `import { array, boolean, date, mixed, number, object, string } from 'yup';`,
    ],
    content: [...yupResult.definitions, ...validatorResult.definitions].join(
      '\n',
    ),
  };
};
