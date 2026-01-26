// lib/sync-provider.ts
import { HocuspocusProvider } from '@hocuspocus/provider';
import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from 'yjs';

export function getSyncProvider(nodeId: string) {
  const ydoc = new Y.Doc();

  // 1. Local Offline Storage: Syncs YDoc to Browser DB (IndexedDB)
  const localPersistence = new IndexeddbPersistence(nodeId, ydoc);

  // 2. Remote Sync: Syncs YDoc to Hocuspocus Server
  const provider = new HocuspocusProvider({
    url: 'ws://your-server-url:1234',
    name: nodeId, // This maps to 'documentName' on the server
    document: ydoc,
    // Add token: session.accessToken if you implement onAuthenticate
  });

  return { ydoc, provider, localPersistence };
}
