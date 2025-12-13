import z from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Project name is required').max(50, 'Project name is too long'),
});
