import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { PaymentModel } from '../models/Payment.js';
import { env } from '../config/env.js';
import { hederaClient, transferToken } from '../services/hedera.js';

const router = Router();

// Minimal demo: simulate OFD payments; if OFD token id and hedera accounts provided, attempt transfer.
router.post('/', requireAuth(['donor', 'ngo', 'admin']), async (req, res, next) => {
  try {
  const { fromAccount, toAccount, amountOFD, ofdTokenId } = req.body || {};
    if (!amountOFD || amountOFD <= 0) return res.status(400).json({ error: 'amountOFD required' });

  let hederaTxId: string | null = null;
  const tokenId = ofdTokenId;
    const client = hederaClient();
    if (client && tokenId && fromAccount && toAccount) {
      try {
  await transferToken(client, tokenId, fromAccount, toAccount, Number(amountOFD));
  hederaTxId = null;
      } catch (_e) {
        // fall back to simulated
      }
    }

    const pay = await PaymentModel.create({ fromUserId: fromAccount || 'simulated', toUserId: toAccount || 'simulated', amountOFD, status: 'settled', hederaTxId });
    res.status(201).json({ paymentId: pay._id.toString(), hederaTxId });
  } catch (err) {
    next(err);
  }
});

export default router;
