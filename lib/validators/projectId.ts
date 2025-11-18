import z from 'zod';

export const projectIdSchema = z.object({
  projectId: z.string().min(24, 'Project is required...').max(24, 'Project is required...'),
});
