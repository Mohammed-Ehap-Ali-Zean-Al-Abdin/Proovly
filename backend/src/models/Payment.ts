import mongoose, { Schema, InferSchemaType } from 'mongoose';

const PaymentSchema = new Schema(
  {
    fromUserId: { type: String, required: true },
    toUserId: { type: String, required: true },
    amountOFD: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'settled', 'failed'], default: 'settled' },
    hederaTxId: { type: String, default: null }
  },
  { timestamps: true }
);

export type Payment = InferSchemaType<typeof PaymentSchema> & { _id: mongoose.Types.ObjectId };

export const PaymentModel = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
