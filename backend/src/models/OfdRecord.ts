import mongoose, { Schema, InferSchemaType } from 'mongoose';

const OfdRecordSchema = new Schema(
  {
    type: { type: String, enum: ['mint', 'transfer'], required: true },
    tokenId: { type: String, required: true },
    amount: { type: Number, required: true },
    fromAccount: { type: String, default: null },
    toAccount: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export type OfdRecord = InferSchemaType<typeof OfdRecordSchema> & { _id: mongoose.Types.ObjectId };

export const OfdRecordModel = mongoose.models.OfdRecord || mongoose.model('OfdRecord', OfdRecordSchema);
