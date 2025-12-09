import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IWorkspaceSchema extends Document {
  ownerUserId: mongoose.Schema.Types.ObjectId;
  title: string;
  archived: {
    isArchived: boolean;
    archivedAt?: Date;
    archivedBy?: mongoose.Schema.Types.ObjectId;
  };
}

const workspaceSchema = new Schema<IWorkspaceSchema>(
  {
    ownerUserId: { type: Schema.Types.ObjectId, ref: 'User' }, // this will be change to email: string in future for feature delete user
    title: { type: String },
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

const Workspace = models.Workspace || model<IWorkspaceSchema>('Workspace', workspaceSchema);
export default Workspace;
