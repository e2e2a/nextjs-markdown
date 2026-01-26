import { useTabStore } from '@/features/editor/stores/tabs';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { INode } from '@/types';

export const fileActions = {
  openFile(projectId: string, node: INode, isPreview = false) {
    if (node.type !== 'file') return;

    const tabStore = useTabStore.getState();
    const nodeStore = useNodeStore.getState();

    // 1️⃣ Open or focus tab
    tabStore.openTab(projectId, node, isPreview);

    // 2️⃣ Set active editor
    nodeStore.setActiveNode(node);
  },

  closeFile(projectId: string, nodeId: string) {
    const tabStore = useTabStore.getState();
    const nodeStore = useNodeStore.getState();

    const tabs = tabStore.projectTabs[projectId] || [];
    const index = tabs.findIndex(t => t.nodeId === nodeId);
    if (index === -1) return;

    const activeTabId = tabStore.activeTabs[projectId];

    // 1️⃣ Close tab
    tabStore.closeTab(projectId, nodeId);

    // 2️⃣ If we closed the active one → activate neighbor
    if (activeTabId === nodeId) {
      const nextTab = tabs[index - 1] ?? tabs[index + 1] ?? null;

      if (nextTab) {
        nodeStore.setActiveNodeById(nextTab.nodeId);
      } else {
        nodeStore.clearActiveNode();
      }
    }
  },
};
