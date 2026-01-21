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

// 🔒 Data integrity
workspaceMemberSchema.index({ workspaceId: 1, email: 1 }, { unique: true });

// 🚀 Authorization & lookups
workspaceMemberSchema.index({ workspaceId: 1, email: 1, role: 1 });
// workspaceMemberSchema.index({ email: 1, status: 1 });

const WorkspaceMember = models.WorkspaceMember || model<IWorkspaceMemberSchema>('WorkspaceMember', workspaceMemberSchema);
export default WorkspaceMember;
