import { memberClient } from '@/lib/api/memberClient';
import { useQuery } from '@tanstack/react-query';

export function useMembersByProjectIdQuery(projectId: string) {
  return useQuery({
    queryKey: ['membersByProjectId', projectId],
    queryFn: () => memberClient.findMembers({ projectId }),
    enabled: !!projectId,
  });
}
