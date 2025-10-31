import { Router } from 'express';
import { TransactionModel } from '../models/Transaction.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { userId, amount, currency, metadata } = req.body || {};
    if (!userId || !amount) return res.status(400).json({ error: 'userId and amount required' });
    const tx = await TransactionModel.create({ userId, amount, currency, metadata });
    res.status(201).json({ transactionId: tx._id.toString() });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const tx = await TransactionModel.findById(req.params.id).lean();
    if (!tx) return res.status(404).json({ error: 'Not found' });
    res.json(tx);
  } catch (err) {
    next(err);
  }
});

export default router;
