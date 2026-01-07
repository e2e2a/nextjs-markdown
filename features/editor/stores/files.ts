import { create } from 'zustand';
import { FileModel } from '../models/file';

interface FilesState {
  files: FileModel[];
  isLoading: boolean;
}

interface FilesActions {
  loadFiles(): Promise<void>;
}

export const useFilesStore = create<FilesState & FilesActions>(set => ({
  files: [],
  isLoading: false,

  async loadFiles() {
    set({ isLoading: true });

    // later replace with real API call
    const files: FileModel[] = [
      { id: '1', name: 'file1.ts', path: '/file1.ts', content: '' },
      { id: '2', name: 'file2.ts', path: '/file2.ts', content: '' },
    ];

    set({ files, isLoading: false });
  },
}));
