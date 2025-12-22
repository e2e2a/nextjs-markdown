'use client';
import { SidebarInset } from '@/components/ui/sidebar';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { IUserWorkspaces } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useGetUserWorkspaces } from '@/hooks/workspace/useQuery';
import { useEffect } from 'react';
import { makeToastError } from '@/lib/toast';

export const WorkspaceClient = () => {
  const { data: session, status } = useSession();
  const { data: workspaces, isLoading, error } = useGetUserWorkspaces(session?.user?._id as string);
  console.log('workspaces', workspaces);
  useEffect(() => {
    if (error) makeToastError(error.message);
  }, [error]);

  if (status === 'loading' || isLoading) return;

  return (
    <SidebarInset className="flex flex-col h-full w-full">
      <main className="px-3 py-4 w-full flex-1 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-xs mb-2">Workspaces</h1>
          <Link href={'/preferences/workspaces/create'}>
            <Button className="cursor-pointer">Create New Workspace</Button>
          </Link>
        </div>
        <div className="">
          <DataTable columns={columns} data={(workspaces || []) as IUserWorkspaces[]} />
        </div>
      </main>
    </SidebarInset>
  );
};
