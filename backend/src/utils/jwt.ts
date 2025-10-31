import jwt, { Secret } from 'jsonwebtoken';
import { env } from '../config/env.js';

// Sign token with an explicit expiresIn param (string or number) to avoid overload ambiguity
export function signToken(payload: string | object, expiresIn?: string | number): string {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
  const opts: any = {};
  if (expiresIn !== undefined) opts.expiresIn = expiresIn;
  return jwt.sign(payload as any, env.JWT_SECRET as Secret, opts);
}

export function verifyToken<T = any>(token: string): T {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
  return jwt.verify(token, env.JWT_SECRET as Secret) as T;
}
