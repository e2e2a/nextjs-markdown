import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IWorkspaceMemberSchema extends Document {
  workspaceId: mongoose.Schema.Types.ObjectId;
  invitedBy: string;
  email: string;
  userId: mongoose.Schema.Types.ObjectId;
  role: 'owner' | 'editor' | 'viewer';
  status: 'pending' | 'accepted';
}

const workspaceMemberSchema = new Schema<IWorkspaceMemberSchema>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    invitedBy: { type: String },

    email: { type: String },
    role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'editor' },

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
