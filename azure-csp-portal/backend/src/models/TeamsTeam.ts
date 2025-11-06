import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamsTeam extends Document {
  name: string;
  member_count: number;
  channel_count: number;
  activity: number;
  customer_id: string;
  created_at: Date;
  updated_at: Date;
}

const TeamsTeamSchema = new Schema(
  {
    name: { type: String, required: true },
    member_count: { type: Number, default: 0 },
    channel_count: { type: Number, default: 0 },
    activity: { type: Number, default: 0 },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

TeamsTeamSchema.index({ customer_id: 1 });

export default mongoose.model<ITeamsTeam>('TeamsTeam', TeamsTeamSchema);
