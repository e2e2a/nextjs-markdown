import { INode } from '@/types';

export const groupNodes = (nodes: INode[]) => ({
  folders: nodes.filter(n => n.type === 'folder'),
  files: nodes.filter(n => n.type === 'file'),
});

export function flattenNodeTree(nodes: INode[] | null): INode[] {
  let flat: INode[] = [];
  if (!nodes || nodes.length <= 0) return [];
  for (const node of nodes) {
    // Only add files to the searchable list if you're searching content,
    // or add all if you want to search folder names too.
    // Only add to the searchable list if it's a file
    if (node.type === 'file') flat.push(node);

    if (node.children && node.children.length > 0) {
      flat = flat.concat(flattenNodeTree(node.children));
    }
  }

  return flat;
}
