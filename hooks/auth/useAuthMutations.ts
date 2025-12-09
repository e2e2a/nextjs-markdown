import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/api/authClient';

export function useAuthMutations() {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: (data: { email: string; password: string }) => authClient.login(data),
    onSuccess: () => {
      return;
    },
  });

  const register = useMutation({
    mutationFn: (data: { email: string; password: string }) => authClient.register(data),
    onSuccess: () => {
      return;
    },
  });

  const verifyEmail = useMutation({
    mutationFn: (data: { token: string; code: string }) => authClient.verifyEmail(data),
    onSuccess: data => {
      if (data && data.token) queryClient.invalidateQueries({ queryKey: ['token', data.token] });
      return;
    },
  });

  return { verifyEmail, login, register };
}
