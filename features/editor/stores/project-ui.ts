import { create } from 'zustand';

interface EditorState {
  leftSidebarTab: 'nodes' | 'search' | 'bookmarks';
  setLeftSidebarTab(tab: 'nodes' | 'search' | 'bookmarks'): void;
  searchQuery: string;
  setSearchQuery(query: string): void;
}

export const useProjectUIStore = create<EditorState>(set => ({
  leftSidebarTab: 'nodes',
  setLeftSidebarTab: flag => set({ leftSidebarTab: flag }),

  searchQuery: '',
  setSearchQuery: query => set({ searchQuery: query }),
}));
