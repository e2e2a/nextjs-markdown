import { HttpError } from '@/utils/errors';
import { nodeRepository } from '@/modules/projects/nodes/node.repository';
import { CreateNodeDTO } from '@/types';
import { ObjectId } from 'mongoose';

interface FlatNode {
  _id: ObjectId;
  parentId: ObjectId | null;
  children: ObjectId[];
  title?: string;
  type: 'file' | 'folder';
  content?: string;
}

export interface TreeNode extends Omit<FlatNode, 'children'> {
  children: TreeNode[];
}

/**
 * O(n) Tree Builder
 * Uses a Map for constant-time lookups.
 * Assumes the flat array contains all nodes in the adjacency list.
 */
export function buildTree(nodes: FlatNode[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Pass 1: Initialize the map with TreeNode objects
  for (const node of nodes) {
    map.set(node._id.toString(), { ...node, children: [] });
  }

  // Pass 2: Wire up the hierarchy
  for (const node of nodes) {
    const idStr = node._id.toString();
    const currentTreeNode = map.get(idStr)!;

    if (node.parentId) {
      const parentIdStr = node.parentId.toString();
      const parent = map.get(parentIdStr);

      if (parent) {
        parent.children.push(currentTreeNode);
      } else {
        // Handle orphaned nodes as roots or throw based on your business logic
        roots.push(currentTreeNode);
      }
    } else {
      // No parentId means it's a root node
      roots.push(currentTreeNode);
    }
  }

  return roots;
}

async function checkNodeExistence(params: {
  projectId: string;
  parentId: string | null;
  title: string;
  type: 'file' | 'folder';
}) {
  const { projectId, parentId, title, type } = params;

  const existingNode = await nodeRepository.findConflict({
    projectId,
    parentId,
    title: { $regex: new RegExp(`^${title}$`, 'i') },
    type,
  });
  console.log('Existing node check:', existingNode);
  if (existingNode) throw new HttpError('CONFLICT', `A ${type} named "${title}" already exists`);
}

export const nodeService = {
  getProjectNodeTree: async (projectId: string): Promise<{ nodes: TreeNode[] }> => {
    const flatNodes = await nodeRepository.findMany({ projectId });
    const nodes = buildTree(flatNodes);
    return { nodes };
  },

  createNode: async (data: CreateNodeDTO) => {
    await checkNodeExistence({
      projectId: data.projectId,
      parentId: data.parentId!,
      type: data.type as 'file' | 'folder',
      title: data.title || '',
    });
    const node = await nodeRepository.create(data);
    if (node && node.parentId) await nodeRepository.pushChild(node.parentId, node._id as string);
    return node;
  },

  update: async (id: string, data: { title?: string; content?: string }) => {
    const node = await nodeRepository.findOne({ _id: id });
    if (!node) throw new HttpError('NOT_FOUND', 'Node not found');
    if (data.title) await checkNodeExistence({ ...node, title: data.title });

    return await nodeRepository.updateOne({ _id: id }, data);
  },

  findNodeByProjectId: async (projectId: string) => {
    return nodeRepository.findNodeByProject(projectId);
  },
};
