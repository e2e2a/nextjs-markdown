import { workspaceMemberClient } from '@/lib/api/workspaceMemberClient';
import { useQuery } from '@tanstack/react-query';

export function useGetMembersByWorkspaceId(workspaceId: string) {
  return useQuery({
    queryKey: ['workspaceMembers', workspaceId],
    queryFn: () => workspaceMemberClient.getWorkspaceMember(workspaceId),
    enabled: !!workspaceId,
  });
}
