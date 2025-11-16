import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberClient } from '@/lib/api/memberClient';
import { InviteMembersDTO } from '@/types';

export function useMemberMutations() {
  const queryClient = useQueryClient();

  const inviteMember = useMutation({
    mutationFn: (data: InviteMembersDTO) => memberClient.inviteMember(data),
    onSuccess: data => {
      if (data.projectId)
        queryClient.invalidateQueries({ queryKey: ['membersByProjectId', data.projectId] });
      return;
    },
  });

  return { inviteMember };
}
