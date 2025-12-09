import { invitationClient } from '@/lib/api/invitationClient';
import { useQuery } from '@tanstack/react-query';

export function useGetUserInvitations(userId: string) {
  return useQuery({
    queryKey: ['userInvitations', userId],
    queryFn: () => invitationClient.getPending(),
    enabled: !!userId,
  });
}
