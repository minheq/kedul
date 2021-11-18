// https://www.reddit.com/r/typescript/comments/95l6ml/any_way_to_make_particular_fields_optional_in/e3tiew1
export type Overwrite<T, K> = Pick<T, Exclude<keyof T, keyof K>> & K;

export interface InputWithId {
  id: string;
}

export interface EntityBase {
  id: string;
}

export interface AggregateBase {
  id: string;
}

export interface RepositoryBase<TEntity extends EntityBase = any> {
  findById: (id: string) => Promise<TEntity | null>;
  getById: (id: string) => Promise<TEntity>;
  save: (entity: TEntity) => Promise<void>;
  update: (entity: TEntity) => Promise<void>;
  remove: (entity: TEntity) => Promise<void>;
}

export type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
