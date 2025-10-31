import mongoose, { Schema, InferSchemaType } from 'mongoose';

const CollateralAssetSchema = new Schema(
  {
    symbol: { type: String, required: true, unique: true },
    tokenId: { type: String, default: null }, // Hedera HTS token id if applicable
    valueUSDPerUnit: { type: Number, required: true }, // static valuation for MVP/demo
    minCollateralRatio: { type: Number, default: 1.5 }, // e.g., 150%
    decimals: { type: Number, default: 8 },
    enabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export type CollateralAsset = InferSchemaType<typeof CollateralAssetSchema> & { _id: mongoose.Types.ObjectId };

export const CollateralAssetModel = mongoose.models.CollateralAsset || mongoose.model('CollateralAsset', CollateralAssetSchema);
