import { createReadStream } from 'fs';
import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';

import { ImageStorageClient } from './clients';
import { uploadImagesBase } from './ImageMutations';
import {
  CloudStorageProvider,
  ImageSupportedFormat,
  Upload,
} from './ImageTypes';

const knex = makeKnex();
const context = makeContext();

const mockCloudStorageProvider: ImageStorageClient = {
  cloudStorageProvider: CloudStorageProvider.S3,
  uploadImages: jest.fn(),
};

export const uploadImages = uploadImagesBase(mockCloudStorageProvider);

beforeAll(async () => {
  await knex.migrate.latest({
    directory: path.resolve(__dirname, './migrations'),
  });
});

afterAll(async () => {
  await knex.destroy();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

test('should upload a single image and keep only original size due to small size of the image', async () => {
  const filename = 'image.jpg';

  const upload: Upload = Promise.resolve({
    filename,
    mimetype: 'doesnotmatter',
    encoding: 'doesnotmatter',
    createReadStream: () =>
      createReadStream(path.resolve(__dirname, './fixtures/test.jpg')),
  });

  const result = await uploadImages({ images: [upload] }, context);

  expect(result.images).toHaveLength(1);

  const resultImage = result.images[0];
  expect(resultImage).toBeTruthy();
  expect(resultImage.filename).toBe(filename);
  expect(resultImage.format).toBe(ImageSupportedFormat.JPG);

  expect(resultImage.width).toBeTruthy();
  expect(resultImage.height).toBeTruthy();
  expect(resultImage.url).toBeTruthy();

  expect(resultImage.sizes).toHaveLength(1); // Small image

  expect(mockCloudStorageProvider.uploadImages).toBeCalled();
});
