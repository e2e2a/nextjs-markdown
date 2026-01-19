import { INode } from '@/types';
import { create } from 'zustand';

function findNode(nodes: INode[], id: string): INode | null {
  for (const node of nodes) {
    if (node._id === id) return node;
    if (node.children?.length) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function removeNode(nodes: INode[], id: string): boolean {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node._id === id) {
      nodes.splice(i, 1);
      return true;
    }
    if (node.children?.length) {
      const removed = removeNode(node.children, id);
      if (removed) return true;
    }
  }
  return false;
}

function insertNode(nodes: INode[], nodeToInsert: INode, parentId: string | null) {
  if (parentId === null || parentId === 'root') {
    // insert at root
    nodes.push(nodeToInsert);
    return true;
  }

  for (const node of nodes) {
    if (node._id === parentId) {
      if (!node.children) node.children = [];
      node.children.push(nodeToInsert);
      return true;
    }
    if (node.children?.length) {
      const inserted = insertNode(node.children, nodeToInsert, parentId);
      if (inserted) return true;
    }
  }
  return false;
}

interface NodesState {
  /** Currently active file for editing */
  // activeFile: INode | null;

  /** Currently selected node (file or folder) in sidebar */
  activeDrag: INode | null;
  activeNode: INode | null;
  selectedNode: INode | null;

  nodes: INode[] | null;

  /** Currently updated node (file or folder) in sidebar */
  updatedNode: INode | null;

  /** Flags for creating/updating files */
  /**
   * function {isCreating}
   * type is used to display folder or file and parent is where the new node will be show visualy in the tree structure
   */
  isCreating: { type: 'file' | 'folder'; parentId: string | null } | null;
  isUpdatingNode: INode | null;

  /** UI flags */
  collapseAll: boolean;
  collapseVersion: number;

  setIsCreating(node: { type: 'file' | 'folder'; parentId: string | null } | null): void;
  setIsUpdatingNode(flag: INode | null): void;
  setCollapseAll(flag: boolean): void;

  setActiveDrag(node: INode | null): void;
  setSelectedNode(node: INode | null): void;
  setActiveNode(node: INode | null): void;

  setNodes(nodes: INode[] | null): void;
  moveNode(dragId: string, targetId: string): void;
  /** Utility to reset editor state */
  resetEditor(): void;
}

export const useNodeStore = create<NodesState>(set => ({
  nodes: null,
  activeNode: null,
  activeDrag: null,
  selectedNode: null,
  updatedNode: null,
  isCreating: null,
  isUpdatingNode: null,
  collapseAll: false,
  collapseVersion: 0,

  setSelectedNode: node => set({ selectedNode: node }),
  setActiveNode: node => set({ activeNode: node }),
  setActiveDrag: node => set({ activeDrag: node }),

  setIsCreating: flag => set({ isCreating: flag }),
  setIsUpdatingNode: flag => set({ isUpdatingNode: flag }),

  setNodes: nodes => set({ nodes }),

  setCollapseAll: () => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith('sidebar-folder-open')) {
        localStorage.removeItem(key);
      }
    }

    set(state => ({ collapseVersion: state.collapseVersion + 1 }));
  },

  moveNode(dragId: string, targetId: string) {
    set(state => {
      const nodes = structuredClone(state.nodes); // clone to avoid mutating previous state
      if (!nodes || nodes.length === 0) return state;
      const dragged = findNode(nodes, dragId);
      if (!dragged) return state;
      console.log('nodesdragged', dragged);
      // remove from old parent
      removeNode(nodes, dragId);

      // update parentId
      dragged.parentId = targetId === 'root' ? null : targetId;

      // insert into new parent
      insertNode(nodes, dragged, targetId);

      return { nodes };
    });
  },

  resetEditor: () =>
    set({
      activeNode: null,
      activeDrag: null,
      isCreating: null,
      isUpdatingNode: null,
    }),
}));
