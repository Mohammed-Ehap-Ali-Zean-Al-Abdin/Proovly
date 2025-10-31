import mongoose, { Schema, InferSchemaType } from 'mongoose';

const PositionSchema = new Schema(
  {
    userId: { type: String, required: true },
    collateralSymbol: { type: String, required: true },
    collateralAmount: { type: Number, default: 0 },
    debtOFD: { type: Number, default: 0 },
    status: { type: String, enum: ['open', 'closed'], default: 'open' }
  },
  { timestamps: true }
);

export type Position = InferSchemaType<typeof PositionSchema> & { _id: mongoose.Types.ObjectId };

export const PositionModel = mongoose.models.Position || mongoose.model('Position', PositionSchema);
