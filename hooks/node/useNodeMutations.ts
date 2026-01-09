import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNode, updateNode } from '@/lib/api/nodeClient';

export function useNodeMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createNode,
    onSuccess: data => {
      if (data.data.userId) {
        queryClient.invalidateQueries({ queryKey: ['project', data.data.projectId] });
        queryClient.setQueryData(['projectsByUserId', data.data.userId], () => data.data.projects);
      }
      return;
    },
  });

  const update = useMutation({
    mutationFn: (data: { _id: string; pid?: string; title?: string; content?: string }) =>
      updateNode(data),
    onSuccess: (_data, variables) => {
      if (!variables) return;
      if (variables.title)
        queryClient.invalidateQueries({ queryKey: ['nodesByProjectId', variables.pid] });
      return;
    },
  });

  return { create, update };
}
