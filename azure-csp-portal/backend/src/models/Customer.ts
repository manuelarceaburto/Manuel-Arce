import mongoose, { Schema, Document } from 'mongoose';

export interface IAzureSubscription {
  subscription_id: string;
  name: string;
  state: string;
}

export interface ICustomer extends Document {
  name: string;
  tenant_id: string;
  status: 'active' | 'inactive' | 'suspended';
  azure_subscriptions: IAzureSubscription[];
  created_at: Date;
  updated_at: Date;
}

const AzureSubscriptionSchema = new Schema({
  subscription_id: { type: String, required: true },
  name: { type: String, required: true },
  state: { type: String, required: true },
});

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    tenant_id: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    azure_subscriptions: [AzureSubscriptionSchema],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
