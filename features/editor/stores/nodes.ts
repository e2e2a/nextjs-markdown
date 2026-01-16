import { INode } from '@/types';
import { create } from 'zustand';

interface NodesState {
  /** Currently active file for editing */
  // activeFile: INode | null;

  /** Currently selected node (file or folder) in sidebar */
  activeDrag: INode | null;
  activeOver: INode | null;
  activeNode: INode | null;
  selectedNode: INode | null;

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

  /** Actions */
  // setActiveFile(file: INode | null): void;
  setIsCreating(node: { type: 'file' | 'folder'; parentId: string | null } | null): void;
  setIsUpdatingNode(flag: INode | null): void;
  setCollapseAll(flag: boolean): void;

  setActiveDrag(node: INode | null): void;
  setActiveOver(node: INode | null): void;
  setSelectedNode(node: INode | null): void;
  setActiveNode(node: INode | null): void;

  /** Utility to reset editor state */
  resetEditor(): void;
}

export const useNodeStore = create<NodesState>(set => ({
  // activeFile: null,
  activeNode: null,
  activeOver: null,
  activeDrag: null,
  selectedNode: null,
  updatedNode: null,
  isCreating: null,
  isUpdatingNode: null,
  collapseAll: false,
  collapseVersion: 0,

  setSelectedNode: node => set({ selectedNode: node }),
  // setSelectedNode: node => {
  //   console.log('Setting selectedNode to:', node);
  //   set({ selectedNode: node });
  // },
  setActiveNode: node => set({ activeNode: node }),
  setActiveDrag: node => set({ activeDrag: node }),
  setActiveOver: node => set({ activeOver: node }),

  // setActiveFile: file => set({ activeFile: file }),
  setIsCreating: flag => set({ isCreating: flag }),
  setIsUpdatingNode: flag => set({ isUpdatingNode: flag }),

  setCollapseAll: () => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith('sidebar-folder-open')) {
        localStorage.removeItem(key);
      }
    }

    set(state => ({ collapseVersion: state.collapseVersion + 1 }));
  },

  resetEditor: () =>
    set({
      activeNode: null,
      activeDrag: null,
      activeOver: null,
      isCreating: null,
      isUpdatingNode: null,
    }),
}));
