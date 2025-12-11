import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IWorkspaceMemberCreateDTO } from '@/types';
import { workspaceClient } from '@/lib/api/workspaceClient';

export function useWorkspaceMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: { title: string; members: IWorkspaceMemberCreateDTO[] }) =>
      workspaceClient.create(data),
    onSuccess: data => {
      if (data && data.userId)
        queryClient.invalidateQueries({ queryKey: ['userWorkspaces', data.userId] });
      return;
    },
  });

  const createProject = useMutation({
    mutationFn: (data: {
      title: string;
      workspaceId: string;
      members: {
        role: 'owner' | 'editor' | 'viewer';
        email: string;
      }[];
    }) => workspaceClient.createProject(data),
    onSuccess: data => {
      if (data && data.userId)
        queryClient.invalidateQueries({ queryKey: ['userWorkspaces', data.userId] });
      return;
    },
  });

  const leave = useMutation({
    mutationFn: (workspaceId: string) => workspaceClient.leave(workspaceId),
    onSuccess: data => {
      if (data && data.userId) {
        queryClient.invalidateQueries({ queryKey: ['userWorkspaces', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['userInvitations', data.userId] });
      }
      return;
    },
  });

  return { create, leave, createProject };
}
