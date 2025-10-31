import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { hederaClient } from '../services/hedera.js';
import { putAnalyticsHash, getAnalyticsHash } from '../services/contracts.js';
import { env } from '../config/env.js';

const router = Router();

router.post('/put-hash', requireAuth(['admin']), async (req, res, next) => {
  try {
    const { key, hash } = req.body || {};
    if (!key || !hash) return res.status(400).json({ error: 'key and hash required' });
    const client = hederaClient();
  const out = await putAnalyticsHash(client, env.ANALYTICS_CONTRACT_ID, key, hash);
    res.json({ ok: true, simulated: out.simulated });
  } catch (err) {
    next(err);
  }
});

router.get('/get-hash', requireAuth(['admin']), async (req, res, next) => {
  try {
    const key = (req.query.key as string) || '';
    if (!key) return res.status(400).json({ error: 'key required' });
    const client = hederaClient();
  const out = await getAnalyticsHash(client, env.ANALYTICS_CONTRACT_ID, key);
    res.json({ key, hash: out.hash, simulated: out.simulated });
  } catch (err) {
    next(err);
  }
});

export default router;
