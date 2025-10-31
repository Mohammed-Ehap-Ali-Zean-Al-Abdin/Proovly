import { createWorker } from '../config/redis.js';
import { Job } from 'bullmq';

// Export processor so it can be unit tested directly
export async function writeHcsMessageProcessor(job: Job) {
  return { ok: true, received: job.data };
}

// Register worker (no-op when redis not configured)
createWorker('write-hcs-message', writeHcsMessageProcessor);


