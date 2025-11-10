import { useQuery } from '@tanstack/react-query';
import { getNodes } from '@/lib/api/nodeClient';

export function useNodeQuery(projectId: string) {
  return useQuery({
    queryKey: ['nodes', projectId],
    queryFn: () => getNodes(projectId),
    enabled: !!projectId,
  });
}
