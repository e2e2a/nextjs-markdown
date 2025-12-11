import { workspaceClient } from '@/lib/api/workspaceClient';
import { useQuery } from '@tanstack/react-query';

export function useGetUserWorkspaces(userId: string) {
  return useQuery({
    queryKey: ['userWorkspaces', userId],
    queryFn: () => workspaceClient.getUserWorkspaces(),
    enabled: !!userId,
  });
}

export function useWorkspaceProjects(workspaceId: string) {
  return useQuery({
    queryKey: ['workspaceProjects', workspaceId],
    queryFn: () => workspaceClient.getWorkspaceProjects(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ['workspaceMembers', workspaceId],
    queryFn: () => workspaceClient.getWorkspaceMember(workspaceId),
    enabled: !!workspaceId,
  });
}
