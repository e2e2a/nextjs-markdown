import z from 'zod';

const MemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['owner', 'viewer', 'editor']),
});

export const MembersSchema = z.array(MemberSchema);
