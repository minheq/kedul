import { ReadStream } from 'fs';

import { flatten } from 'lodash';
import { Breakpoint } from '@kedul/common-config';
import { publish, RequestContext } from '@kedul/common-server';
import { isProduction } from '@kedul/common-utils';
import Jimp from 'jimp';
import uuidv4 from 'uuid/v4';

import { ImageStorageClient, makeS3StorageClient } from './clients';
import { env } from './env';
import { Event, IMAGE_SIZE_MAPPING } from './ImageConstants';
import {
  BaseImage,
  BaseImageSize,
  CloudStorageProvider,
  Image,
  ImageSupportedFormat,
  PredefinedImageSize,
  RawImage,
  StorageImage,
  Upload,
} from './ImageTypes';
import { enhance } from './RequestContext';

const makeSuccessPayload = async (images: Image[]) => ({
  isSuccessful: true,
  images,
  userError: null,
});

const publishEvent = (event: Event, image: Image, context: RequestContext) =>
  publish(event, {
    aggregateId: image.id,
    aggregateType: 'IMAGE',
    data: image,
    context,
  });

const toBuffer = async (stream: ReadStream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const concat: Uint8Array[] = [];

    stream
      .on('data', data => {
        concat.push(data);
      })
      .on('close', async () => {
        const buffer = Buffer.concat(concat);

        resolve(buffer);
      });
  });
};

const makeRawImage = async (upload: Upload): Promise<RawImage> => {
  const { filename, mimetype, encoding, createReadStream } = await upload;
  const buffer = await toBuffer(createReadStream());
  const jimp = await Jimp.read(buffer);

  return { filename, encoding, mimetype, jimp };
};

const makeBaseImageSize = async (
  rawImage: RawImage,
  id: string,
  breakpoint?: Breakpoint.SMALL | Breakpoint.MEDIUM | Breakpoint.LARGE,
): Promise<BaseImageSize> => {
  const { jimp, filename } = rawImage;
  const format = getImageFormat(filename);
  const mimetype = jimp.getMIME();

  if (!breakpoint) {
    return {
      key: getKey(id, format, PredefinedImageSize.ORIGINAL),
      buffer: await jimp.getBufferAsync(mimetype),
      width: jimp.getWidth(),
      height: jimp.getHeight(),
      size: PredefinedImageSize.ORIGINAL,
    };
  }

  const resizedJimp = await jimp.resize(breakpoint, Jimp.AUTO);

  return {
    key: getKey(id, format, IMAGE_SIZE_MAPPING[breakpoint]),
    buffer: await resizedJimp.getBufferAsync(mimetype),
    width: jimp.getWidth(),
    height: jimp.getHeight(),
    size: IMAGE_SIZE_MAPPING[breakpoint],
  };
};

const getFileExtension = (filename: string): string => {
  const extension = filename.split('.').pop();

  if (!extension) throw new Error('File extension expected');

  return extension;
};

const getImageFormat = (filename: string) => {
  const extension = getFileExtension(filename);

  switch (extension) {
    case 'jpg':
      return ImageSupportedFormat.JPG;
    case 'jpeg':
      return ImageSupportedFormat.JPEG;
    case 'png':
      return ImageSupportedFormat.PNG;
    default:
      throw new Error('Unsupported image format');
  }
};

const makeBaseImage = async (rawImage: RawImage): Promise<BaseImage> => {
  const { filename, encoding, jimp } = rawImage;

  const id = uuidv4();
  const mimetype = jimp.getMIME();

  const original = await makeBaseImageSize(rawImage, id);
  const sizes: BaseImageSize[] = [original];

  if (original.width > Breakpoint.SMALL) {
    sizes.push(await makeBaseImageSize(rawImage, id, Breakpoint.SMALL));
  }
  if (original.width > Breakpoint.MEDIUM) {
    sizes.push(await makeBaseImageSize(rawImage, id, Breakpoint.MEDIUM));
  }
  if (original.width > Breakpoint.LARGE) {
    sizes.push(await makeBaseImageSize(rawImage, id, Breakpoint.LARGE));
  }

  return {
    id,
    filename,
    mimetype,
    encoding,
    sizes,
  };
};

const getKey = (id: string, format: string, size: PredefinedImageSize) => {
  return `${id}-${size}.${format}`.toLowerCase();
};

const getHost = (cloudStorageProvider: CloudStorageProvider) => {
  switch (cloudStorageProvider) {
    case CloudStorageProvider.S3:
      const s3Env = env.services.aws.s3;

      if (isProduction) {
        // TODO: Resolve image URL to cloudfront on production
        return '';
      }

      return `${s3Env.bucket}.s3-${s3Env.region}.amazonaws.com`;
    default:
      throw new Error('Host not found');
  }
};

const getBaseUrl = (image: Image) => {
  const { cloudStorageProvider } = image;

  return `https://${getHost(cloudStorageProvider)}`;
};

const getUrl = (image: Image, size: PredefinedImageSize) => {
  const baseUrl = getBaseUrl(image);
  const key = getKey(image.id, image.format, size);

  return `${baseUrl}/${key}`;
};

const makeImage = (cloudStorageProvider: CloudStorageProvider) => async (
  baseImage: BaseImage,
): Promise<Image> => {
  const { id, filename, encoding, mimetype, sizes } = baseImage;

  const originalImage = baseImage.sizes.find(
    s => s.size === PredefinedImageSize.ORIGINAL,
  );

  if (!originalImage) throw new Error('Expected original image');

  const image: Image = {
    id,
    format: getImageFormat(filename),
    encoding,
    width: originalImage.width,
    height: originalImage.height,
    url: `https://${getHost(cloudStorageProvider)}/${getKey(
      id,
      getImageFormat(filename),
      PredefinedImageSize.ORIGINAL,
    )}`,
    mimetype,
    filename,
    cloudStorageProvider,
    createdAt: new Date(),
    sizes: [],
  };

  return {
    ...image,
    sizes: sizes.map(({ buffer, ...s }) => ({
      ...s,
      url: getUrl(image, s.size),
    })),
  };
};

const makeStorageImage = async (
  baseImage: BaseImage,
): Promise<StorageImage[]> => {
  return baseImage.sizes;
};

export interface UploadImagesInput {
  images: Upload[];
}

export const uploadImagesBase = (
  imageStorageClient: ImageStorageClient,
) => async (input: UploadImagesInput, context: RequestContext) => {
  const { imageRepository } = enhance(context).repositories;

  const { images: uploads } = input;
  const { cloudStorageProvider } = imageStorageClient;

  const rawImages = await Promise.all(uploads.map(makeRawImage));
  const baseImages = await Promise.all(rawImages.map(makeBaseImage));
  const storageImagesN = await Promise.all(baseImages.map(makeStorageImage));
  const storageImages = flatten(storageImagesN);

  const images = await Promise.all(
    baseImages.map(makeImage(cloudStorageProvider)),
  );

  await imageStorageClient.uploadImages(storageImages);

  await imageRepository.saveMany(images);

  images.forEach(i => publishEvent(Event.IMAGE_UPLOADED, i, context));

  return makeSuccessPayload(images);
};

export const uploadImages = uploadImagesBase(makeS3StorageClient());
