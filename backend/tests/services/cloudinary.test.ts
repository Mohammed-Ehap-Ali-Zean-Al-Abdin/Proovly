// Mock cloudinary module globally for these tests
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn(async (dataUri: string, opts: any) => ({
        public_id: 'mock_public_id',
        secure_url: 'https://res.cloudinary.com/mock/mock_public_id'
      }))
    },
    config: jest.fn()
  }
}));

describe('cloudinary storage service', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('throws when config not set', async () => {
    // Import with default/mock env where CLOUDINARY vars are absent
    jest.doMock('../../src/config/env', () => ({ env: {} }));
    const { uploadBufferToCloudinary } = await import('../../src/services/storage/cloudinary');
    await expect(uploadBufferToCloudinary(Buffer.from('x'), 'name')).rejects.toThrow('Cloudinary env vars are not set');
  });

  it('uploads buffer to cloudinary when configured', async () => {
    process.env.CLOUDINARY_CLOUD_NAME = 'cn';
    process.env.CLOUDINARY_API_KEY = 'key';
    process.env.CLOUDINARY_API_SECRET = 'secret';
    jest.doMock('../../src/config/env', () => ({ env: { CLOUDINARY_CLOUD_NAME: 'cn', CLOUDINARY_API_KEY: 'key', CLOUDINARY_API_SECRET: 'secret' } }));
    const { uploadBufferToCloudinary } = await import('../../src/services/storage/cloudinary');
    const res = await uploadBufferToCloudinary(Buffer.from('abcd'), 'myfile.bin');
    expect(res.cid).toBe('mock_public_id');
    expect(res.url).toBe('https://res.cloudinary.com/mock/mock_public_id');
  });
});
