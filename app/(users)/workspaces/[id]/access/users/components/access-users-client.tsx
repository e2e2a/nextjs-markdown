'use client';
import { DataTable } from '@/components/data-table';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset } from '@/components/ui/sidebar';
import { notFound, useParams } from 'next/navigation';
import { columns } from './columns';
import { IWorkspaceMember } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGetMembersInWorkspace } from '@/hooks/workspasceMember/useQueries';
import { useWorkspaceMember } from '@/context/WorkspaceMember';
import { cn } from '@/lib/utils';

export function AccessUsersClient() {
  const { membership } = useWorkspaceMember();
  const params = useParams();
  const workspaceId = params.id as string;
  const { data, isLoading, error } = useGetMembersInWorkspace(workspaceId);
  if (isLoading) return;
  if (error) return notFound();
  console.log('members', data);
  return (
    <SidebarInset className="flex flex-col h-screen w-full! overflow-hidden">
      <SiteHeader title={'Projects'} />
      <div className="px-3 py-4 w-full! flex-1 overflow-y-auto">
        <div
          className={cn('flex items-center', membership.role !== 'viewer' ? 'justify-between' : '')}
        >
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-xs mb-2">Projects</h1>
          {membership.role !== 'viewer' && (
            <Link href={`/workspace/${workspaceId}/projects/create`}>
              <Button className="cursor-pointer">Invite Users</Button>
            </Link>
          )}
        </div>
        <div className="w-full">
          <DataTable columns={columns} data={(data || []) as IWorkspaceMember[]} />
        </div>
      </div>
    </SidebarInset>
  );
}
