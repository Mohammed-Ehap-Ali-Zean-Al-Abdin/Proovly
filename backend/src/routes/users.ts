import { Router } from 'express';
import { UserModel } from '../models/User.js';

const router = Router();

/**
 * GET /api/v1/users
 * Query params:
 *  - role: filter by user role (donor|ngo|admin)
 *  - limit: max results (default 100)
 * 
 * Returns list of users (excluding password)
 */
router.get('/', async (req, res) => {
  try {
    const { role, limit = '100' } = req.query;
    
    const filter: any = {};
    if (role && typeof role === 'string') {
      filter.role = role;
    }

    const users = await UserModel
      .find(filter)
      .select('-password') // exclude password field
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * GET /api/v1/users/:id
 * Returns a single user by ID (excluding password)
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
