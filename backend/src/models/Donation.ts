import mongoose, { Schema, InferSchemaType } from 'mongoose';

const DonationSchema = new Schema(
  {
    donorId: { type: String, required: true },
    campaignId: { type: String, required: true },
    amountUSD: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'OFD', 'HBAR'], default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'funded', 'assigned', 'delivered'],
      default: 'pending'
    },
    recipientId: { type: String, default: null },
    hederaHcsTxId: { type: String, default: null },
    htsTxId: { type: String, default: null },
    mediaUrl: { type: String, default: null },
    deliveryProofHash: { type: String, default: null }
  },
  { timestamps: true }
);

export type Donation = InferSchemaType<typeof DonationSchema> & { _id: mongoose.Types.ObjectId };

export const DonationModel = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);


