import { InputWithId } from './Types';

export const changeset = async <
  TEntity = any,
  TInput extends InputWithId = any
>(
  original: TEntity,
  input: TInput,
): Promise<TEntity> => {
  const { id, ...updateFields } = input;

  return makeChangeset(original, updateFields);
};

export const makeChangeset = <TEntity = any, TUpdateFields = any>(
  original: TEntity,
  values: TUpdateFields,
): TEntity => {
  const newValue: TEntity = original;

  Object.keys(values).forEach(field => {
    // @ts-ignore
    newValue[field] = values[field];
  });

  return newValue;
};
