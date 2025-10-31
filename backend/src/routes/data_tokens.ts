import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { hederaClient, createNftToken, mintNft } from '../services/hedera.js';

const router = Router();

router.post('/', requireAuth(['admin']), async (req, res, next) => {
  try {
    const { name, symbol, metadataUri } = req.body || {};
    if (!name || !symbol || !metadataUri) return res.status(400).json({ error: 'name, symbol, metadataUri required' });
    const client = hederaClient();
    if (!client) {
      return res.status(201).json({ tokenId: `mock-${Date.now()}`, simulated: true });
    }
    const tokenId = await createNftToken(client, name, symbol);
    if (!tokenId) return res.status(500).json({ error: 'token creation failed' });
    const meta = Buffer.from(JSON.stringify({ uri: metadataUri }));
    await mintNft(client, tokenId, [meta]);
    res.status(201).json({ tokenId, simulated: false });
  } catch (err) {
    next(err);
  }
});

export default router;
