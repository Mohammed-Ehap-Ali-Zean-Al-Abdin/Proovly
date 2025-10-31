import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGINS: z.string().optional(),

  // Mongo
  MONGODB_URI: z.string().optional(),

  // Redis (Upstash REST preferred)
  REDIS_REST_URL: z.string().optional(),
  REDIS_REST_TOKEN: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // Hedera
  HEDERA_NETWORK: z.enum(['testnet', 'mainnet']).default('testnet'),
  HEDERA_ACCOUNT_ID: z.string().optional(),
  HEDERA_PRIVATE_KEY: z.string().optional(),
  HCS_TOPIC_ID: z.string().optional(),
  OFD_TOKEN_ID: z.string().optional(),
  HEDERA_MIRROR_BASE_URL: z.string().optional(),
  ANALYTICS_CONTRACT_ID: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().default('1h'),

  // Storage
  STORAGE_PROVIDER: z.enum(['ipfs', 'cloudinary']).default('cloudinary'),
  WEB3_STORAGE_TOKEN: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional()
});

export const env = EnvSchema.parse(process.env);


