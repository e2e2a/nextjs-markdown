'use client';
import { DataTable } from '@/components/data-table';
import { SidebarInset } from '@/components/ui/sidebar';
import { notFound, useParams } from 'next/navigation';
import { columns } from './columns';
import { IWorkspaceMember } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  useGetMembersInWorkspace,
  useGetMyWorkspaceMembership,
} from '@/hooks/workspasceMember/useQueries';
import { cn } from '@/lib/utils';

export function AccessUsersClient() {
  const params = useParams();
  const workspaceId = params.id as string;
  const {
    data: membership,
    isLoading: mLoading,
    error: mError,
  } = useGetMyWorkspaceMembership(workspaceId);
  const { data, isLoading: pLoading, error } = useGetMembersInWorkspace(workspaceId);
  if (pLoading || mLoading) return;
  if (!membership || error || mError) return notFound();
  console.log('data', data);
  return (
    <SidebarInset className="flex flex-col h-full w-full">
      <main className="px-3 py-4 w-full flex-1 overflow-y-auto">
        <div
          className={cn('flex items-center', membership.role !== 'viewer' ? 'justify-between' : '')}
        >
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-xs mb-2">Users</h1>
          {membership.role !== 'viewer' && (
            <Link href={`/workspaces/${workspaceId}/access/users/invite`}>
              <Button className="cursor-pointer">Invite Users</Button>
            </Link>
          )}
        </div>
        <div className="w-full">
          <DataTable columns={columns} data={(data || []) as IWorkspaceMember[]} />
        </div>
      </main>
    </SidebarInset>
  );
}
