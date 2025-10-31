import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import crypto from 'crypto';
import { cache } from '../config/cache.js';
import { hederaClient, ensureTopic, writeHcsMessage } from '../services/hedera.js';
import { HedTxLogModel } from '../models/HedTxLog.js';

const CACHE_TTL = 60; // seconds

const router = Router();

router.get('/summary', async (req, res) => {
  const { from, to, region } = req.query as Record<string, string>;
  // Try cache first
  const key = `analytics:summary:${from || ''}:${to || ''}:${region || ''}`;
  try {
    const cached = await cache.get(key);
    if (cached) return res.json(JSON.parse(cached));
  } catch (err) {
    // ignore cache errors
  }

  const result = { totalDonations: 0, byRegion: region ? [{ region, amount: 0 }] : [], chainVerifiedPct: 0, from, to };
  // Store in cache
  try {
    await cache.set(key, JSON.stringify(result), CACHE_TTL);
  } catch (err) {
    // ignore
  }
  res.json(result);
});

router.post('/generate-daily-hash', requireAuth(['admin']), async (_req, res) => {
  const csv = 'date,totalDonations\n2025-01-01,0\n';
  const hash = crypto.createHash('sha256').update(csv).digest('hex');
  // Best-effort publish hash to HCS for auditability
  try {
    const client = hederaClient();
    const topicId = client ? await ensureTopic(client) : undefined;
    await writeHcsMessage(client, topicId, { type: 'daily_analytics_hash', date: '2025-01-01', hash });
  } catch (_e) {
    // ignore
  }
  res.json({ hash });
});

// Quick verification endpoint to look up HCS proofs
router.get('/verify-hash', async (req, res, next) => {
  try {
    const hash = (req.query.hash as string) || '';
    if (!hash) return res.status(400).json({ error: 'hash required' });
    const logs = await HedTxLogModel.find({ payloadHash: hash }).lean();
    res.json({ count: logs.length, proofs: logs.map(l => ({ txId: l.hederaTxId, mirrorUrl: l.mirrorUrl, type: l.type, at: l.createdAt })) });
  } catch (err) {
    next(err);
  }
});

export default router;


