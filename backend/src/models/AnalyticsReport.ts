import mongoose, { Schema, InferSchemaType } from 'mongoose';

const AnalyticsReportSchema = new Schema(
  {
    name: { type: String, required: true },
    params: { type: Schema.Types.Mixed, default: {} },
    result: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export type AnalyticsReport = InferSchemaType<typeof AnalyticsReportSchema> & { _id: mongoose.Types.ObjectId };

export const AnalyticsReportModel = mongoose.models.AnalyticsReport || mongoose.model('AnalyticsReport', AnalyticsReportSchema);
