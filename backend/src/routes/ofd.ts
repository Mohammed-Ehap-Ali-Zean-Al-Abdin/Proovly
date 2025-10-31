import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { hederaClient, mintToken, transferToken } from '../services/hedera.js';

const router = Router();

router.post('/mint', requireAuth(['admin']), async (req, res, next) => {
  try {
    const { tokenId, amount } = req.body || {};
    if (!tokenId || !amount) return res.status(400).json({ error: 'tokenId and amount required' });
    const client = hederaClient();
    if (!client) return res.status(503).json({ error: 'Hedera not configured' });
    const receipt = await mintToken(client, tokenId, Number(amount));
    res.json({ status: receipt.status?.toString?.() || 'SUCCESS', tokenId });
  } catch (err) {
    next(err);
  }
});

router.post('/transfer', requireAuth(['admin']), async (req, res, next) => {
  try {
    const { tokenId, fromAccount, toAccount, amount } = req.body || {};
    if (!tokenId || !fromAccount || !toAccount || !amount) return res.status(400).json({ error: 'Missing fields' });
    const client = hederaClient();
    if (!client) return res.status(503).json({ error: 'Hedera not configured' });
    const receipt = await transferToken(client, tokenId, fromAccount, toAccount, Number(amount));
    res.json({ status: receipt.status?.toString?.() || 'SUCCESS' });
  } catch (err) {
    next(err);
  }
});

export default router;


