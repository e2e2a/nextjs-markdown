import { INode } from '@/types';
import { create } from 'zustand';

interface NodesState {
  /** Currently active file for editing */
  // activeFile: INode | null;

  /** Currently selected node (file or folder) in sidebar */
  activeNode: INode | null;
  selectedNode: INode | null;

  /** Currently updated node (file or folder) in sidebar */
  updatedNode: INode | null;

  /** Flags for creating/updating files */
  isCreating: boolean;
  isUpdatingNode: INode | null;

  /** UI flags */
  collapseAll: boolean;
  collapseVersion: number;

  /** Actions */
  // setActiveFile(file: INode | null): void;
  setIsCreating(flag: boolean): void;
  setIsUpdatingNode(flag: INode | null): void;
  setCollapseAll(flag: boolean): void;

  setSelectedNode(node: INode | null): void;
  setActiveNode(node: INode | null): void;

  /** Utility to reset editor state */
  resetEditor(): void;
}

export const useNodeStore = create<NodesState>(set => ({
  // activeFile: null,
  activeNode: null,
  selectedNode: null,
  updatedNode: null,
  isCreating: false,
  isUpdatingNode: null,
  collapseAll: false,
  collapseVersion: 0,

  setSelectedNode: node => set({ selectedNode: node }),
  // setSelectedNode: node => {
  //   console.log('Setting selectedNode to:', node);
  //   set({ selectedNode: node });
  // },
  setActiveNode: node => set({ activeNode: node }),

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
      isCreating: false,
      isUpdatingNode: null,
    }),
}));
