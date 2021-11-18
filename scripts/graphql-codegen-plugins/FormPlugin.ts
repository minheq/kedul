import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { lowerCaseFirst } from 'change-case';
import {
  concatAST,
  GraphQLSchema,
  OperationDefinitionNode,
  parse,
  visit,
} from 'graphql';
import { printSchemaWithDirectives } from 'graphql-toolkit';

/* eslint-disable */

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
      if (node.operation === 'mutation') {
        const mutationName = node.name!.value;

        return `
        export interface Use${mutationName}Props extends Omit<FormikConfig<${mutationName}Input>, 'onSubmit'> {
          onCompleted?: (data: ${mutationName}Mutation, helpers: FormikHelpers<${mutationName}Input>) => void;
        }

        export const use${mutationName}Form = (props: Use${mutationName}Props) => {
          const { onCompleted = () => {}, ...formikConfig } = props;
          const { danger } = useToast()

          const [mutate] = use${mutationName}Mutation({
            onError: (err) => {
              danger({ description: err.message.replace('GraphQL error: ', '') })
            },
          });

          return useFormik<${mutationName}Input>({
            initialStatus: {},
            validationSchema: ${lowerCaseFirst(
              mutationName,
            )}InputValidationSchema,
            onSubmit: async (input, helpers) => {
              const { setErrors, setSubmitting, setStatus } = helpers;
              const result = await mutate({ variables: { input }});

              setSubmitting(false);

              if (result && result.data) {
                if (result.data.${lowerCaseFirst(
                  mutationName,
                )} && result.data.${lowerCaseFirst(mutationName)}.userError) {
                  if (result.data.${lowerCaseFirst(
                    mutationName,
                  )}.userError.errors.length > 0) {
                    setErrors(
                      transformToErrorObject(
                        result.data.${lowerCaseFirst(mutationName)}.userError
                      ),
                    );
                  } else {
                    setStatus(result.data.${lowerCaseFirst(
                      mutationName,
                    )}.userError)
                  }
                } else {
                  onCompleted(result.data, helpers)
                }
              }
            },
            ...formikConfig,
          })
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
      `import { useFormik, FormikConfig, FormikHelpers } from 'formik';`,
      `import { useToast } from 'paramount-ui';`,
      `import { transformToErrorObject } from '@kedul/common-utils';`,
    ],
    content: formResult.definitions.join('\n'),
  };
};
