import { useMutation } from '@tanstack/react-query';
import { userClient } from '@/lib/api/userClient';
import { IOnboard } from '@/types';

export function useUserMutations() {
  const onboard = useMutation({
    mutationFn: (data: IOnboard) => userClient.onboard(data),
    onSuccess: () => {
      return;
    },
  });

  return { onboard };
}
