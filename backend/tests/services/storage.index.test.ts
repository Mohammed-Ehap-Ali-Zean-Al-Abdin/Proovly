import { getStorage } from '../../src/services/storage/index';

// Mock cloudinary uploader similar to cloudinary.test
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn(async () => ({ public_id: 'idx_id', secure_url: 'https://cld/idx_id' }))
    },
    config: jest.fn()
  }
}));

describe('storage/index getStorage', () => {
  it('returns a storage service that uploads buffer', async () => {
    jest.resetModules();
    jest.doMock('../../src/config/env', () => ({ env: { CLOUDINARY_CLOUD_NAME: 'cn', CLOUDINARY_API_KEY: 'key', CLOUDINARY_API_SECRET: 'secret' } }));
    const { getStorage } = await import('../../src/services/storage/index');
    const svc = getStorage();
    const res = await svc.uploadBuffer(Buffer.from('hi'), 'nm');
    expect(res.cid).toBe('idx_id');
    expect(res.url).toBe('https://cld/idx_id');
  });
});
