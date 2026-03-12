// components/project-presence.tsx
'use client';

import { HocuspocusProvider } from '@hocuspocus/provider';
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useProjectPresence } from '@/features/editor/stores/project-pressence';

interface ProjectPresenceProps {
  projectId: string;
  children: React.ReactNode;
}

export function ProjectPresence({ projectId, children }: ProjectPresenceProps) {
  const { data: session } = useSession();
  const setActiveUsers = useProjectPresence(state => state.setActiveUsers); // Use the existing store
  const providerRef = useRef<HocuspocusProvider | null>(null);

  useEffect(() => {
    if (!projectId || !session?.user?._id) return;

    const provider = new HocuspocusProvider({
      url: 'ws://localhost:1234',
      name: `project-presence-${projectId}`,
    });

    providerRef.current = provider;

    provider.on('synced', () => {
      provider?.awareness?.setLocalState({
        user: {
          id: session.user._id,
          name: session.user.email,
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        },
      });
    });

    // Update the store when awareness changes
    const updateUsers = () => {
      const states = provider?.awareness?.getStates();
      if (states) {
        const users = new Map();
        states.forEach(state => {
          if (state?.user?.id) {
            users.set(state.user.id, state.user);
          }
        });
        setActiveUsers(users); // Update the existing store
      }
    };

    provider?.awareness?.on('change', updateUsers);

    return () => {
      provider?.awareness?.off('change', updateUsers);
      provider.destroy();
    };
  }, [projectId, session?.user?._id, session?.user?.email, setActiveUsers]);

  return <>{children}</>;
}
