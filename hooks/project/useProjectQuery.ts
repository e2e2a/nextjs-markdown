import { projectClient } from '@/lib/api/projectClient';
import { useQuery } from '@tanstack/react-query';

export function useGetProjectsByWorkspaceId(workspaceId: string) {
  return useQuery({
    queryKey: ['projectsByWorkspaceId', workspaceId],
    queryFn: () => projectClient.getProjectsByWorkspace(workspaceId),
    enabled: !!workspaceId,
  });
}
