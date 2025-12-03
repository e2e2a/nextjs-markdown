import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tokenClient } from '@/lib/api/tokenClient';

export function useTokenMutations() {
  const queryClient = useQueryClient();

  const resendCode = useMutation({
    mutationFn: tokenClient.resendCode,
    onSuccess: data => {
      if (data && data.token)
        queryClient.invalidateQueries({ queryKey: ['tokenByToken', data.token] });
      return;
    },
  });

  return { resendCode };
}
