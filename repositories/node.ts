import Node from '@/models/node';
import { CreateNodeDTO, INode } from '@/types';

export const nodeRepository = {
  findNodes: (email: string) => Node.find({ email }),

  findNodeByProject: (projectId: string) =>
    Node.find({ projectId, parentId: null }).populate('children'),

  create: (data: CreateNodeDTO) => new Node(data).save(),

  findNode: (id: string) => Node.findById(id).populate('children'),

  findNodesByParentId: (parentId: string | null) => Node.find({ parentId }).populate('children'),

  async updateById(nodeId: string, data: Partial<INode>): Promise<INode | null> {
    const updateOptions = { new: true, runValidators: true };
    return Node.findOneAndUpdate({ _id: nodeId }, data, updateOptions).lean<INode>().exec();
  },

  pushChild(parentId: string, childId: string): Promise<INode | null> {
    return Node.findByIdAndUpdate(parentId, { $push: { children: childId } }, { new: true })
      .lean<INode>()
      .exec();
  },

  archiveById(nodeId: string, data: Partial<INode>): Promise<INode | null> {
    return Node.findByIdAndUpdate(
      nodeId,
      {
        $set: { archived: data.archived },
      },
      { new: true }
    )
      .lean<INode>()
      .exec();
  },
};
