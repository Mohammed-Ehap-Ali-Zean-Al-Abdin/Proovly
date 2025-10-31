import type { Redis } from 'ioredis';
import IORedis from 'ioredis';
import { env } from './env.js';

type Cache = {
  get: (k: string) => Promise<string | null>;
  set: (k: string, v: string, ttlSeconds?: number) => Promise<void>;
};

let client: Redis | null = null;

if (env.REDIS_URL) {
  client = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null, enableReadyCheck: false } as any);
}

const memoryStore = new Map<string, { value: string; expiresAt?: number }>();

export const cache: Cache = {
  async get(k: string) {
    if (client) return await client.get(k);
    const item = memoryStore.get(k);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      memoryStore.delete(k);
      return null;
    }
    return item.value;
  },
  async set(k: string, v: string, ttlSeconds?: number) {
    if (client) {
      if (ttlSeconds) await client.set(k, v, 'EX', ttlSeconds);
      else await client.set(k, v);
      return;
    }
    memoryStore.set(k, { value: v, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined });
  }
};
