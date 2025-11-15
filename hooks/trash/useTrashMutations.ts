import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArchivedItem } from '@/types';
import { deleteItem, retrieveItem } from '@/lib/api/trashClient';

export function useTrashMutations() {
  const queryClient = useQueryClient();

  const retrieve = useMutation({
    mutationFn: (data: ArchivedItem) => retrieveItem(data),
    onSuccess: data => {
      if (data.data.projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', data.data.projectId] });
      }
      queryClient.invalidateQueries({ queryKey: ['projectsByUserId', data.data.userId] });
      queryClient.invalidateQueries({ queryKey: ['trash', data.data.userId] });
      return;
    },
  });

  const deletePermanently = useMutation({
    mutationFn: (data: ArchivedItem[]) => deleteItem(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['trash', data.userId] });
      return;
    },
  });

  return { retrieve, deletePermanently };
}
