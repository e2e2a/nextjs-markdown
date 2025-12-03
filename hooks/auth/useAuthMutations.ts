import { useMutation } from '@tanstack/react-query';
import { AuthUser } from '@/types';
import { authClient } from '@/lib/api/authClient';

export function useAuthMutations() {
  const auth = useMutation({
    mutationFn: (data: AuthUser) => authClient.auth(data),
    onSuccess: () => {
      return;
    },
  });

  return { auth };
}
