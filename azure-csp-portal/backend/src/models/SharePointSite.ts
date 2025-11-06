import mongoose, { Schema, Document } from 'mongoose';

export interface ISharePointSite extends Document {
  url: string;
  storage_used: number;
  owner: string;
  activity_score: number;
  customer_id: string;
  created_at: Date;
  updated_at: Date;
}

const SharePointSiteSchema = new Schema(
  {
    url: { type: String, required: true },
    storage_used: { type: Number, default: 0 },
    owner: { type: String, required: true },
    activity_score: { type: Number, default: 0 },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

SharePointSiteSchema.index({ customer_id: 1 });

export default mongoose.model<ISharePointSite>('SharePointSite', SharePointSiteSchema);
