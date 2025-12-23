import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IProjectMemberSchema extends Document {
  workspaceId: mongoose.Schema.Types.ObjectId;
  projectId: Schema.Types.ObjectId;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
}

const projectMemberSchema = new Schema<IProjectMemberSchema>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    email: { type: String },
    role: { type: String, enum: ['owner', 'member', 'viewer'] },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const ProjectMember =
  models.ProjectMember || model<IProjectMemberSchema>('ProjectMember', projectMemberSchema);
export default ProjectMember;
