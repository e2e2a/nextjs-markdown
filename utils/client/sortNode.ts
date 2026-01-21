// 'use server';
import { INode } from '@/types';

export function sortNodeTree(nodes: INode[]): INode[] {
  const sortFn = (a: INode, b: INode) => {
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
