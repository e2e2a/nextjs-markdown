import { create } from 'zustand';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface CollaborativeBuffer {
  ydoc: Y.Doc;
  provider: WebsocketProvider;
  content: string; // local snapshot
}

interface CollaborativeEditorState {
  buffers: Record<string, CollaborativeBuffer>;

  initBuffer(nodeId: string, wsUrl: string, initialContent?: string): void;
  setLocalContent(nodeId: string, content: string): void;
  destroyBuffer(nodeId: string): void;
}

export const useCollaborativeEditorStore = create<CollaborativeEditorState>(set => ({
  buffers: {},

  initBuffer(nodeId, wsUrl, initialContent = '') {
    set(state => {
      if (state.buffers[nodeId]) return state; // already exists

      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider(wsUrl, nodeId, ydoc);

      // Initialize text type
      const ytext = ydoc.getText('content');
      if (initialContent) ytext.insert(0, initialContent);

      // Observe changes → update local snapshot
      ytext.observe(() => {
        set(state => ({
          buffers: {
            ...state.buffers,
            [nodeId]: {
              ...state.buffers[nodeId],
              content: ytext.toString(),
            },
          },
        }));
      });

      return {
        buffers: {
          ...state.buffers,
          [nodeId]: {
            ydoc,
            provider,
            content: ytext.toString(),
          },
        },
      };
    });
  },

  setLocalContent(nodeId, content) {
    set(state => {
      const buf = state.buffers[nodeId];
      if (!buf) return state;

      const ytext = buf.ydoc.getText('content');
      ytext.delete(0, ytext.length);
      ytext.insert(0, content);

      return state; // observer updates `content`
    });
  },

  destroyBuffer(nodeId) {
    set(state => {
      const buf = state.buffers[nodeId];
      if (buf) {
        buf.provider.disconnect();
        buf.ydoc.destroy();
      }
      const copy = { ...state.buffers };
      delete copy[nodeId];
      return { buffers: copy };
    });
  },
}));
