import { parseJsonColumn, RequestContext } from '@kedul/common-server';

import { ImageDbObject, Table } from './Database';
import { Image } from './ImageTypes';

export interface ImageRepository {
  saveMany(image: Image[]): Promise<void>;
  findById(id: string): Promise<Image | null>;
  findManyByIds(ids: string[]): Promise<Image[]>;
}

const fromEntity = (context: RequestContext) => (
  image: Image,
): ImageDbObject => {
  return {
    ...image,
    width: image.width,
    height: image.height,
    url: image.url,
    sizes: JSON.stringify(image.sizes),
  };
};

const toEntity = (image: ImageDbObject): Image => {
  return {
    ...image,
    sizes: parseJsonColumn(image.sizes),
  };
};

const saveMany = (context: RequestContext) => async (images: Image[]) => {
  const { knex } = context.dependencies;

  const dbImages = images.map(fromEntity(context));

  await knex.batchInsert(Table.IMAGE, dbImages);
};

const findById = (context: RequestContext) => async (
  id: string,
): Promise<Image | null> => {
  const { knex } = context.dependencies;

  const image = await knex
    .select()
    .where({ id })
    .from(Table.IMAGE)
    .first();

  return image ? toEntity(image) : null;
};

const findManyByIds = (context: RequestContext) => async (
  ids: string[],
): Promise<Image[]> => {
  const { knex } = context.dependencies;

  const images = (await knex
    .select()
    .whereIn('id', ids)
    .from(Table.IMAGE)) as ImageDbObject[];

  return images.map(toEntity);
};

export const makeImageRepository = (
  context: RequestContext,
): ImageRepository => ({
  findById: findById(context),
  findManyByIds: findManyByIds(context),
  saveMany: saveMany(context),
});
