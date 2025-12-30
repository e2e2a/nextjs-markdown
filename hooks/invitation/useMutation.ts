import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationClient } from '@/lib/api/invitationClient';

export function useInvitationMutations() {
  const queryClient = useQueryClient();

  const accept = useMutation({
    mutationFn: (data: { id: string; workspaceId: string }) => invitationClient.accept(data.id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['userInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['userWorkspaces'] });
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['userInvitations'] }); // @broadcast
      return;
    },
  });

  const reject = useMutation({
    mutationFn: (data: { id: string; workspaceId: string }) => invitationClient.reject(data.id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.workspaceId] }); // @broadcast
      queryClient.invalidateQueries({ queryKey: ['userInvitations'] }); // @broadcast
      return;
    },
  });

  const trash = useMutation({
    mutationFn: (data: { id: string; workspaceId: string }) => invitationClient.trash(data.id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['userInvitations'] }); // @broadcast
      return;
    },
  });

  return { accept, create, reject, trash };
}
