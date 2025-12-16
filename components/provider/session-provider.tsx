'use client';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function SessionProviderWrapper({ children }: Props) {
  return (
    <SessionProvider refetchInterval={10 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}
