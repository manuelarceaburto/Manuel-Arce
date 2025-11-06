import mongoose, { Schema, Document } from 'mongoose';

export interface IM365User extends Document {
  email: string;
  display_name: string;
  licenses: string[];
  last_sign_in: Date;
  status: 'active' | 'inactive' | 'disabled';
  customer_id: string;
  created_at: Date;
  updated_at: Date;
}

const M365UserSchema = new Schema(
  {
    email: { type: String, required: true },
    display_name: { type: String, required: true },
    licenses: [{ type: String }],
    last_sign_in: { type: Date },
    status: {
      type: String,
      enum: ['active', 'inactive', 'disabled'],
      default: 'active',
    },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

M365UserSchema.index({ customer_id: 1 });
M365UserSchema.index({ email: 1 });

export default mongoose.model<IM365User>('M365User', M365UserSchema);
