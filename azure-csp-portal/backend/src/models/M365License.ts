import mongoose, { Schema, Document } from 'mongoose';

export interface IM365License extends Document {
  sku_id: string;
  name: string;
  assigned_count: number;
  available_count: number;
  cost: number;
  customer_id: string;
  created_at: Date;
  updated_at: Date;
}

const M365LicenseSchema = new Schema(
  {
    sku_id: { type: String, required: true },
    name: { type: String, required: true },
    assigned_count: { type: Number, default: 0 },
    available_count: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

M365LicenseSchema.index({ customer_id: 1 });

export default mongoose.model<IM365License>('M365License', M365LicenseSchema);
