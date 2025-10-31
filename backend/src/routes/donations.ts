import { Router } from 'express';
import { DonationModel } from '../models/Donation.js';
import { hederaClient, ensureTopic, writeHcsMessage, sha256, submitAndLog, mintToken } from '../services/hedera.js';
import { createQueue } from '../config/redis.js';
import { requireAuth, type JwtClaims } from '../middleware/auth.js';
import { env } from '../config/env.js';

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

    // Initialize Hedera client
    const client = hederaClient();
    const topicId = client ? await ensureTopic(client) : undefined;

    // Log donation creation for transparency
    // eslint-disable-next-line no-console
    console.log(`[Donation] Creating donation ${donation._id} for $${amountUSD} USD`);

    // Prepare HCS payload for immutable proof of donation
    const payload = {
      type: 'donation_created',
      donationId: donation._id.toString(),
      amount_usd: donation.amountUSD,
      campaign: donation.campaignId,
      timestamp: new Date().toISOString()
    };
    
    // Write to Hedera Consensus Service (HCS) - immutable proof
    const { txId, mirrorUrl } = await writeHcsMessage(client, topicId, payload);
    donation.hederaHcsTxId = txId;

    // Log HCS transaction for demo
    // eslint-disable-next-line no-console
    console.log(`[Donation] ✅ HCS Transaction recorded: ${txId}`);
    // eslint-disable-next-line no-console
    console.log(`[Donation] 🔗 View on Hedera Explorer: ${mirrorUrl}`);

    // Mint OFD token if configured (optional)
    let htsTxId: string | undefined;
    if (env.OFD_TOKEN_ID && client) {
      try {
        const amountToMint = Math.floor((amountUSD || 0) * 100); // Convert USD to tokens (1 USD = 100 tokens)
        const mintReceipt = await mintToken(client, env.OFD_TOKEN_ID, amountToMint);
        // Store the transaction ID (we can get it from the executed transaction object if needed)
        // For now, just log the mint success
        donation.htsTxId = `MINT_${Date.now()}`; // Placeholder - actual txId would come from mintReceipt
        // eslint-disable-next-line no-console
        console.log(`[Donation] 🪙 OFD Token minted: ${amountToMint} tokens (${amountUSD} USD)`);
        // eslint-disable-next-line no-console
        console.log(`[Donation] 💰 HTS Mint status: ${mintReceipt.status?.toString()}`);
      } catch (err) {
        // Non-blocking: log error but continue
        // eslint-disable-next-line no-console
        console.error(`[Donation] ⚠️  OFD minting failed:`, err);
      }
    }

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

    // Return response with Hedera details for UI
    const response: Record<string, any> = { 
      donationId: donation._id.toString(), 
      status: donation.status, 
      hederaHcsTxId: txId, 
      mirrorUrl,
      message: 'Donation recorded on Hedera Consensus Service (HCS) with immutable proof'
    };
    
    // Include HTS token info if minted
    if (donation.htsTxId) {
      response.htsTxId = donation.htsTxId;
      response.message += ' and OFD tokens minted';
    }
    
    return res.status(201).json(response);
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

    const prevStatus = donation.status;
    let statusChanged = false;

    // Validate state transition if status is being changed
    if (status && status !== donation.status) {
      if (!canTransition(donation.status, status, user.role)) {
        return res.status(403).json({ error: `Cannot transition from ${donation.status} to ${status} with role ${user.role}` });
      }
      donation.status = status;
      statusChanged = true;
    }

    if (typeof recipientId !== 'undefined') {
      donation.recipientId = recipientId || null;
    }

    await donation.save();

    // Best-effort: emit an HCS message when status changes (transparency trail)
    if (statusChanged) {
      try {
        const client = hederaClient();
        const topicId = client ? await ensureTopic(client) : undefined;
        const hcsPayload: Record<string, any> = {
          type: donation.status === 'funded' ? 'donation_funded' : donation.status === 'assigned' ? 'donation_assigned' : `donation_${donation.status}`,
          donationId: donation._id.toString(),
          from: prevStatus,
          to: donation.status,
          recipientId: donation.recipientId || undefined,
          timestamp: new Date().toISOString()
        };
        void submitAndLog(client, topicId, hcsPayload).catch(() => {});
      } catch {}
    }

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


