import { HocuspocusProvider } from '@hocuspocus/provider';
import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from 'yjs';

export const createNodeProvider = (nodeId: string, token: string) => {
  const ydoc = new Y.Doc();

  // 1. Offline Persistence: Syncs ydoc with Browser Storage
  const indexeddb = new IndexeddbPersistence(`node-${nodeId}`, ydoc);

  // 2. Collaborative Provider: Syncs ydoc with Server
  const provider = new HocuspocusProvider({
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:1234',
    name: nodeId,
    document: ydoc,
    token: token, // Sent to onAuthenticate
    onConnect() {
      console.log('Connected to sync server');
    },
    onDisconnect() {
      console.log('Disconnected (Offline mode active)');
    },
  });

  return { ydoc, provider, indexeddb };
};
