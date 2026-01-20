import { HttpError } from '@/utils/errors';
import { nodeRepository } from '@/modules/projects/nodes/node.repository';
import { ObjectId } from 'mongoose';
import { projectService } from '../project.service';
import { ensureWorkspaceMember } from '@/modules/workspaces/workspace.context';
import { ensureProjectMember } from '../project.context';

interface FlatNode {
  _id: ObjectId;
  parentId: ObjectId | null;
  children: ObjectId[];
  title: string;
  type: 'file' | 'folder';
  content?: string;
}

export interface TreeNode extends Omit<FlatNode, 'children'> {
  children: TreeNode[];
}

/**
 * Recursively sorts a tree structure:
 * 1. Folders before Files
 * 2. Alphabetical (Case-Insensitive) within the same type
 */
export function sortNodeTree(nodes: TreeNode[]): TreeNode[] {
  const sortFn = (a: TreeNode, b: TreeNode) => {
    // Folders first logic
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;

    // Alphabetical secondary sort
    return a.title.localeCompare(b.title, undefined, {
      sensitivity: 'base',
      numeric: true,
    });
  };

  // Sort the current level
  nodes.sort(sortFn);

  // Recursively sort children
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      sortNodeTree(node.children);
    }
  }

  return nodes;
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
  if (existingNode) throw new HttpError('CONFLICT', `A ${type} named "${title}" already exists`);
}

export const nodeService = {
  getProjectNodeTree: async (projectId: string): Promise<{ nodes: TreeNode[] }> => {
    const flatNodes = await nodeRepository.findMany({ projectId });
    const nodes = buildTree(flatNodes);
    const sortedTree = sortNodeTree(nodes);
    return { nodes: sortedTree };
  },

  create: async (
    email: string,
    data: {
      projectId: string;
      parentId: string | null;
      type: 'file' | 'folder';
      title: string;
    }
  ) => {
    const resP = await projectService.findProject(email, data.projectId);
    await checkNodeExistence(data);
    return await nodeRepository.create({ ...data, workspaceId: resP.project.workspaceId });
  },

  update: async (id: string, data: { title?: string; content?: string }) => {
    const node = await nodeRepository.findOne({ _id: id });
    if (!node) throw new HttpError('NOT_FOUND', 'Node not found');
    if (data.title) await checkNodeExistence({ ...node, title: data.title });

    return await nodeRepository.updateOne({ _id: id }, data);
  },

  delete: async (id: string, email: string) => {
    const node = await nodeRepository.findOne({ _id: id });
    if (!node) throw new HttpError('NOT_FOUND', 'Node not found');
    console.log('node', node);
    await Promise.all([
      ensureWorkspaceMember(node.workspaceId, email), // wCtx
      ensureProjectMember(node.projectId, email), // pCtx
    ]);

    return await nodeRepository.deleteOne({ _id: id });
  },
};
