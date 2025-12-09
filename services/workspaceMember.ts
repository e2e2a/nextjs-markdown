import { HttpError } from '@/lib/error';
import { MembersSchema } from '@/lib/validators/workspaceMember';
import { workspaceMemberRepository } from '@/repositories/workspaceMember';

export const workspaceMemberService = {
  create: async (
    members: {
      role: 'owner' | 'member' | 'viewer';
      email: string;
      invitedBy: string;
      status: 'pending' | 'accepted';
      workspaceId: string;
    }[]
  ) => {
    const res = MembersSchema.safeParse(members);
    if (!res.success) throw new HttpError('Invalid member fields.', 400);
    await workspaceMemberService.checkDuplicateEmails(members);
    const newMembers = await workspaceMemberRepository.createMany(members);
    if (!newMembers) throw new HttpError('Semething went wrong.', 500);

    return newMembers;
  },

  checkDuplicateEmails: async (
    members: {
      role: 'owner' | 'member' | 'viewer';
      email: string;
      invitedBy: string;
      status: 'pending' | 'accepted';
      workspaceId: string;
    }[]
  ) => {
    const emails = members.map(m => m.email);
    const existing = await workspaceMemberRepository.findExistingEmails(
      members[0].workspaceId,
      emails
    );

    if (existing.length > 0)
      throw new HttpError('Some users are already members of this workspace.', 409);

    return existing;
  },
};
