import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userClient } from '@/lib/api/userClient';
import { IOnboard } from '@/types';

export function useUserMutations() {
  const queryClient = useQueryClient();

  const verifyEmail = useMutation({
    mutationFn: (data: { token: string; code: string }) => userClient.verifyEmail(data),
    onSuccess: data => {
      if (data && data.token) queryClient.invalidateQueries({ queryKey: ['token', data.token] });
      return;
    },
  });

  const onboard = useMutation({
    mutationFn: (data: IOnboard) => userClient.onboard(data),
    onSuccess: () => {
      return;
    },
  });

  return { verifyEmail, onboard };
}
