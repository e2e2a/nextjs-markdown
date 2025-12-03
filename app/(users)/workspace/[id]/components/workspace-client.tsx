'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { sidebarData } from '@/data/sidebar/workspace';
// import { useSession } from 'next-auth/react';
// import { MembersInvited } from '@/types';
// import { useMembersByOwnerQuery } from '@/hooks/member/useMemberQuery';
// import { DataTable } from './data-table';
// import { columns } from './columns';

export function WorkspaceClient() {
  // const { data: session, status } = useSession();

  // const { data: members } = useMembersByOwnerQuery(session?.user?._id as string);
  // if (status === 'loading') return;

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar data={sidebarData} variant="sidebar" />
      <SidebarInset className="flex flex-col h-screen w-full">
        <SiteHeader title={'Workspace Name'} />
        <div className="flex-1 overflow-y-auto">
          <div className="container px-3 py-4">
            <h1 className="text-2xl md:text-3xl font-bold drop-shadow-sm mb-2">Workspace Name</h1>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
