import z from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Workspace name is required').max(50, 'Workspace name is too long'),
});
