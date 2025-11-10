import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface INode extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  projectId: mongoose.Schema.Types.ObjectId;
  parentId?: mongoose.Schema.Types.ObjectId | null;
  type: string;
  children: (Schema.Types.ObjectId | INode)[];
  title?: string;
  content: string;
  archived: {
    isArchived: boolean;
    archivedAt?: Date;
    archivedBy?: mongoose.Schema.Types.ObjectId;
  };
}

const nodeSchema = new Schema<INode>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    parentId: { type: Schema.Types.ObjectId, ref: 'Node', default: null },
    type: { type: String, enum: ['file', 'folder'] },
    children: [{ type: Schema.Types.ObjectId, ref: 'Node', default: null }],
    title: { type: String },
    content: { type: String },
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

const Node = models.Node || model<INode>('Node', nodeSchema);
export default Node;
