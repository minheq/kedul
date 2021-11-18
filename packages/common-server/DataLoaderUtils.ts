import { EntityBase } from '@kedul/common-utils';

/**
 * A function to marshal results to uphold DataLoader constraints
 * - The Array of values must be the same length as the Array of keys.
 * - Each index in the Array of values must correspond to the same index in the Array of keys.
 */
export const upholdDataLoaderConstraints = <TEntity extends EntityBase = any>(
  entities: TEntity[],
  ids: string[],
): (TEntity | null)[] => {
  const entitiesMap = new Map(entities.map(entity => [entity.id, entity]));

  return ids.map(id => {
    const entity = entitiesMap.get(id);

    return entity || null;
  });
};
