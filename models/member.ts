import { Schema, model, models, Document } from 'mongoose';

export interface IMember extends Document {
  projectId: Schema.Types.ObjectId;
  invitedBy: Schema.Types.ObjectId;
  inviting: Schema.Types.ObjectId;
  email: string;
  status?: string;
}

const memberSchema = new Schema<IMember>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    inviting: { type: Schema.Types.ObjectId, ref: 'User', default: null },

    email: { type: String },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'leave'],
      default: 'pending',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Member = models.Member || model<IMember>('Member', memberSchema);
