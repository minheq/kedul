import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { RequestContext } from '@kedul/common-server';
import { findImageById, QueryFindImageByIdArgs } from '@kedul/service-image';

import { GraphQLDate } from './GraphQLCommon';
import { makeQuery } from './GraphQLUtils';

const GraphQLImageSupportedFormat = new GraphQLEnumType({
  name: 'ImageSupportedFormat',
  values: {
    JPG: { value: 'JPG' },
    JPEG: { value: 'JPEG' },
    PNG: { value: 'PNG' },
  },
});

const GraphQLPredefinedImageSize = new GraphQLEnumType({
  name: 'PredefinedImageSize',
  values: {
    ORIGINAL: { value: 'ORIGINAL' },
    SMALL: { value: 'SMALL' },
    MEDIUM: { value: 'MEDIUM' },
    LARGE: { value: 'LARGE' },
    XLARGE: { value: 'XLARGE' },
    XXLARGE: { value: 'XXLARGE' },
  },
});

const GraphQLCloudStorageProvider = new GraphQLEnumType({
  name: 'CloudStorageProvider',
  values: {
    S3: { value: 'S3' },
  },
});

const GraphQLImageSize: GraphQLObjectType = new GraphQLObjectType({
  name: 'ImageSizeType',
  fields: () => ({
    size: { type: new GraphQLNonNull(GraphQLPredefinedImageSize) },
    width: { type: new GraphQLNonNull(GraphQLInt) },
    height: { type: new GraphQLNonNull(GraphQLInt) },
    url: { type: GraphQLString },
    key: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const GraphQLImage: GraphQLObjectType = new GraphQLObjectType({
  name: 'Image',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    width: { type: new GraphQLNonNull(GraphQLInt) },
    height: { type: new GraphQLNonNull(GraphQLInt) },
    url: { type: new GraphQLNonNull(GraphQLString) },
    format: { type: new GraphQLNonNull(GraphQLImageSupportedFormat) },
    filename: { type: new GraphQLNonNull(GraphQLString) },
    mimetype: { type: new GraphQLNonNull(GraphQLString) },
    encoding: { type: new GraphQLNonNull(GraphQLString) },
    cloudStorageProvider: {
      type: new GraphQLNonNull(GraphQLCloudStorageProvider),
    },
    sizes: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLImageSize)),
      ),
    },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
  }),
});

export const ImageQuery = makeQuery({
  type: GraphQLImage,
  args: {
    id: { type: GraphQLID },
    size: { type: GraphQLPredefinedImageSize },
  },
  resolve: (root: {}, args: QueryFindImageByIdArgs, context: RequestContext) =>
    findImageById(args, context),
});
