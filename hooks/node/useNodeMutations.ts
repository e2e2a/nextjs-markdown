import { nodeClient } from '@/lib/api/nodeClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useNodeMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: {
      projectId: string;
      parentId: string | null;
      type: 'file' | 'folder';
      title: string;
    }) => nodeClient.create(data),
    onSuccess: (_data, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({ queryKey: ['nodesByProjectId', variables.projectId] });
    },
  });

  const update = useMutation({
    mutationFn: (data: { _id: string; pid?: string; title?: string; content?: string }) =>
      nodeClient.update(data),
    onSuccess: (_data, variables) => {
      if (!variables) return;
      // condition for title only sidebar to rerender
      if (variables.title)
        queryClient.invalidateQueries({ queryKey: ['nodesByProjectId', variables.pid] });
      return;
    },
  });

  const move = useMutation({
    mutationFn: (data: { _id: string; pid: string; parentId: string | null }) =>
      nodeClient.move(data),
    onSuccess: (_data, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({ queryKey: ['nodesByProjectId', variables.pid] });
      return;
    },
  });

  const trash = useMutation({
    mutationFn: (data: { _id: string; pid: string }) => nodeClient.trash(data),
    onSuccess: (_data, variables) => {
      if (!variables) return;
      if (variables.pid)
        queryClient.invalidateQueries({ queryKey: ['nodesByProjectId', variables.pid] });
      return;
    },
  });

  return { create, update, move, trash };
}
