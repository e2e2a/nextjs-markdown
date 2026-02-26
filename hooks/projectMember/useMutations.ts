import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectMemberClient } from '@/lib/client/api/projectMemberClient';

export function useProjectMemberMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: {
      projectId: string;
      members: {
        role: 'owner' | 'editor' | 'viewer';
        email: string;
      }[];
    }) => projectMemberClient.create(data),
    onSuccess: () => {
      // if (data && data.workspaceId)
      //   queryClient.invalidateQueries({ queryKey: ['projectsByWorkspaceId', data.workspaceId] });
      return;
    },
  });

  return { create };
}
