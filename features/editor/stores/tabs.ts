import { create } from 'zustand';
import { TabModel } from '../models/tab';
import { FileModel } from '../models/file';

interface TabsState {
  tabs: TabModel[];
  activeTabId: string | null;
}

interface TabsActions {
  openPreview(file: FileModel): void;
  pinFile(file: FileModel): void;
  closeTab(fileId: string): void;
  setActiveTab(fileId: string): void;
  updateContent(fileId: string, content: string): void;
}

export const useTabsStore = create<TabsState & TabsActions>((set, get) => ({
  tabs: [],
  activeTabId: null,

  openPreview(file) {
    const { tabs } = get();

    // already open
    const existing = tabs.find(t => t.file.id === file.id);
    if (existing) {
      set({ activeTabId: file.id });
      return;
    }

    const previewIndex = tabs.findIndex(t => t.isPreview);

    if (previewIndex !== -1) {
      const newTabs = [...tabs];
      newTabs[previewIndex] = {
        file,
        isDirty: false,
        isPreview: true,
      };

      set({
        tabs: newTabs,
        activeTabId: file.id,
      });
      return;
    }

    set({
      tabs: [...tabs, { file, isDirty: false, isPreview: true }],
      activeTabId: file.id,
    });
  },

  pinFile(file) {
    const { tabs } = get();
    const existing = tabs.find(t => t.file.id === file.id);

    if (existing) {
      set({
        tabs: tabs.map(t => (t.file.id === file.id ? { ...t, isPreview: false } : t)),
        activeTabId: file.id,
      });
      return;
    }

    set({
      tabs: [...tabs, { file, isDirty: false, isPreview: false }],
      activeTabId: file.id,
    });
  },

  closeTab(fileId) {
    const { tabs, activeTabId } = get();
    const newTabs = tabs.filter(t => t.file.id !== fileId);

    set({
      tabs: newTabs,
      activeTabId:
        activeTabId === fileId ? newTabs[newTabs.length - 1]?.file.id ?? null : activeTabId,
    });
  },

  setActiveTab(fileId) {
    set({ activeTabId: fileId });
  },

  updateContent(fileId, content) {
    set(state => ({
      tabs: state.tabs.map(t =>
        t.file.id === fileId
          ? {
              ...t,
              file: { ...t.file, content },
              isDirty: true,
              isPreview: false, // auto-pin
            }
          : t
      ),
    }));
  },
}));
