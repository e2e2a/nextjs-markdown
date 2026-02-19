import * as Y from 'yjs';
import { HocuspocusProvider, HocuspocusProviderConfiguration } from '@hocuspocus/provider';
import { IndexeddbPersistence } from 'y-indexeddb';

export interface SyncInstance {
  ydoc: Y.Doc;
  provider: HocuspocusProvider;
  persistence: IndexeddbPersistence;
}

const instances = new Map<string, SyncInstance>();

export function getSyncProvider(nodeId: string): SyncInstance {
  const existing = instances.get(nodeId);
  if (existing) return existing;

  const ydoc = new Y.Doc();
  console.log('📄 Y.Doc created');

  // Offline restore
  const persistence = new IndexeddbPersistence(nodeId, ydoc);
  persistence.on('synced', () => {
    console.log('📦 Offline content restored');
  });

  const config: HocuspocusProviderConfiguration = {
    url: 'ws://localhost:1234',
    name: nodeId,
    document: ydoc,
  };

  const provider = new HocuspocusProvider(config);

  provider.on('status', ({ status }) => {
    console.log('🔌 WS status:', status);
  });

  provider.on('synced', () => {
    console.log('☁️ Synced with server');
  });

  // awareness = online users
  provider.awareness?.on('change', () => {
    const states = Array.from(provider.awareness?.getStates().values() ?? []);
    console.log('👥 Awareness update', states.length, states);
  });

  // document updates
  ydoc.on('update', (_update: Uint8Array, origin: unknown) => {
    console.log('🧠 Document updated', { origin });
  });

  const instance: SyncInstance = {
    ydoc,
    provider,
    persistence,
  };

  instances.set(nodeId, instance);

  return instance;
}
