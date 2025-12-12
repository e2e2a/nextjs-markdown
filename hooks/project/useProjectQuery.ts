import { projectClient } from '@/lib/api/projectClient';
import { useQuery } from '@tanstack/react-query';

export function useGetProjectsByWorkspaceId(workspaceId: string) {
  return useQuery({
    queryKey: ['workspaceProjects', workspaceId],
    queryFn: () => projectClient.getProjectsByWorkspace(workspaceId),
    enabled: !!workspaceId,
  });
}
