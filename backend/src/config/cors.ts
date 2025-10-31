import type { CorsOptions } from 'cors';
import { env } from './env.js';

const defaultOrigins = [
  'https://proovly.app',
  'https://proovly.cloud',
  'https://proovly.org'
];

const allowedOrigins = env.CORS_ORIGINS
  ? env.CORS_ORIGINS.split(',').map((s) => s.trim())
  : defaultOrigins;

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('CORS not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};


