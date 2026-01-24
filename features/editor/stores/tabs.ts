import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INode } from '@/types';

export interface Tab {
  nodeId: string;
  title: string;
  isDirty: boolean;
  isPreview: boolean;
}

interface TabsState {
  // Structure: { [projectId: string]: Tab[] }
  projectTabs: Record<string, Tab[]>;
  // Structure: { [projectId: string]: activeTabId }
  activeTabs: Record<string, string | null>;

  // Actions
  openTab: (projectId: string, node: INode, isPreview?: boolean, insertIndex?: number) => void;
  closeTab: (projectId: string, nodeId: string) => void;
  setActiveTab: (projectId: string, nodeId: string) => void;
  pinTab: (projectId: string, nodeId: string) => void;
  markDirty: (projectId: string, nodeId: string, dirty: boolean) => void;
  renameTab: (projectId: string, nodeId: string, title: string) => void;
  closeAll: (projectId: string) => void;
}

export const useTabStore = create<TabsState>()(
  persist(
    (set, get) => ({
      projectTabs: {},
      activeTabs: {},

      openTab(projectId: string, node: INode, isPreview = false, insertIndex?: number) {
        if (node.type !== 'file') return;

        set(state => {
          const currentTabs = state.projectTabs[projectId] || [];
          const activeTabId = state.activeTabs[projectId];
          const existingTabIndex = currentTabs.findIndex(t => t.nodeId === node._id);

          // 1️⃣ If the tab exists, just focus it
          if (existingTabIndex !== -1) {
            const updatedTabs = [...currentTabs];
            if (!isPreview && updatedTabs[existingTabIndex].isPreview) {
              updatedTabs[existingTabIndex] = { ...updatedTabs[existingTabIndex], isPreview: false };
            }
            return {
              projectTabs: { ...state.projectTabs, [projectId]: updatedTabs },
              activeTabs: { ...state.activeTabs, [projectId]: node._id },
            };
          }

          // 2️⃣ New tab object
          const newTab: Tab = {
            nodeId: node._id,
            title: node.title ?? 'Untitled',
            isDirty: false,
            isPreview,
          };

          // 3️⃣ Preview replacement (VS Code style)
          const previewIndex = currentTabs.findIndex(t => t.isPreview && !t.isDirty);
          if (isPreview && previewIndex !== -1) {
            const replacedTabs = [...currentTabs];
            replacedTabs[previewIndex] = newTab;
            return {
              projectTabs: { ...state.projectTabs, [projectId]: replacedTabs },
              activeTabs: { ...state.activeTabs, [projectId]: node._id },
            };
          }

          // 4️⃣ Insert logic
          let updatedTabs: Tab[];
          if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= currentTabs.length) {
            updatedTabs = [...currentTabs.slice(0, insertIndex), newTab, ...currentTabs.slice(insertIndex)];
          } else {
            const activeIndex = currentTabs.findIndex(t => t.nodeId === activeTabId);
            updatedTabs =
              activeIndex !== -1 ? [...currentTabs.slice(0, activeIndex + 1), newTab, ...currentTabs.slice(activeIndex + 1)] : [...currentTabs, newTab];
          }

          return {
            projectTabs: { ...state.projectTabs, [projectId]: updatedTabs },
            activeTabs: { ...state.activeTabs, [projectId]: node._id },
          };
        });
      },

      closeTab(projectId, nodeId) {
        set(state => {
          const tabs = state.projectTabs[projectId] || [];
          const index = tabs.findIndex(t => t.nodeId === nodeId);
          if (index === -1) return state;

          const updatedTabs = tabs.filter(t => t.nodeId !== nodeId);
          const currentActive = state.activeTabs[projectId];

          let nextActive = currentActive;
          if (currentActive === nodeId) {
            nextActive = updatedTabs[index - 1]?.nodeId ?? updatedTabs[index]?.nodeId ?? null;
          }

          return {
            projectTabs: { ...state.projectTabs, [projectId]: updatedTabs },
            activeTabs: { ...state.activeTabs, [projectId]: nextActive },
          };
        });
      },

      setActiveTab: (projectId, nodeId) =>
        set(state => ({
          activeTabs: { ...state.activeTabs, [projectId]: nodeId },
        })),

      pinTab: (projectId, nodeId) =>
        set(state => ({
          projectTabs: {
            ...state.projectTabs,
            [projectId]: (state.projectTabs[projectId] || []).map(t => (t.nodeId === nodeId ? { ...t, isPreview: false } : t)),
          },
        })),

      markDirty: (projectId, nodeId, dirty) =>
        set(state => ({
          projectTabs: {
            ...state.projectTabs,
            [projectId]: (state.projectTabs[projectId] || []).map(t =>
              t.nodeId === nodeId ? { ...t, isDirty: dirty, isPreview: dirty ? false : t.isPreview } : t
            ),
          },
        })),

      renameTab: (projectId, nodeId, title) =>
        set(state => ({
          projectTabs: {
            ...state.projectTabs,
            [projectId]: (state.projectTabs[projectId] || []).map(t => (t.nodeId === nodeId ? { ...t, title } : t)),
          },
        })),

      closeAll: projectId =>
        set(state => ({
          projectTabs: { ...state.projectTabs, [projectId]: [] },
          activeTabs: { ...state.activeTabs, [projectId]: null },
        })),
    }),
    { name: 'vscode-style-tabs' }
  )
);
