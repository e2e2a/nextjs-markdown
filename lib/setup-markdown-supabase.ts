import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import * as awarenessProtocol from 'y-protocols/awareness';
import { supabase } from './supabaseClient';
import { randomColor } from './cursor-colors';
import { Session } from 'next-auth';
import { INode } from '@/types';
import { RealtimeChannel } from '@supabase/supabase-js';
import { UseMutationResult } from '@tanstack/react-query';

interface YjsUpdatePayload {
  update: number[];
}

interface SupabaseBroadcast<T> {
  type: 'broadcast';
  event?: string;
  payload?: T;
}

function isLocalCM6Edit(origin: unknown): boolean {
  if (!origin || typeof origin !== 'object') return false;
  return 'ytext' in origin && 'awareness' in origin;
}

export function setupMarkdownSupabase(
  node: INode,
  session: Session,
  initialContent: string,
  updateMutation: UseMutationResult
) {
  let saveTimer: NodeJS.Timeout | null = null;
  const user = session.user;
  const nodeId = node._id;

  const ydoc = new Y.Doc();
  const ytext = ydoc.getText('codemirror');
  const ymeta = ydoc.getMap('meta');
  const awareness = new Awareness(ydoc);

  awareness.setLocalState({ user: { ...user, name: user.email, color: randomColor() } });

  const channelName = `node-${nodeId}`;
  const channel: RealtimeChannel = supabase.channel(channelName); // Lock to prevent echo loops

  let isApplyingRemote = false;
  let hasUserEdited = false;
  let isHydrated = false; // Track if we have content loaded // --- Sync Promises ---
  let initializationDecided = false;

  let synced = false;
  let resolveSync: (() => void) | null = null;

  // --- NEW: Resync Debouncer ---
  let resyncTimeout: NodeJS.Timeout | null = null;

  /**
   * Handles the browser's beforeunload event to warn the user if a save is pending.
   * @param event The native beforeunload event.
   */
  const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (saveTimer) {
      const message = 'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = message; // Chrome, Firefox
      // return message; // Safest for older browsers, though TS warns if function returns void.
      return;
    }
  };
  const waitForInitialSync = (timeoutMs = 2000): Promise<void> => {
    if (synced) return Promise.resolve();
    return new Promise<void>(resolve => {
      resolveSync = resolve;
      setTimeout(() => {
        if (!synced) {
          synced = true;
          resolve();
        }
      }, timeoutMs);
    });
  };

  const markSynced = (): void => {
    if (synced) return;
    synced = true;
    if (resolveSync) {
      resolveSync();
      resolveSync = null;
    }
  };

  const sendBroadcast = (event: string, payload: YjsUpdatePayload) => {
    // If channel is dead, try to revive, but don't throw
    if (channel.state !== 'joined') {
      if (channel.state === 'closed') channel.subscribe();
      return;
    }
    channel
      .send({
        type: 'broadcast',
        event,
        payload: { update: payload.update },
      })
      .catch(err => console.warn('Broadcast failed', err));
  };

  // Triggers a full sync, but only once every 100ms (Debouncing)
  const triggerResync = () => {
    if (resyncTimeout) return; // Already requested
    console.warn('[Sync] Detected missing updates. Scheduling resync...');

    resyncTimeout = setTimeout(() => {
      sendBroadcast(`doc-request-${nodeId}`, { update: [] });
      resyncTimeout = null;
    }, 100);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // Proactively sync when waking up
      triggerResync();
    }
  };

  const onAwarenessUpdate = (
    _: { added: number[]; updated: number[]; removed: number[] },
    origin: unknown
  ) => {
    if (origin === 'remote') return;
    const update = awarenessProtocol.encodeAwarenessUpdate(
      awareness,
      Array.from(awareness.getStates().keys())
    );
    sendBroadcast('awareness-update', { update: Array.from(update) });
  };
  awareness.on('update', onAwarenessUpdate);

  const onRemoteAwareness = (payload: SupabaseBroadcast<YjsUpdatePayload>) => {
    if (!payload?.payload?.update) return;
    try {
      const u = new Uint8Array(payload.payload.update);
      awarenessProtocol.applyAwarenessUpdate(awareness, u, 'remote');
    } catch (err) {
      console.warn(err);
    }
  };
  channel.on('broadcast', { event: 'awareness-update' }, onRemoteAwareness);

  const onDocUpdate = (update: Uint8Array, origin: unknown) => {
    // STOP if this is a remote update or our own initialization
    if (origin === 'remote' || origin === 'initial-load' || isApplyingRemote) return; // Broadcast local changes to peers

    sendBroadcast(`doc-update-${nodeId}`, { update: Array.from(update) });

    if (isLocalCM6Edit(origin)) {
      hasUserEdited = true;
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        const content = ytext.toString();
        updateMutation
          .mutateAsync({
            _id: node._id as string,
            content: content,
            type: node.type,
          })
          .catch(console.error);
        saveTimer = null;
      }, 2000);
    }
  }; // Helper wrapper to catch errors

  const onYdocUpdate = (update: Uint8Array, origin: unknown) => {
    try {
      onDocUpdate(update, origin);
      markSynced();
    } catch (e) {
      console.error(e);
    }
  };
  ydoc.on('update', onYdocUpdate);

  const onRemoteDocUpdate = (payload: SupabaseBroadcast<YjsUpdatePayload>) => {
    if (!payload?.payload?.update) return;
    isApplyingRemote = true;
    try {
      const u = new Uint8Array(payload.payload.update);
      Y.applyUpdate(ydoc, u, 'remote');
      markSynced();
      if (!isHydrated) {
        isHydrated = true;
        initializationDecided = true;
      }
    } catch (err) {
      triggerResync();
      const clientIDs = Array.from(awareness.getStates().keys()).filter(
        id => id !== awareness.clientID
      );
      if (clientIDs.length > 0) {
        awarenessProtocol.removeAwarenessStates(awareness, clientIDs, 'resync-cleared');
      }
    } finally {
      isApplyingRemote = false;
    }
  };
  channel.on('broadcast', { event: `doc-update-${nodeId}` }, onRemoteDocUpdate);

  const onFullStateRequest = (_payload: SupabaseBroadcast<unknown>) => {
    // Only answer if I actually have content
    const state = Y.encodeStateAsUpdate(ydoc);
    sendBroadcast(`doc-full-state-${nodeId}`, { update: Array.from(state) });
  };

  channel.on('broadcast', { event: `doc-request-${nodeId}` }, onFullStateRequest);

  const onFullState = (payload: SupabaseBroadcast<YjsUpdatePayload>) => {
    if (!payload?.payload?.update) return;
    isApplyingRemote = true;
    try {
      const u = new Uint8Array(payload.payload.update);
      ydoc.transact(() => {
        Y.applyUpdate(ydoc, u, 'remote');
      }, 'remote');
      isHydrated = true;
      initializationDecided = true;
      markSynced();
    } catch (err) {
      console.error('[Sync] Full State apply failed:', err);
    } finally {
      isApplyingRemote = false;
    }
  };
  channel.on('broadcast', { event: `doc-full-state-${nodeId}` }, onFullState);

  let initTimeout: NodeJS.Timeout | null = null;

  channel.subscribe(status => {
    if (status === 'SUBSCRIBED') {
      awareness.setLocalStateField('ping', Date.now());

      sendBroadcast(`doc-request-${nodeId}`, { update: [] });

      initTimeout = setTimeout(() => {
        if (initializationDecided || isHydrated) return;
        const states = awareness.getStates();
        const peerCount = Array.from(states.keys()).filter(id => id !== awareness.clientID).length;

        if (peerCount > 0) {
          // console.log(`[Sync] ${peerCount} peers detected. Waiting...`);
          sendBroadcast(`doc-request-${nodeId}`, { update: [] });
        } else {
          if (ytext.length === 0) {
            // console.log('[Sync] No peers detected. Applying initial content.');
            ydoc.transact(() => {
              ytext.insert(0, initialContent);
              ymeta.set('initialized', true);
            }, 'initial-load');
            isHydrated = true;
            markSynced();
          }
        }
        initializationDecided = true;
      }, 250);
    }
  });

  const checkConnection = () => {
    if (channel.state !== 'joined') channel.subscribe();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  const cleanup = () => {
    if (resyncTimeout) clearTimeout(resyncTimeout);
    if (initTimeout) clearTimeout(initTimeout);
    if (saveTimer) clearTimeout(saveTimer);
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
    awareness.setLocalState(null);
    awareness.off('update', onAwarenessUpdate);
    ydoc.off('update', onYdocUpdate);
    channel.unsubscribe();
    supabase.removeChannel(channel);
    ydoc.destroy();
  };

  return { ydoc, ytext, awareness, channel, cleanup, waitForInitialSync, checkConnection };
}
