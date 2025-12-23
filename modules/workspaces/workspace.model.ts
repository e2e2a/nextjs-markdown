import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IWorkspaceSchema extends Document {
  ownerUserId: mongoose.Schema.Types.ObjectId;
  title: string;
  archived: {
    by: string;
    at: Date;
    reason: mongoose.Schema.Types.ObjectId;
  } | null;
}

const workspaceSchema = new Schema<IWorkspaceSchema>(
  {
    ownerUserId: { type: Schema.Types.ObjectId, ref: 'User' }, // this will be change to email: string in future for feature delete user
    title: { type: String },
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

const Workspace = models.Workspace || model<IWorkspaceSchema>('Workspace', workspaceSchema);
export default Workspace;
