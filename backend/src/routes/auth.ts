import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { signToken } from '../utils/jwt.js';
import { UserModel } from '../models/User.js';
import { env } from '../config/env.js';

const router = Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, passwordHash, role });
    // Issue token on signup for smoother UX
    if (!env.JWT_SECRET) return res.status(500).json({ error: 'Server config error' });
    const token = signToken({ sub: user._id.toString(), role: user.role }, env.JWT_EXPIRES_IN);
    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok || !env.JWT_SECRET) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ sub: user._id.toString(), role: user.role }, env.JWT_EXPIRES_IN);
    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;


