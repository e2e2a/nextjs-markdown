import { useQuery } from '@tanstack/react-query';
import { getNodes } from '@/lib/api/nodeClient';

export function useNodesProjectIdQuery(projectId: string) {
  return useQuery({
    queryKey: ['nodesByProjectId', projectId],
    queryFn: () => getNodes(projectId),
    enabled: !!projectId,
  });
}
