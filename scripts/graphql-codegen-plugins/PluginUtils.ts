import { indent } from '@graphql-codegen/visitor-plugin-common';
import { constantCase } from 'change-case';
import {
  EnumValueDefinitionNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql';

export const getEnumValue = (
  field:
    | FieldDefinitionNode
    | ObjectTypeDefinitionNode
    | EnumValueDefinitionNode
    | string,
) => {
  const name = typeof field === 'string' ? field : field.name.value;

  return indent(`${constantCase(name)} = '${constantCase(name)}',`);
};

interface DirectiveNode {
  name: { value: string };
  directives?: readonly DirectiveNode[];
  arguments: { kind: string; name: any; value: any }[];
}

export const getDirectiveFromAstNode = (
  node: any,
  directiveName: string,
): DirectiveNode | null => {
  if (!node || !node.directives || node.directives.length === 0) {
    return null;
  }

  const foundDirective = node.directives.find(
    (d: any) => d.name.value && d.name.value === directiveName,
  );

  if (!foundDirective) {
    return null;
  }

  return foundDirective;
};

export const makeBaseVisitor = () => ({
  DirectiveDefinition: () => null,
  UnionTypeDefinition: () => null,
  FieldDefinition: () => null,
  InputValueDefinition: () => null,
  InterfaceTypeDefinition: () => null,
  ScalarTypeDefinition: () => null,
  EnumTypeDefinition: () => null,
  ObjectTypeDefinition: () => null,
  InputObjectTypeDefinition: () => null,
});
