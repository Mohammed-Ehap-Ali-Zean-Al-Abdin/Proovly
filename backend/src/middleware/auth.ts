import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { verifyToken } from '../utils/jwt.js';

export interface JwtClaims {
  sub: string;
  role: 'donor' | 'ngo' | 'admin';
}

export function requireAuth(roles?: Array<JwtClaims['role']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token || !env.JWT_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  const decoded = verifyToken<JwtClaims>(token);
      if (roles && !roles.includes(decoded.role)) return res.status(403).json({ error: 'Forbidden' });
      // @ts-expect-error attach user to req
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
}


