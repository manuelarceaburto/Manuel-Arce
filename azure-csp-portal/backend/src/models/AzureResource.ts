import mongoose, { Schema, Document } from 'mongoose';

export interface IAzureResource extends Document {
  resource_id: string;
  name: string;
  type: string;
  region: string;
  resource_group: string;
  status: 'running' | 'stopped' | 'deallocated';
  monthly_cost: number;
  tags: Record<string, string>;
  customer_id: string;
  subscription_id: string;
  created_at: Date;
  updated_at: Date;
}

const AzureResourceSchema = new Schema(
  {
    resource_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    region: { type: String, required: true },
    resource_group: { type: String, required: true },
    status: {
      type: String,
      enum: ['running', 'stopped', 'deallocated'],
      default: 'running',
    },
    monthly_cost: { type: Number, default: 0 },
    tags: { type: Map, of: String, default: {} },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    subscription_id: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Indexes for efficient queries
AzureResourceSchema.index({ customer_id: 1 });
AzureResourceSchema.index({ type: 1 });
AzureResourceSchema.index({ region: 1 });
AzureResourceSchema.index({ status: 1 });

export default mongoose.model<IAzureResource>('AzureResource', AzureResourceSchema);
