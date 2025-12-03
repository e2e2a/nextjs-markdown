import { userClient } from '@/lib/api/userClient';
import { useQuery } from '@tanstack/react-query';

export function useUserQuery(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userClient.findUser(id),
    enabled: !!id,
  });
}
