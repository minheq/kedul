import { ReadStream } from 'fs';

import Jimp from 'jimp';

export enum CloudStorageProvider {
  S3 = 'S3',
}

export type Upload = Promise<{
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}>;

export interface Image {
  id: string;
  width: number;
  height: number;
  url: string;
  format: ImageSupportedFormat;
  filename: string;
  mimetype: string;
  encoding: string;
  cloudStorageProvider: CloudStorageProvider;
  sizes: ImageSize[];
  createdAt: Date;
}

export interface ImageSize {
  size: PredefinedImageSize;
  width: number;
  height: number;
  url: string;
  key: string;
}

export enum ImageSupportedFormat {
  JPG = 'JPG',
  JPEG = 'JPEG',
  PNG = 'PNG',
}

export enum PredefinedImageSize {
  ORIGINAL = 'ORIGINAL',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  XLARGE = 'XLARGE',
  XXLARGE = 'XXLARGE',
}

/**
 * Transformed image data from Upload type for further processing
 */
export interface RawImage {
  filename: string;
  mimetype: string;
  encoding: string;
  jimp: Jimp;
}

/**
 * Transformed image data from RawImage for uploading to a storage
 */
export interface StorageImage {
  key: string;
  buffer: Buffer;
}

export interface BaseImageSize {
  key: string;
  buffer: Buffer;
  width: number;
  height: number;
  size: PredefinedImageSize;
}

export interface BaseImage {
  id: string;
  filename: string;
  mimetype: string;
  encoding: string;
  sizes: BaseImageSize[];
}
