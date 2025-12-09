import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationClient } from '@/lib/api/invitationClient';

export function useInvitationMutations() {
  const queryClient = useQueryClient();

  const accept = useMutation({
    mutationFn: (workspaceId: string) => invitationClient.accept(workspaceId),
    onSuccess: data => {
      if (data && data.userId) {
        queryClient.invalidateQueries({ queryKey: ['userWorkspaces', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['userInvitations', data.userId] });
      }
      return;
    },
  });
  const decline = useMutation({
    mutationFn: (workspaceId: string) => invitationClient.decline(workspaceId),
    onSuccess: data => {
      if (data && data.userId) {
        queryClient.invalidateQueries({ queryKey: ['userWorkspaces', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['userInvitations', data.userId] });
      }
      return;
    },
  });

  return { accept, decline };
}
