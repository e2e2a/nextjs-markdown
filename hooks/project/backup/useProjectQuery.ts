import { projectClient } from '@/lib/api/projectClient';
import { useQuery } from '@tanstack/react-query';

export function useProjectQuery(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectClient.findProject(id),
    enabled: !!id,
  });
}

export function useProjectsByUserIdQuery(userId: string) {
  return useQuery({
    queryKey: ['projectsByUserId', userId],
    queryFn: () => projectClient.getProjectsByUserId(userId),
    enabled: !!userId,
  });
}
