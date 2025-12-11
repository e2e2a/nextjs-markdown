'use client';
import { DataTable } from '@/components/data-table';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset } from '@/components/ui/sidebar';
import { useWorkspaceProjects } from '@/hooks/workspace/useQuery';
import { notFound, useParams } from 'next/navigation';
import { columns } from './columns';
import { IProject } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function WorkspaceProjectsClient() {
  const params = useParams();
  const workspaceId = params.id as string;
  const { data, error } = useWorkspaceProjects(workspaceId);
  if (error) return notFound();

  return (
    <SidebarInset className="flex flex-col h-screen w-full! overflow-hidden">
      <SiteHeader title={'Projects'} />
      <div className="px-3 py-4 w-full! flex-1 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-xs mb-2">Projects</h1>
          <Link href={`/workspace/${workspaceId}/projects/create`}>
            <Button className="cursor-pointer">Create New Project</Button>
          </Link>
        </div>
        <div className="w-full">
          <DataTable columns={columns} data={(data?.member?.projects || []) as IProject[]} />
        </div>
      </div>
    </SidebarInset>
  );
}
