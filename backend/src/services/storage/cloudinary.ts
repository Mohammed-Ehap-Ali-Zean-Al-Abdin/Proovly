import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../config/env.js';

function ensureConfigured() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary env vars are not set');
  }
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
  });
}

export async function uploadBufferToCloudinary(buffer: Buffer, name = 'file.bin') {
  ensureConfigured();
  const dataUri = `data:application/octet-stream;base64,${buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'proovly',
    public_id: name.replace(/[^a-zA-Z0-9_-]/g, '_'),
    resource_type: 'auto'
  });
  return { cid: result.public_id, url: result.secure_url };
}


