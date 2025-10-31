import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

/**
 * ensureDbReady guards API routes to prevent Mongoose buffering timeouts.
 * - If Mongo is connected, continue.
 * - If not connected, return 503 Service Unavailable with a clear message.
 * - Skips in test environment since tests manage their own in-memory connection.
 */
export function ensureDbReady(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === 'test') return next();

  const ready = mongoose.connection.readyState === 1; // connected
  if (ready) return next();

  res.status(503).json({
    error: 'service_unavailable',
    message: 'Database is not connected. Please try again shortly.'
  });
}
