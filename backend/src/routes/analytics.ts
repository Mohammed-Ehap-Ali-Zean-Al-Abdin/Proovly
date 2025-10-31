import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import crypto from 'crypto';
import { cache } from '../config/cache.js';
import { hederaClient, ensureTopic, writeHcsMessage } from '../services/hedera.js';
import { HedTxLogModel } from '../models/HedTxLog.js';

const CACHE_TTL = 60; // seconds

const router = Router();

router.get('/summary', async (req, res, next) => {
  try {
    const { from, to, region } = req.query as Record<string, string>;
    // Try cache first
    const key = `analytics:summary:${from || ''}:${to || ''}:${region || ''}`;
    try {
      const cached = await cache.get(key);
      if (cached) return res.json(JSON.parse(cached));
    } catch (err) {
      // ignore cache errors
    }

    // Import DonationModel dynamically to avoid circular dependency
    const { DonationModel } = await import('../models/Donation.js');
    
    // Build query filters
    const filter: any = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    
    // Get total donations and sum
    const donations = await DonationModel.find(filter).lean();
    const totalDonations = donations.reduce((sum, d) => sum + (d.amountUSD || 0), 0);
    
    // Calculate chain verification percentage (donations with hederaHcsTxId)
    const chainVerified = donations.filter(d => d.hederaHcsTxId).length;
    const chainVerifiedPct = donations.length > 0 ? chainVerified / donations.length : 0;
    
    // Group by region if needed (for now, use campaignId as proxy for region)
    const byRegion: { region: string; amount: number }[] = [];
    if (region) {
      const regionTotal = donations
        .filter(d => d.campaignId?.includes(region))
        .reduce((sum, d) => sum + (d.amountUSD || 0), 0);
      byRegion.push({ region, amount: regionTotal });
    }

    const result = { 
      totalDonations, 
      byRegion, 
      chainVerifiedPct, 
      from, 
      to,
      totalCount: donations.length,
      chainVerifiedCount: chainVerified
    };
    
    // Store in cache
    try {
      await cache.set(key, JSON.stringify(result), CACHE_TTL);
    } catch (err) {
      // ignore
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
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


