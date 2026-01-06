import Node from '@/modules/projects/nodes/node.model';
import { CreateNodeDTO, INode } from '@/types';
const updateOptions = { new: true, runValidators: true };

export const nodeRepository = {
  findNodes: (email: string) => Node.find({ email }),

  findNodeByProject: (projectId: string) =>
    Node.find({ projectId, parentId: null }).populate('children'),

  create: (data: CreateNodeDTO) => new Node(data).save(),

  findNode: (id: string) => Node.findById(id).populate('children'),

  findNodesByParentId: (parentId: string | null) => Node.find({ parentId }).populate('children'),

  updateById: (nodeId: string, data: Partial<INode>): Promise<INode | null> =>
    Node.findOneAndUpdate({ _id: nodeId }, data, updateOptions).lean<INode>().exec(),

  pushChild(parentId: string, childId: string): Promise<INode | null> {
    return Node.findByIdAndUpdate(parentId, { $push: { children: childId } }, updateOptions)
      .lean<INode>()
      .exec();
  },

  pullChild(
    data: { _id: string; userId: string; projectId: string },
    childs: string[]
  ): Promise<INode | null> {
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
    return Node.find({ userId, 'archived.isArchived': true })
      .populate('archived.archivedBy')
      .exec();
  },

  deleteMany: (userId: string, nodeIds: string[]) =>
    Node.deleteMany({ _id: { $in: nodeIds }, userId: userId }),
};
