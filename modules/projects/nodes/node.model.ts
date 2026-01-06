import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface INode extends Document {
  // userId: mongoose.Schema.Types.ObjectId;
  workspaceId: mongoose.Schema.Types.ObjectId;
  projectId: mongoose.Schema.Types.ObjectId;
  parentId?: mongoose.Schema.Types.ObjectId | null;
  type: string;
  children: (Schema.Types.ObjectId | INode)[];
  title?: string;
  content: string;
  archived: {
    by: string;
    at: Date;
    reason: mongoose.Schema.Types.ObjectId;
  } | null;
}

const nodeSchema = new Schema<INode>(
  {
    // userId: { type: Schema.Types.ObjectId, ref: 'User' },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Project' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    parentId: { type: Schema.Types.ObjectId, ref: 'Node', default: null },
    type: { type: String, enum: ['file', 'folder'] },
    children: [{ type: Schema.Types.ObjectId, ref: 'Node', default: null }],
    title: { type: String },
    content: { type: String },
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

const Node = models.Node || model<INode>('Node', nodeSchema);
export default Node;
