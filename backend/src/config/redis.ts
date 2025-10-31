import { Queue, Worker, JobsOptions, Processor } from 'bullmq';
import type { Redis, Cluster } from 'ioredis';
import IORedis from 'ioredis';
import { env } from './env.js';

function createRedisConnection(): Redis | Cluster | undefined {
  if (env.REDIS_URL) {
    return new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null, enableReadyCheck: false, tls: {} as any });
  }
  // For Upstash REST, bullmq supports ioredis with REST? It does not. We will require REDIS_URL for BullMQ, but allow REST for app-level caching later.
  return undefined;
}

export const redisConnection = createRedisConnection();

export function createQueue(name: string): Queue | undefined {
  if (!redisConnection) return undefined;
  const queue = new Queue(name, { connection: redisConnection });
  // Attach a scheduler to handle delayed/retried jobs
  // eslint-disable-next-line no-new
  return queue;
}

export function createWorker(
  name: string,
  processor: Processor
): Worker | undefined {
  if (!redisConnection) return undefined;
  return new Worker(name, processor, { connection: redisConnection });
}

export type JobOptions = JobsOptions;


