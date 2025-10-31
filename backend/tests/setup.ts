import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | undefined;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  // Ensure a JWT secret is available for auth tests
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

afterEach(async () => {
  // Clear all collections between tests
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const collection: any = collections[key];
    try {
      await collection.deleteMany({});
    } catch (err) {
      // ignore
    }
  }
});
