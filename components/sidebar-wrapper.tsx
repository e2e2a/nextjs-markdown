'use client';
import React, { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { INavItem } from '@/types';
import { useParams } from 'next/navigation';
import { PreferencesHeader } from './headers/preferences';
import { WorkspacesHeader } from './headers/workspaces';

type IProps = {
  data: INavItem[];
  children: React.ReactNode;
  type: 'workspaces' | 'preferences';
};

export function SidebarWrapper({ data, children, type }: IProps) {
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  const id = params?.id as string;
  let initialLink = '';
  switch (type) {
    case 'workspaces':
      initialLink = `/workspaces/${id}`;
      break;
    case 'preferences':
      initialLink = '';
      break;
    default:
      initialLink = '';
  }
  // Set mounted state after initial render on the client
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsMounted(true);
    });
  }, []);

  // Use a placeholder or render nothing until mounted
  if (!isMounted) return null; // Or return a lightweight server-rendered placeholder
  if (!data) return;

  // Once mounted, render the full component with dynamic IDs
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 60)',
          '--header-height': 'calc(var(--spacing) * 0)',
        } as React.CSSProperties
      }
      className="h-screen flex-1 flex flex-col"
      defaultOpen={false}
    >
      {type === 'preferences' && <PreferencesHeader />}
      {type === 'workspaces' && <WorkspacesHeader />}

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar data={data} initialLink={initialLink} collapsible="icon" variant="sidebar" />
        {children}
      </div>
    </SidebarProvider>
  );
}
