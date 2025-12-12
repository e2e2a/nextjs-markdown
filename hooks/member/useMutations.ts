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
      queryClient.invalidateQueries({ queryKey: ['membersByEmail', data?.email] });
      queryClient.invalidateQueries({ queryKey: ['membersByOwner', data?.invitedBy] });
      return;
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'pending' | 'accepted' | 'rejected' | 'leave';
    }) => memberClient.updateStatus(id, status),
    onSuccess: data => {
      if (data.projectId)
        queryClient.invalidateQueries({ queryKey: ['membersByProjectId', data.projectId] });
      queryClient.invalidateQueries({ queryKey: ['membersByEmail', data?.email] });
      queryClient.invalidateQueries({ queryKey: ['membersByOwner', data?.invitedBy] });
      return;
    },
  });

  const deleteMember = useMutation({
    mutationFn: ({ id }: { id: string }) => memberClient.deleteMember(id),
    onSuccess: data => {
      if (data.projectId)
        queryClient.invalidateQueries({ queryKey: ['membersByProjectId', data.projectId] });
      queryClient.invalidateQueries({ queryKey: ['membersByEmail', data?.email] });
      queryClient.invalidateQueries({ queryKey: ['membersByOwner', data?.invitedBy] });
      return;
    },
  });
  return { inviteMember, updateStatus, deleteMember };
}
