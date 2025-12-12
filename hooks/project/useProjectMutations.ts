import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectClient } from '@/lib/api/projectClient';

export function useProjectMutations() {
  const queryClient = useQueryClient();

  const createProject = useMutation({
    mutationFn: (data: {
      title: string;
      workspaceId: string;
      members: {
        role: 'owner' | 'editor' | 'viewer';
        email: string;
      }[];
    }) => projectClient.createProject(data),
    onSuccess: data => {
      if (data && data.userId)
        queryClient.invalidateQueries({ queryKey: ['userWorkspaces', data.userId] });
      return;
    },
  });
  return { createProject };
}
