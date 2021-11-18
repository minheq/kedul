import { CloudStorageProvider, StorageImage } from '../ImageTypes';

export interface ImageStorageClient<TResult = any> {
  cloudStorageProvider: CloudStorageProvider;
  uploadImages(storageImages: readonly StorageImage[]): Promise<TResult>;
}
