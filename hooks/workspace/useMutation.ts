import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IWorkspaceMemberCreateDTO } from '@/types';
import { workspaceClient } from '@/lib/api/workspaceClient';

export function useWorkspaceMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: { userId: string; title: string; members: IWorkspaceMemberCreateDTO[] }) =>
      workspaceClient.create(data),
    onSuccess: (_data, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({ queryKey: ['userWorkspaces', variables.userId] });
      return;
    },
  });

  return { create };
}
