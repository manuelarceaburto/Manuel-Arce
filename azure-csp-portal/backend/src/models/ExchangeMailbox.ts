import mongoose, { Schema, Document } from 'mongoose';

export interface IExchangeMailbox extends Document {
  email: string;
  size_gb: number;
  item_count: number;
  archive_enabled: boolean;
  customer_id: string;
  created_at: Date;
  updated_at: Date;
}

const ExchangeMailboxSchema = new Schema(
  {
    email: { type: String, required: true },
    size_gb: { type: Number, default: 0 },
    item_count: { type: Number, default: 0 },
    archive_enabled: { type: Boolean, default: false },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

ExchangeMailboxSchema.index({ customer_id: 1 });

export default mongoose.model<IExchangeMailbox>('ExchangeMailbox', ExchangeMailboxSchema);
