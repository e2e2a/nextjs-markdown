import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceMemberClient } from '@/lib/api/workspaceMemberClient';

export function useWorkspaceMemberMutations() {
  const queryClient = useQueryClient();

  const leave = useMutation({
    mutationFn: (data: { wid: string }) => workspaceMemberClient.leave(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userWorkspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.wid] });
      return;
    },
  });

  const update = useMutation({
    mutationFn: (data: { wid: string; mid: string; role: 'editor' | 'owner' | 'viewer' }) =>
      workspaceMemberClient.update(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.wid] });
      queryClient.invalidateQueries({ queryKey: ['userWorkspaces'] });
      return;
    },
  });

  const trash = useMutation({
    mutationFn: (data: { wid: string; mid: string }) => workspaceMemberClient.trash(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.wid] });
      queryClient.invalidateQueries({ queryKey: ['userWorkspaces'] });
      return;
    },
  });

  return { leave, trash, update };
}
