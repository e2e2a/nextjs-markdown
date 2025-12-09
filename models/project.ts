import mongoose, { Schema, models, model, Document } from 'mongoose';
import { INode } from './node';

export interface IProject extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  workspaceId: mongoose.Schema.Types.ObjectId;
  title: string;
  nodes: (Schema.Types.ObjectId | INode)[];
  archived: {
    isArchived: boolean;
    archivedAt?: Date;
    archivedBy?: mongoose.Schema.Types.ObjectId;
  };
}

const projectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    // nodes: [{ type: Schema.Types.ObjectId, ref: 'Node' }],
    archived: {
      isArchived: { type: Boolean, default: false },
      archivedAt: Date,
      archivedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Project = models.Project || model<IProject>('Project', projectSchema);
export default Project;
