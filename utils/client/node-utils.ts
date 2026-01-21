import { INode } from '@/types';

export const groupNodes = (nodes: INode[]) => ({
  folders: nodes.filter(n => n.type === 'folder'),
  files: nodes.filter(n => n.type === 'file'),
});
