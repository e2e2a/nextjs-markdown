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
    onSuccess: data => {
      if (data && data.workspaceId)
        queryClient.invalidateQueries({ queryKey: ['projectsByWorkspaceId', data.workspaceId] });
      return;
    },
  });

  const update = useMutation({
    mutationFn: (data: { pid: string; title: string }) => projectClient.update(data),
    onSuccess: data => {
      if (data && data.workspaceId)
        queryClient.invalidateQueries({ queryKey: ['projectsByWorkspaceId', data.workspaceId] });
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

  return { create, update, handleDelete };
}
