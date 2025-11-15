import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNode, updateNode } from '@/lib/api/nodeClient';
import { UpdateNodeDTO } from '@/types';

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
    mutationFn: (data: UpdateNodeDTO) => updateNode(data),
    onSuccess: data => {
      if (data.data.userId) {
        queryClient.invalidateQueries({ queryKey: ['project', data.data.projectId] });
        queryClient.invalidateQueries({ queryKey: ['projectsByUserId', data.data.userId] });
      }
      if (data.data.archived)
        queryClient.invalidateQueries({ queryKey: ['trash', data.data.userId] });
      return;
    },
  });

  return { create, update };
}
