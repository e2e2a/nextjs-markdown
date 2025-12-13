import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IProject extends Document {
  workspaceId: mongoose.Schema.Types.ObjectId;
  title: string;
  // nodes: (Schema.Types.ObjectId | INode)[];
  createdBy: mongoose.Schema.Types.ObjectId;

  archived: {
    by: string;
    at: Date;
    reason: mongoose.Schema.Types.ObjectId;
  } | null;
}

const projectSchema = new Schema<IProject>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

    // nodes: [{ type: Schema.Types.ObjectId, ref: 'Node' }],
    archived: {
      by: { type: Schema.Types.ObjectId, ref: 'User' },
      at: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Project = models.Project || model<IProject>('Project', projectSchema);
export default Project;
