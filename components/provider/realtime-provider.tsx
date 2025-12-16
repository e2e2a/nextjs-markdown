// components/providers/RealtimeProvider.tsx
'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface RealtimeProviderProps {
  children: React.ReactNode;
}

type IncomingWsEvent = { type: 'REFRESH_SESSION' };

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const { data: session, update } = useSession();
  const socketRef = useRef<WebSocket | null>(null);
  const pendingSignals = useRef<string[]>([]);

  useEffect(() => {
    // Only connect if the user is actually logged in
    if (!session?.user?._id) return;
    console.log('session', session.user);
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
    socketRef.current = socket;

    const handleOpen = () => {
      console.log('[WS] Connected. Identifying as:', session.user._id);

      // 1. Identify User B to the server registry
      socket.send(
        JSON.stringify({
          type: 'IDENTIFY',
          userId: session.user._id,
        })
      );

      // 2. Clear any signals queued during connection
      while (pendingSignals.current.length > 0) {
        const targetId = pendingSignals.current.shift();
        if (targetId) {
          socket.send(JSON.stringify({ type: 'SEND_SIGNAL', targetUserId: targetId }));
        }
      }
    };

    const handleMessage = (event: MessageEvent<string>) => {
      try {
        const data: IncomingWsEvent = JSON.parse(event.data);
        if (data.type === 'REFRESH_SESSION') {
          console.log('[WS] Signal received! Fetching fresh data from DB...');
          // This tells Next-Auth to re-run your JWT/Session callbacks
          update({ role: 'admin' });
        }
      } catch (err) {
        console.error('[WS] Parse Error:', err);
      }
    };

    socket.addEventListener('open', handleOpen);
    socket.addEventListener('message', handleMessage);

    // Cleanup on unmount or logout
    return () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('message', handleMessage);
      socket.close();
      socketRef.current = null;
    };
  }, [session]);

  return <>{children}</>;
}
