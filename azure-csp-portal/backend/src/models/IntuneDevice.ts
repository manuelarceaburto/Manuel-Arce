import mongoose, { Schema, Document } from 'mongoose';

export interface IIntuneDevice extends Document {
  device_name: string;
  os: string;
  compliance_status: 'compliant' | 'non-compliant' | 'unknown';
  last_sync: Date;
  customer_id: string;
  created_at: Date;
  updated_at: Date;
}

const IntuneDeviceSchema = new Schema(
  {
    device_name: { type: String, required: true },
    os: { type: String, required: true },
    compliance_status: {
      type: String,
      enum: ['compliant', 'non-compliant', 'unknown'],
      default: 'unknown',
    },
    last_sync: { type: Date },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

IntuneDeviceSchema.index({ customer_id: 1 });

export default mongoose.model<IIntuneDevice>('IntuneDevice', IntuneDeviceSchema);
