import { flattenNodeTree } from '@/utils/client/node-utils';
import { INode } from '@/types';
import { useNodeStore } from '@/features/editor/stores/nodes';

let cachedFlatNodes: INode[] = [];
const cachedSearchIndex: Map<string, string> = new Map();

export const getCachedNodes = () => cachedFlatNodes;
export const getSearchIndex = () => cachedSearchIndex;

export function rebuildNodeCache(nodes: INode[]) {
  const flat = flattenNodeTree(nodes);
  cachedFlatNodes = flat;
  cachedSearchIndex.clear();
  for (const n of flat) {
    cachedSearchIndex.set(n._id, `${n.title} ${n.path ?? ''}`.toLowerCase());
  }
}

// Subscribe to Zustand changes
rebuildNodeCache(useNodeStore.getState().nodes ?? []);
useNodeStore.subscribe(() => {
  const nodes = useNodeStore.getState().nodes;
  if (nodes) rebuildNodeCache(nodes);
});

export function extractHeadings(content: string): { level: number; text: string }[] {
  const regex = /^(#{1,6})\s+(.+)$/gm;
  const result: { level: number; text: string }[] = [];
  let match;

  while ((match = regex.exec(content))) {
    result.push({ level: match[1].length, text: match[2].trim() });
  }

  return result;
}
