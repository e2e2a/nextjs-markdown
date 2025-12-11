import z from 'zod';

const projectMemberSchema = z.object({
  userId: z.string().min(24, 'Invalid user id.').max(24, 'length too long.'),
  role: z.enum(['owner', 'viewer', 'member']),
});

export const ProjectMemberSchema = z.array(projectMemberSchema);
