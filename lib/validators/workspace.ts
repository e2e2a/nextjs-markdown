import z from 'zod';

export const workspaceSchema = z.object({
  title: z.string().min(1, 'Workspace name is required'),
});
