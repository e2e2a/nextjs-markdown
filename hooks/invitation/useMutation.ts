import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationClient } from '@/lib/api/workspaceInvitationClient';

export function useInvitationMutations() {
  const queryClient = useQueryClient();

  const accept = useMutation({
    mutationFn: (id: string) => invitationClient.accept(id),
    onSuccess: data => {
      if (data && data.userId) {
        queryClient.invalidateQueries({ queryKey: ['userWorkspaces', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['userInvitations', data.userId] });
      }
      return;
    },
  });

  const create = useMutation({
    mutationFn: (data: {
      workspaceId: string;
      members: {
        role: 'owner' | 'editor' | 'viewer';
        email: string;
      }[];
    }) => invitationClient.create(data),
    onSuccess: data => {
      if (data && data.userId) {
        queryClient.invalidateQueries({ queryKey: ['userWorkspaces', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['userInvitations', data.userId] });
      }
      return;
    },
  });

  const decline = useMutation({
    mutationFn: (id: string) => invitationClient.decline(id),
    onSuccess: data => {
      if (data && data.userId) {
        queryClient.invalidateQueries({ queryKey: ['userWorkspaces', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['userInvitations', data.userId] });
      }
      return;
    },
  });

  return { accept, create, decline };
}
