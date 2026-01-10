import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNode, updateNode } from '@/lib/api/nodeClient';

export function useNodeMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: {
      projectId: string;
      parentId: string | null;
      type: 'file' | 'folder';
      title: string;
    }) => createNode(data),
    onSuccess: (_data, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({ queryKey: ['nodesByProjectId', variables.projectId] });
    },
  });

  const update = useMutation({
    mutationFn: (data: { _id: string; pid?: string; title?: string; content?: string }) =>
      updateNode(data),
    onSuccess: (_data, variables) => {
      if (!variables) return;
      // condition for title only sidebar to rerender
      if (variables.title)
        queryClient.invalidateQueries({ queryKey: ['nodesByProjectId', variables.pid] });
      return;
    },
  });

  return { create, update };
}
