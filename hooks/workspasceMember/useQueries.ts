import { workspaceMemberClient } from '@/lib/api/workspaceMemberClient';
import { useQuery } from '@tanstack/react-query';

export function useGetMembersInWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: ['workspaceMembers', workspaceId],
    queryFn: () => workspaceMemberClient.getMembersInWorkspace(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useGetMemberWithWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: ['workspaceMember', workspaceId],
    queryFn: () => workspaceMemberClient.getMemberWithWorkspace(workspaceId),
    enabled: !!workspaceId,
  });
}
