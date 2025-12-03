import { useQuery } from '@tanstack/react-query';
import { tokenClient } from '@/lib/api/tokenClient';

export function useTokenQueryByToken(token: string) {
  return useQuery({
    queryKey: ['tokenByToken', token],
    queryFn: () => tokenClient.getTokenByToken(token),
    enabled: !!token,
  });
}
