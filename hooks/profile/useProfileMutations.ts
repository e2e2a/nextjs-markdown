import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileClient } from '@/lib/api/profileClient';

export function useProfileMutations() {
  const queryClient = useQueryClient();

  const updateKBA = useMutation({
    mutationFn: (data: { _id: string; kbaQuestion: string; kbaAnswer: string }) =>
      profileClient.updateKBA(data),
    onSuccess: () => {
      return;
    },
  });

  return { updateKBA };
}
