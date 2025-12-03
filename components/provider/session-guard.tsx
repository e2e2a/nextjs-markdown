'use client';
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  useEffect(() => {
    /**
     * Forcing logout if the user is deleted
     */
    if (session && session?.deleted) signOut({ callbackUrl: '/login' });
  }, [session]);

  return <>{children}</>;
}
