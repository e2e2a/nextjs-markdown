import { flattenNodeTree } from '@/utils/client/node-utils';
import { INode } from '@/types';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { normalizePath, parseLinkTarget, resolveRelativePath } from './parse-link';
import { useTabStore } from '@/features/editor/stores/tabs';

export function openRelativeFile(link: string) {
  const nodeState = useNodeStore.getState();
  const { openTab } = useTabStore.getState();
  const currentNode = nodeState.activeNode;

  if (!currentNode) return;

  const { filePath, heading } = parseLinkTarget(link, currentNode.path!);
  const resolved = resolveRelativePath(currentNode.path!, filePath);
  const nodes = flattenNodeTree(nodeState.nodes);
  const targetNode = nodes.find((n: INode) => normalizePath(n.path!) === normalizePath(resolved));

  if (!targetNode) return;
  if (heading) nodeState.setPendingScrollHeading(heading);

  nodeState.setActiveNode(targetNode._id);
  openTab(targetNode.projectId, targetNode, true);
}

export function handleInternalLink(path: string) {
  const nodeState = useNodeStore.getState();
  const { openTab } = useTabStore.getState();

  const nodes = flattenNodeTree(nodeState.nodes);

  const targetNode = nodes.find((n: INode) => normalizePath(n.path!) === normalizePath(path));
  if (!targetNode) return;

  nodeState.setActiveNode(targetNode._id);
  openTab(targetNode.projectId, targetNode, true);
}
