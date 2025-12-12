'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from './data-table';
import { columns } from './columns';
import { MembersInvited } from '@/types';
import { useSession } from 'next-auth/react';
import { useMembersByEmailQuery } from '@/hooks/member/useQueries';

export function InvitationTabs() {
  const { data: session, status } = useSession();

  const { data: members } = useMembersByEmailQuery(session?.user?.email as string);

  if (status === 'loading') return;

  let pendingInvitation = [];
  let acceptedInvitation = [];
  if (members && members.length > 0) {
    pendingInvitation = members.filter((m: MembersInvited) => m.status === 'pending');
    acceptedInvitation = members.filter((m: MembersInvited) => m.status === 'accepted');
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="accepted" className="">
        <TabsList>
          <TabsTrigger value="accepted">Join Project</TabsTrigger>
          <TabsTrigger value="pending">Pending Invitation</TabsTrigger>
        </TabsList>
        <TabsContent value="accepted">
          <DataTable columns={columns} data={(acceptedInvitation || []) as MembersInvited[]} />
        </TabsContent>
        <TabsContent value="pending">
          <DataTable columns={columns} data={(pendingInvitation || []) as MembersInvited[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
