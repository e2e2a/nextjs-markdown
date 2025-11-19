'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { ArchivedItem } from '@/types';
import { useTrashQueryByUserId } from '@/hooks/trash/useTrashQuery';

export function TrashClient() {
  const { data: session, status } = useSession();

  const { data } = useTrashQueryByUserId(session?.user?._id as string);
  if (status === 'loading') return;

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title={'My Trash'} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col p-0! m-0!">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="container mx-auto px-10">
                <h1 className="text-2xl md:text-3xl font-bold drop-shadow-sm ">My Trash</h1>
                <div className="py-5">
                  <DataTable columns={columns} data={(data || []) as ArchivedItem[]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
