import Node from '@/modules/projects/nodes/node.model';
import { INode } from '@/types';
import { FilterQuery, ObjectId } from 'mongoose';
const updateOptions = { new: true, runValidators: true };

interface FlatNode {
  _id: ObjectId;
  parentId: ObjectId | null;
  children: ObjectId[];
  title: string;
  type: 'file' | 'folder';
  content?: string;
}

export const nodeRepository = {
  findNodes: (email: string) => Node.find({ email }),

  findNodeByProject: (projectId: string) => Node.find({ projectId, parentId: null }).populate('children'),

  create: (data: { projectId: string; parentId: string | null | undefined; workspaceId: string; type: string; title: string }) => new Node(data).save(),

  findOne: (data: { _id?: string }) => Node.findOne(data),

  findConflict: (
    params: FilterQuery<{
      projectId: string;
      parentId: string | null;
      title: string;
      type: 'file' | 'folder';
    }>
  ) => Node.findOne(params).collation({ locale: 'en', strength: 2 }),

  updateOne: (dataToFind: { _id: string }, dataToUpdate: Partial<INode>): Promise<INode | null> =>
    Node.findOneAndUpdate(dataToFind, dataToUpdate, updateOptions).lean<INode>().exec(),

  deleteOne: (dataToFind: { _id: string }): Promise<INode | null> => Node.findOneAndDelete(dataToFind).lean<INode>().exec(),

  pushChild(parentId: string, childId: string): Promise<INode | null> {
    return Node.findByIdAndUpdate(parentId, { $push: { children: childId } }, updateOptions)
      .lean<INode>()
      .exec();
  },

  pullChild(data: { _id: string; userId: string; projectId: string }, childs: string[]): Promise<INode | null> {
    return Node.findOneAndUpdate(data, { $pull: { children: { $in: childs } } }, updateOptions)
      .lean<INode>()
      .exec();
  },

  archiveById(nodeId: string, data: Partial<INode>): Promise<INode | null> {
    return Node.findByIdAndUpdate(
      nodeId,
      {
        $set: { archived: data.archived },
      },
      updateOptions
    )
      .lean<INode>()
      .exec();
  },

  retrieveById(nodeId: string): Promise<INode | null> {
    return Node.findByIdAndUpdate(
      nodeId,
      {
        $set: { archived: { isArchived: false, archivedAt: null, archivedBy: null } },
      },
      updateOptions
    )
      .lean<INode>()
      .exec();
  },

  findArchivedNodesByUserId(userId: string) {
    return Node.find({ userId, 'archived.isArchived': true }).populate('archived.archivedBy').exec();
  },

  deleteMany: (userId: string, nodeIds: string[]) => Node.deleteMany({ _id: { $in: nodeIds }, userId: userId }),

  findMany: (data: { projectId: string }) => Node.find(data).lean<FlatNode[]>().exec(),
};
