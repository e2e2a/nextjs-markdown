import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IWorkspaceMemberSchema extends Document {
  workspaceId: mongoose.Schema.Types.ObjectId;
  invitedBy: Schema.Types.ObjectId;
  email: string;
  userId: mongoose.Schema.Types.ObjectId;
  role: 'owner' | 'member' | 'viewer';
  status: 'pending' | 'accepted';
}

const workspaceMemberSchema = new Schema<IWorkspaceMemberSchema>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    email: { type: String },
    role: { type: String, enum: ['owner', 'member', 'viewer'] },

    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'pending',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const WorkspaceMember =
  models.WorkspaceMember || model<IWorkspaceMemberSchema>('WorkspaceMember', workspaceMemberSchema);
export default WorkspaceMember;
