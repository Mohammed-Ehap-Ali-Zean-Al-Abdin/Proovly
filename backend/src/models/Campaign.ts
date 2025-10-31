import mongoose, { Schema, InferSchemaType } from 'mongoose';

const CampaignSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    region: { type: String, required: true },
    goalUSD: { type: Number, default: 0 },
    raisedUSD: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export type Campaign = InferSchemaType<typeof CampaignSchema> & { _id: mongoose.Types.ObjectId };

export const CampaignModel = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);


