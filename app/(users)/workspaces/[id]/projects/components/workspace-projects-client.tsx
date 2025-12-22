'use client';
import { DataTable } from '@/components/data-table';
import { SidebarInset } from '@/components/ui/sidebar';
import { notFound, useParams } from 'next/navigation';
import { columns } from './columns';
import { IProject } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGetProjectsByWorkspaceId } from '@/hooks/project/useProjectQuery';
import { cn } from '@/lib/utils';
import { useGetMyWorkspaceMembership } from '@/hooks/workspasceMember/useQueries';

export function WorkspaceProjectsClient() {
  const params = useParams();
  const workspaceId = params.id as string;
  const {
    data: membership,
    isLoading: mLoading,
    error: mError,
  } = useGetMyWorkspaceMembership(workspaceId);
  const { data, isLoading: pLoading, error } = useGetProjectsByWorkspaceId(workspaceId);
  if (pLoading || mLoading) return;
  if (!membership || error || mError) return notFound();

  return (
    <SidebarInset className="flex flex-col h-screen w-full! overflow-hidden">
      <div className="px-3 py-4 w-full! flex-1 overflow-y-auto">
        <div
          className={cn('flex items-center', membership.role !== 'viewer' ? 'justify-between' : '')}
        >
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-xs mb-2">Projects</h1>
          {membership.role !== 'viewer' && (
            <Link href={`/workspaces/${workspaceId}/projects/create`}>
              <Button className="cursor-pointer">Create New Project</Button>
            </Link>
          )}
        </div>
        <div className="w-full">
          <DataTable columns={columns} data={(data || []) as IProject[]} />
        </div>
      </div>
    </SidebarInset>
  );
}
