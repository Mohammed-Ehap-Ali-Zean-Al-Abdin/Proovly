import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectMongo(): Promise<void> {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(env.MONGODB_URI);
}


