import { enhanceContext, RequestContext } from '@kedul/common-server';
import DataLoader from 'dataloader';

import { ImageRepository, makeImageRepository } from './ImageRepository';
import { Image } from './ImageTypes';

export interface ImageServiceRepositories {
  imageRepository: ImageRepository;
}

export const makeImageServiceRepositories = (
  context: RequestContext,
): ImageServiceRepositories => {
  return {
    imageRepository: makeImageRepository(context),
  };
};

export interface ImageServiceDataLoaders {
  imagesLoader: DataLoader<string, Image>;
}

export const makeImageServiceDataLoaders = (
  repositories: ImageServiceRepositories,
): ImageServiceDataLoaders => {
  const { imageRepository } = repositories;

  return {
    imagesLoader: new DataLoader(ids => imageRepository.findManyByIds(ids)),
  };
};

export interface ImageServiceRequestContext extends RequestContext {
  loaders: ImageServiceDataLoaders;
  repositories: ImageServiceRepositories;
}

export const enhance = (
  context: RequestContext | ImageServiceRequestContext,
): ImageServiceRequestContext => {
  const repositories = makeImageServiceRepositories(context);
  const loaders = makeImageServiceDataLoaders(repositories);

  return enhanceContext(context, repositories, loaders);
};
