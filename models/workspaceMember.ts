import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IWorkspaceMemberSchema extends Document {
  workspaceId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  role: string;
}

const workspaceMemberSchema = new Schema<IWorkspaceMemberSchema>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    userId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    role: { type: String, enum: ['owner', 'member'], default: 'user' }, // maybe i can do a viewer here soon
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const WorkspaceMember =
  models.WorkspaceMember || model<IWorkspaceMemberSchema>('WorkspaceMember', workspaceMemberSchema);
export default WorkspaceMember;
