import type { CorsOptions } from 'cors';
import { env } from './env.js';

// NOTE:
// - CORS compares the full origin string (protocol + host + optional port)
// - The browser Origin is the frontend site, NOT the API origin.
// - To make local/dev and preview URLs work, we support:
//   • explicit origins (exact match)
//   • simple wildcards like "*.vercel.app"
//   • localhost dev ports by default

const defaultOrigins = [
  'https://proovly.app',
  'https://api.proovly.app',
  'https://proovly.cloud',
  'https://proovly.org',
  // Common dev origins
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:4000',
];

const configured = env.CORS_ORIGINS
  ? env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configured])).map((o) => o.toLowerCase());

const wildcardHosts = allowedOrigins
  .filter((o) => o.startsWith('*.'))
  .map((o) => o.slice(1)); // '*.vercel.app' -> '.vercel.app'

function isAllowedOrigin(origin: string): boolean {
  try {
    const o = origin.toLowerCase();
    if (allowedOrigins.includes(o)) return true;

    const url = new URL(o);
    const hostname = url.hostname;

    // Allow localhost by default for dev ports
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;

    // Support basic wildcard hosts like '*.vercel.app'
    if (wildcardHosts.some((suffix) => hostname.endsWith(suffix))) return true;

    return false;
  } catch {
    return false;
  }
}

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // non-browser or same-origin
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'Origin'],
};


