import { Router } from 'express';
import { OfdRecordModel } from '../models/OfdRecord.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { type, tokenId, amount, fromAccount, toAccount, metadata } = req.body || {};
    if (!type || !tokenId || !amount) return res.status(400).json({ error: 'type, tokenId, amount required' });
    const rec = await OfdRecordModel.create({ type, tokenId, amount, fromAccount, toAccount, metadata });
    res.status(201).json({ ofdRecordId: rec._id.toString() });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const rec = await OfdRecordModel.findById(req.params.id).lean();
    if (!rec) return res.status(404).json({ error: 'Not found' });
    res.json(rec);
  } catch (err) {
    next(err);
  }
});

export default router;
