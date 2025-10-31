import mongoose, { Schema, InferSchemaType } from 'mongoose';

const HedTxLogSchema = new Schema(
  {
    type: { type: String, required: true },
    payloadHash: { type: String, required: true },
    hederaTxId: { type: String, required: true },
    mirrorUrl: { type: String, required: true }
  },
  { timestamps: true }
);

export type HedTxLog = InferSchemaType<typeof HedTxLogSchema> & { _id: mongoose.Types.ObjectId };

export const HedTxLogModel = mongoose.models.HedTxLog || mongoose.model('HedTxLog', HedTxLogSchema);


