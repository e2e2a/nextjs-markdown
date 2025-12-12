import { memberClient } from '@/lib/api/memberClient';
import { useQuery } from '@tanstack/react-query';

export function useMembersByEmailQuery(email: string) {
  return useQuery({
    queryKey: ['membersByEmail', email],
    queryFn: () => memberClient.findMembers({ email }),
    enabled: !!email,
  });
}

export function useMembersByProjectIdQuery(projectId: string) {
  return useQuery({
    queryKey: ['membersByProjectId', projectId],
    queryFn: () => memberClient.findMembers({ projectId }),
    enabled: !!projectId,
  });
}

export function useMembersByOwnerQuery(invitedBy: string) {
  return useQuery({
    queryKey: ['membersByOwner', invitedBy],
    queryFn: () => memberClient.findMembers({ invitedBy }),
    enabled: !!invitedBy,
  });
}
