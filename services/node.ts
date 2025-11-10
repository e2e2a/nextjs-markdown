import { HttpError } from '@/lib/error';
import { nodeRepository } from '@/repositories/node';
import { CreateNodeDTO, INode } from '@/types';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const checkExistence = async (data: {
  projectId: string;
  parentId: string;
  type: string;
  title: string;
}) => {
  let exists;

  if (data.parentId) {
    const node = await nodeRepository.findNode(data.parentId);
    exists = node.children.some(
      (child: INode) =>
        child.title?.toLowerCase() === data.title?.toLowerCase() &&
        data.type.toLowerCase() === child.type.toLowerCase()
    );
  } else {
    const nodes = await nodeRepository.findNodeByProject(data.projectId);
    exists = nodes.some(
      (child: INode) =>
        child.title?.toLowerCase() === data.title?.toLowerCase() &&
        data.type.toLowerCase() === child.type.toLowerCase() &&
        !child.archived?.isArchived
    );
  }

  if (exists) throw new HttpError(`${capitalize(data.type)} already exists in this level.`, 409);
  return;
};

export const nodeService = {
  createNode: async (data: CreateNodeDTO) => {
    await checkExistence({
      projectId: data.projectId,
      parentId: data.parentId!,
      type: data.type!,
      title: data.title || '',
    });
    const node = await nodeRepository.create(data);
    if (node && node.parentId) await nodeRepository.pushChild(node.parentId, node._id as string);
    return node;
  },

  updateNodeById: async (id: string, data: Partial<INode>) => {
    if (data.title) {
      await checkExistence({
        projectId: data.projectId!,
        parentId: data.parentId!,
        type: data.type!,
        title: data.title,
      });
    }
    if (data.archived) return nodeRepository.archiveById(id, data);
    return nodeRepository.updateById(id, data);
  },

  findNodeByProjectId: async (projectId: string) => {
    return nodeRepository.findNodeByProject(projectId);
  },
};
