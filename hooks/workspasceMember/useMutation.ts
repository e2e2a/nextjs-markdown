import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceClient } from '@/lib/api/workspaceClient';

export function useWorkspaceMemberMutations() {
  const queryClient = useQueryClient();

  const leave = useMutation({
    mutationFn: (workspaceId: string) => workspaceClient.leave(workspaceId),
    onSuccess: data => {
      if (data && data.userId) {
        queryClient.invalidateQueries({ queryKey: ['userWorkspaces', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['userInvitations', data.userId] });
      }
      return;
    },
  });

  return { leave };
}
