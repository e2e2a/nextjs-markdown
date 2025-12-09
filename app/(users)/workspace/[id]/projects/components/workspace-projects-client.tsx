'use client';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
// import { useSession } from 'next-auth/react';
// import { MembersInvited } from '@/types';
// import { useMembersByOwnerQuery } from '@/hooks/member/useMemberQuery';
// import { DataTable } from './data-table';
// import { columns } from './columns';

export function WorkspaceProjectsClient() {
  // const { data: session, status } = useSession();

  // const { data: members } = useMembersByOwnerQuery(session?.user?._id as string);
  // if (status === 'loading') return;

  return (
    <SidebarInset className="flex flex-col h-screen w-full overflow-hidden">
      <SiteHeader title={'Invitations'} />
      <div className="px-3 py-4 w-full flex-1 overflow-y-auto">
        <h1 className="text-2xl md:text-3xl font-bold drop-shadow-xs mb-2">Invitations</h1>
        <div className={cn('overflow-x-auto')}>
          text
          {/* <DataTable columns={columns} data={(workspaces || []) as IUserInvitations[]} /> */}
        </div>
      </div>
    </SidebarInset>
  );
}
