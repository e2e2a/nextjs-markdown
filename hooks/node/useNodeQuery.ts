import { nodeClient } from '@/lib/api/nodeClient';
import { useQuery } from '@tanstack/react-query';

export function useNodesProjectIdQuery(projectId: string) {
  return useQuery({
    queryKey: ['nodesByProjectId', projectId],
    queryFn: () => nodeClient.getNodes(projectId),
    enabled: !!projectId,
  });
}
