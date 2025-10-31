import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectMongo(): Promise<void> {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is not set');

  // Fail fast rather than buffer operations indefinitely
  mongoose.set('bufferCommands', false);
  // Optional: align with modern query parsing
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    // pool defaults are fine; can be tuned if needed
  });

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


