import { env } from '../../config/env.js';
import { uploadBufferToCloudinary } from './cloudinary.js';

export interface UploadResult {
  cid: string;
  url: string;
}

export interface StorageService {
  uploadBuffer: (buffer: Buffer, name?: string) => Promise<UploadResult>;
}

export function getStorage(): StorageService {
  return {
    uploadBuffer: (buffer: Buffer, name?: string) => uploadBufferToCloudinary(buffer, name)
  };
}


