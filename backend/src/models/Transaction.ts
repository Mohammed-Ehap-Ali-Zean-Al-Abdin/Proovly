import mongoose, { Schema, InferSchemaType } from 'mongoose';

const TransactionSchema = new Schema(
  {
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export type Transaction = InferSchemaType<typeof TransactionSchema> & { _id: mongoose.Types.ObjectId };

export const TransactionModel = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
