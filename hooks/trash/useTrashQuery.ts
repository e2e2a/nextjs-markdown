import { useQuery } from '@tanstack/react-query';
import { getArhivedByUserId } from '@/lib/api/trashClient';

export function useTrashQueryByUserId(userId: string) {
  return useQuery({
    queryKey: ['trash', userId],
    queryFn: () => getArhivedByUserId(),
    enabled: !!userId,
  });
}
