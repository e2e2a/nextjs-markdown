import z from 'zod';

const MemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['owner', 'viewer', 'member']),
});

export const MembersSchema = z.array(MemberSchema);
