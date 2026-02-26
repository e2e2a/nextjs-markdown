'use client';
import React, { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { INavItem } from '@/types';
import { notFound, useParams } from 'next/navigation';
import { PreferencesHeader } from './headers/preferences';
import { WorkspacesHeader } from './headers/workspaces';
import { useGetMembersInWorkspace } from '@/hooks/workspasceMember/useQueries';
import { ProjectsHeader } from './headers/projects';

type IProps = {
  data: INavItem[];
  children: React.ReactNode;
  type: 'workspaces' | 'preferences' | 'projects';
};

export function SidebarWrapper({ data, children, type }: IProps) {
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  const id = params?.id as string;
  const pid = params?.pid as string;
  const { data: mData, isLoading: mLoading, error: mError } = useGetMembersInWorkspace(id);

  let initialLink = '';
  switch (type) {
    case 'workspaces':
      initialLink = `/workspaces/${id}`;
      break;
    case 'preferences':
      initialLink = '';
      break;
    case 'projects':
      initialLink = `/projects/${pid}`;
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

  if (type === 'workspaces' && mLoading) return;
  if (type === 'workspaces' && (!mData || mError)) return notFound();
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
          transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
        } as React.CSSProperties
      }
      className="h-screen flex-1 flex flex-col"
      defaultOpen={false}
    >
      {type === 'preferences' && <PreferencesHeader />}
      {type === 'workspaces' && <WorkspacesHeader />}
      {type === 'projects' && <ProjectsHeader />}

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar data={data} initialLink={initialLink} collapsible="icon" variant="sidebar" />
        <div className="overflow-hidden w-full">{children}</div>
      </div>
    </SidebarProvider>
  );
}
