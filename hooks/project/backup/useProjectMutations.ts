import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectClient } from '@/lib/api/projectClient';
import { IProject, UpdateProjectDTO } from '@/types';

export function useProjectMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: projectClient.createProject,
    onSuccess: data => {
      const userId = data.data.userId;
      const newProject = data.data.project;
      if (!userId || !newProject) return;
      queryClient.setQueryData(['projectsByUserId', userId], (oldData: IProject[]) => {
        if (!oldData) return [newProject];
        return [...oldData, newProject];
      });
      return;
    },
  });

  const update = useMutation({
    mutationFn: (data: { _id: string } & UpdateProjectDTO) => projectClient.updateProject(data),
    onSuccess: data => {
      if (data.data.userId) {
        queryClient.invalidateQueries({ queryKey: ['project', data.data.projectId] });
        queryClient.invalidateQueries({ queryKey: ['projectsByUserId', data.data.userId] });
      }
      if (data.data.archived)
        queryClient.invalidateQueries({ queryKey: ['trash', data.data.userId] });
      return;
    },
  });
  return { create, update };
}
