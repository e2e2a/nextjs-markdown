import { workspaceMemberClient } from '@/lib/api/workspaceMemberClient';
import { useQuery } from '@tanstack/react-query';

export function useGetMembersInWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: ['workspaceMeasdmbers', workspaceId],
    queryFn: () => workspaceMemberClient.getMembersInWorkspace(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useGetMyWorkspaceMembership(workspaceId: string) {
  return useQuery({
    queryKey: ['workspaceMember', workspaceId],
    queryFn: () => workspaceMemberClient.getMyWorkspaceMembership(workspaceId),
    enabled: !!workspaceId,
  });
}
