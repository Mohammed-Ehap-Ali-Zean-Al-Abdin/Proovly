import { Router } from 'express';
import { DonationModel } from '../models/Donation.js';
import { hederaClient, ensureTopic, writeHcsMessage, sha256, submitAndLog } from '../services/hedera.js';
import { createQueue } from '../config/redis.js';
import { requireAuth, type JwtClaims } from '../middleware/auth.js';

const router = Router();

// State machine validator
function canTransition(from: string, to: string, role: JwtClaims['role']): boolean {
  const validTransitions: Record<string, { next: string[]; roles: JwtClaims['role'][] }> = {
    pending: { next: ['funded'], roles: ['donor', 'ngo', 'admin'] }, // allow ngo/admin to fund for legacy/testing
    funded: { next: ['assigned'], roles: ['ngo', 'admin'] },
    assigned: { next: ['delivered'], roles: ['ngo', 'admin'] },
    delivered: { next: [], roles: [] },
  };
  const rule = validTransitions[from];
  if (!rule) return false;
  return rule.next.includes(to) && rule.roles.includes(role);
}

// GET /donations - List donations (with optional filters)
router.get('/', async (req, res, next) => {
  try {
    const { userId, campaignId, status } = req.query;
    const filter: any = {};
    if (userId) filter.donorId = userId;
    if (campaignId) filter.campaignId = campaignId;
    if (status) filter.status = status;

    const donations = await DonationModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    
    res.json(donations);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { donorId, campaignId, amountUSD, currency } = req.body || {};
    if (!donorId || !campaignId || !amountUSD) {
      return res.status(400).json({ error: 'donorId, campaignId, amountUSD required' });
    }
    const donation = await DonationModel.create({ donorId, campaignId, amountUSD, currency });

    // Prepare HCS payload (mocked if client/topic missing)
    const client = hederaClient();
    const topicId = client ? await ensureTopic(client) : undefined;
    const payload = {
      type: 'donation_funded',
      donationId: donation._id.toString(),
      amount_usd: donation.amountUSD,
      campaign: donation.campaignId,
      timestamp: new Date().toISOString()
    };
    const { txId, mirrorUrl } = await writeHcsMessage(client, topicId, payload);
    const payloadHash = sha256(JSON.stringify(payload));
    donation.hederaHcsTxId = txId;
    await donation.save();

    // enqueue a background job to re-process or confirm message
    try {
      const queue = createQueue('write-hcs-message');
      if (queue) await queue.add('hcs', { donationId: donation._id.toString(), payload });
    } catch (err) {
      // ignore queue errors
    }

    // Persist via submitAndLog asynchronously (best-effort)
    void submitAndLog(client, topicId, payload).catch(() => {});

    // Avoid requiring HedTxLog now; keep simple for MVP create
    return res.status(201).json({ donationId: donation._id.toString(), status: donation.status, hederaHcsTxId: txId, mirrorUrl });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const donation = await DonationModel.findById(req.params.id).lean();
    if (!donation) return res.status(404).json({ error: 'Not found' });
    res.json(donation);
  } catch (err) {
    next(err);
  }
});

// PATCH /donations/:id - Update status/recipient with state machine guards
router.patch('/:id', requireAuth(['ngo', 'admin']), async (req, res, next) => {
  try {
    const { status, recipientId } = req.body || {};
    const donation = await DonationModel.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Not found' });

    // @ts-expect-error user attached by middleware
    const user = req.user as JwtClaims;

    // Validate state transition if status is being changed
    if (status && status !== donation.status) {
      if (!canTransition(donation.status, status, user.role)) {
        return res.status(403).json({ error: `Cannot transition from ${donation.status} to ${status} with role ${user.role}` });
      }
      donation.status = status;
    }

    if (typeof recipientId !== 'undefined') {
      donation.recipientId = recipientId || null;
    }

    await donation.save();
    res.json(donation.toObject());
  } catch (err) {
    next(err);
  }
});

// POST /donations/:id/deliver - Mark delivered with privateKey proof (MVP) and persist media
router.post('/:id/deliver', requireAuth(['ngo', 'admin']), async (req, res, next) => {
  try {
    const { privateKey, mediaUrl } = req.body || {};
    if (!privateKey) return res.status(400).json({ error: 'privateKey is required' });

    const donation = await DonationModel.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Not found' });

    // @ts-expect-error user attached by middleware
    const user = req.user as JwtClaims;

    // Validate state transition to delivered
    if (!canTransition(donation.status, 'delivered', user.role)) {
      return res.status(403).json({ error: `Cannot mark as delivered from status ${donation.status} with role ${user.role}` });
    }

    // Hash the privateKey as proof (never store raw key)
    const proof = sha256(String(privateKey));

    donation.status = 'delivered';
    donation.deliveryProofHash = proof;
    if (mediaUrl) donation.mediaUrl = mediaUrl;
    await donation.save();

    // Write an HCS message (best-effort)
    try {
      const client = hederaClient();
      const topicId = client ? await ensureTopic(client) : undefined;
      const payload = {
        type: 'donation_delivered',
        donationId: donation._id.toString(),
        proof,
        mediaUrl: donation.mediaUrl,
        timestamp: new Date().toISOString(),
      };
      void writeHcsMessage(client, topicId, payload).catch(() => {});
    } catch {}

    res.status(200).json({ ok: true, status: donation.status });
  } catch (err) {
    next(err);
  }
});

// DELETE /donations/:id - Delete a donation (admin/donor only in production)
router.delete('/:id', async (req, res, next) => {
  try {
    const donation = await DonationModel.findByIdAndDelete(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;


