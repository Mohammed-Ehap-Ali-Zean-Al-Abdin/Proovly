import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { CollateralAssetModel, CollateralAsset } from '../models/CollateralAsset.js';
import { PositionModel } from '../models/Position.js';

const router = Router();

function calcCR(collateralAmount: number, valueUSDPerUnit: number, debtOFD: number): number {
  if (debtOFD <= 0) return Infinity;
  return (collateralAmount * valueUSDPerUnit) / debtOFD;
}

router.post('/', requireAuth(['donor', 'ngo', 'admin']), async (req, res, next) => {
  try {
    const { userId, collateralSymbol } = req.body || {};
    if (!userId || !collateralSymbol) return res.status(400).json({ error: 'userId and collateralSymbol required' });
    const asset = await CollateralAssetModel.findOne({ symbol: collateralSymbol, enabled: true }).lean();
    if (!asset) return res.status(404).json({ error: 'Collateral asset not found' });
    const pos = await PositionModel.create({ userId, collateralSymbol, collateralAmount: 0, debtOFD: 0 });
    res.status(201).json({ positionId: pos._id.toString() });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireAuth(['donor', 'ngo', 'admin']), async (req, res, next) => {
  try {
    const posDoc = await PositionModel.findById(req.params.id);
    if (!posDoc) return res.status(404).json({ error: 'Not found' });
    const pos = posDoc.toObject();
    const asset = (await CollateralAssetModel.findOne({ symbol: pos.collateralSymbol, enabled: true }).lean()) as CollateralAsset | null;
    const cr = asset ? calcCR(pos.collateralAmount, asset.valueUSDPerUnit, pos.debtOFD) : null;
    res.json({ ...pos, collateralRatio: cr });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/deposit', requireAuth(['donor', 'ngo', 'admin']), async (req, res, next) => {
  try {
    const { amount } = req.body || {};
    if (!amount || amount <= 0) return res.status(400).json({ error: 'amount required' });
  const pos = await PositionModel.findById(req.params.id);
    if (!pos) return res.status(404).json({ error: 'Not found' });
    pos.collateralAmount += Number(amount);
    await pos.save();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/mint', requireAuth(['donor', 'ngo', 'admin']), async (req, res, next) => {
  try {
    const { amount } = req.body || {};
    if (!amount || amount <= 0) return res.status(400).json({ error: 'amount required' });
    const pos = await PositionModel.findById(req.params.id);
    if (!pos) return res.status(404).json({ error: 'Not found' });
  const asset = (await CollateralAssetModel.findOne({ symbol: pos.collateralSymbol, enabled: true }).lean()) as CollateralAsset | null;
    if (!asset) return res.status(404).json({ error: 'Collateral asset not found' });
    const newDebt = pos.debtOFD + Number(amount);
    const newCR = calcCR(pos.collateralAmount, asset.valueUSDPerUnit, newDebt);
    if (newCR < asset.minCollateralRatio) {
      return res.status(400).json({ error: 'would fall below min collateral ratio' });
    }
    pos.debtOFD = newDebt;
    await pos.save();
    res.json({ ok: true, debtOFD: pos.debtOFD, collateralRatio: newCR });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/repay', requireAuth(['donor', 'ngo', 'admin']), async (req, res, next) => {
  try {
    const { amount } = req.body || {};
    if (!amount || amount <= 0) return res.status(400).json({ error: 'amount required' });
    const pos = await PositionModel.findById(req.params.id);
    if (!pos) return res.status(404).json({ error: 'Not found' });
    pos.debtOFD = Math.max(0, pos.debtOFD - Number(amount));
    await pos.save();
    res.json({ ok: true, debtOFD: pos.debtOFD });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/withdraw', requireAuth(['donor', 'ngo', 'admin']), async (req, res, next) => {
  try {
    const { amount } = req.body || {};
    if (!amount || amount <= 0) return res.status(400).json({ error: 'amount required' });
    const pos = await PositionModel.findById(req.params.id);
    if (!pos) return res.status(404).json({ error: 'Not found' });
  const asset = (await CollateralAssetModel.findOne({ symbol: pos.collateralSymbol, enabled: true }).lean()) as CollateralAsset | null;
    if (!asset) return res.status(404).json({ error: 'Collateral asset not found' });
    if (pos.collateralAmount < amount) return res.status(400).json({ error: 'insufficient collateral' });
    const newCollateral = pos.collateralAmount - Number(amount);
    const newCR = calcCR(newCollateral, asset.valueUSDPerUnit, pos.debtOFD);
    if (pos.debtOFD > 0 && newCR < asset.minCollateralRatio) {
      return res.status(400).json({ error: 'would fall below min collateral ratio' });
    }
    pos.collateralAmount = newCollateral;
    await pos.save();
    res.json({ ok: true, collateralAmount: pos.collateralAmount, collateralRatio: newCR });
  } catch (err) {
    next(err);
  }
});

export default router;
