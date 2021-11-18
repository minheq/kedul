export interface ImageDbObject {
  id: string;
  width: number;
  height: number;
  url: string;
  format: ImageSupportedFormat;
  filename: string;
  mimetype: string;
  encoding: string;
  cloudStorageProvider: CloudStorageProvider;
  sizes: string;
  createdAt: Date;
}

export enum ImageSupportedFormat {
  JPG = 'JPG',
  JPEG = 'JPEG',
  PNG = 'PNG',
}

export enum CloudStorageProvider {
  S3 = 'S3',
}

export enum UserErrorCode {
  WRONG_IMAGE_FORMAT = 'WRONG_IMAGE_FORMAT',
}

export enum Table {
  IMAGE = 'IMAGE',
}
