import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IWorkspaceMemberCreateDTO } from '@/types';
import { workspaceClient } from '@/lib/api/workspaceClient';

export function useWorkspaceMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: { title: string; members: IWorkspaceMemberCreateDTO[] }) =>
      workspaceClient.create(data),
    onSuccess: data => {
      if (data && data.userId)
        queryClient.invalidateQueries({ queryKey: ['userWorkspaces', data.userId] });
      return;
    },
  });

  return { create };
}
