import mongoose from 'mongoose';
import { env } from './env.js';

declare global {
  // allow caching on globalThis in TS
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var __mongooseConnectionPromise: Promise<typeof mongoose> | undefined;
}

export async function connectMongo(): Promise<void> {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is not set');

  // Fail fast rather than buffer operations indefinitely
  mongoose.set('bufferCommands', false);
  mongoose.set('strictQuery', true);

  // Reuse the existing connection promise if present (serverless friendly)
  if (global.__mongooseConnectionPromise) {
    await global.__mongooseConnectionPromise;
    return;
  }

  const connPromise = mongoose
    .connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })
    .then(() => mongoose)
    .catch((err) => {
      // ensure cached promise is cleared on failure
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete global.__mongooseConnectionPromise;
      throw err;
    });

  // Cache the promise so subsequent cold starts reuse the connection
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  global.__mongooseConnectionPromise = connPromise;

  await connPromise;

  // Basic visibility in logs
  mongoose.connection.on('connected', () => {
    // eslint-disable-next-line no-console
    console.log('Mongo connected');
  });
  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('Mongo error', err);
  });
  mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.warn('Mongo disconnected');
  });
}


