import { create } from 'zustand';

interface EditorModel {
  nodeId: string;
  content: string;
  isDirty: boolean;
}

interface EditorState {
  activeEditorId: string | null;
  models: Record<string, EditorModel>;

  openEditor: (nodeId: string, content: string) => void;
  setActiveEditor: (nodeId: string | null) => void;
  updateContent: (nodeId: string, content: string) => void;
  closeEditor: (nodeId: string) => void;
}

export const useEditorStore = create<EditorState>(set => ({
  activeEditorId: null,
  models: {},

  openEditor(nodeId, content) {
    set(state => ({
      models: {
        ...state.models,
        [nodeId]: state.models[nodeId] ?? {
          nodeId,
          content,
          isDirty: false,
        },
      },
      activeEditorId: nodeId,
    }));
  },

  setActiveEditor(nodeId) {
    set({ activeEditorId: nodeId });
  },

  updateContent(nodeId, content) {
    set(state => ({
      models: {
        ...state.models,
        [nodeId]: {
          ...state.models[nodeId],
          content,
          isDirty: true,
        },
      },
    }));
  },

  closeEditor(nodeId) {
    set(state => {
      const { [nodeId]: _, ...rest } = state.models;
      return {
        models: rest,
        activeEditorId: state.activeEditorId === nodeId ? null : state.activeEditorId,
      };
    });
  },
}));
