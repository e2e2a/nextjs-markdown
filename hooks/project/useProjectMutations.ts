import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectClient } from '@/lib/api/projectClient';

export function useProjectMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: {
      title: string;
      workspaceId: string;
      members: {
        role: 'owner' | 'editor' | 'viewer';
        email: string;
      }[];
    }) => projectClient.create(data),
    onSuccess: () => {
      // if (data && data.workspaceId)
      //   queryClient.invalidateQueries({ queryKey: ['projectsByWorkspaceId', data.workspaceId] });
      return;
    },
  });

  const update = useMutation({
    mutationFn: (data: { wid: string; pid: string; title: string }) => projectClient.update(data),
    onSuccess: (_data, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({ queryKey: ['projectsByWorkspaceId', variables.wid] });
      return;
    },
  });

  const move = useMutation({
    mutationFn: (data: { wid: string; currentwid: string; pid: string }) =>
      projectClient.move(data),
    onSuccess: (_data, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({ queryKey: ['projectsByWorkspaceId', variables.wid] });
      queryClient.invalidateQueries({ queryKey: ['projectsByWorkspaceId', variables.currentwid] });
      return;
    },
  });

  const handleDelete = useMutation({
    mutationFn: (data: { pid: string }) => projectClient.delete(data),
    onSuccess: data => {
      if (data && data.workspaceId)
        queryClient.invalidateQueries({ queryKey: ['projectsByWorkspaceId', data.workspaceId] });
      return;
    },
  });

  return { create, update, handleDelete, move };
}
