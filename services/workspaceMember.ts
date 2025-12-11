import { HttpError } from '@/lib/error';
import { MembersSchema } from '@/lib/validators/workspaceMember';
import { workspaceMemberRepository } from '@/repositories/workspaceMember';

export const workspaceMemberService = {
  create: async (
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
      invitedBy: string;
      workspaceId: string;
    }[]
  ) => {
    const res = MembersSchema.safeParse(members);

    if (!res.success) throw new HttpError('Invalid member fields.', 400);
    const existing = await workspaceMemberService.checkWorkspaceMemberExistence(members);

    if (members.length > 0) {
      let nonExisting = members;
      if (existing.length > 0) nonExisting = members.filter(e => !existing.includes(e));
      if (nonExisting.length > 0) await workspaceMemberRepository.createMany(nonExisting);
    }
    return true;
  },

  checkWorkspaceMemberExistence: async (
    members: {
      email: string;
      workspaceId: string;
    }[]
  ) => {
    const emails = members.map(m => m.email);
    return await workspaceMemberRepository.findExistingEmails(members[0].workspaceId, emails);
  },
};
