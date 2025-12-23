import { HttpError } from '@/lib/error';
import { projectMemberRepository } from '@/repositories/projectMember';
import { workspaceMemberServices } from '../../workspaces/members/member.service';
import { workspaceMemberRepository } from '@/modules/workspaces/members/member.repository';
import { User } from 'next-auth';

export const projectMemberService = {
  create: async (
    user: User,
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
      workspaceId: string;
      projectId: string;
    }[]
  ) => {
    if (members.length > 0) {
      // Workspace members
      const existingW = await workspaceMemberServices.checkWorkspaceMemberExistence(members);
      let nonExistingW = members.map(member => ({ ...member, invitedBy: user.email }));
      if (existingW.length > 0) nonExistingW = nonExistingW.filter(e => !existingW.includes(e));
      if (nonExistingW.length > 0) await workspaceMemberRepository.createMany(nonExistingW);

      // Project members
      const existingP = await projectMemberService.checkProjectMemberExistence(members);
      let nonExistingP = members;
      if (existingP.length > 0) nonExistingP = members.filter(e => !existingP.includes(e));
      if (nonExistingP.length > 0) await projectMemberRepository.createMany(members);
    }

    return true;
  },

  checkProjectMemberExistence: async (
    members: {
      email: string;
      workspaceId: string;
      projectId: string;
    }[]
  ) => {
    const emails = members.map(m => m.email);
    return await projectMemberRepository.findExistingEmails(
      members[0].workspaceId,
      members[0].projectId,
      emails
    );
  },

  getMembership: async (data: { projectId: string; email: string }) => {
    const membership = await projectMemberRepository.findOne(data);
    if (!membership) throw new HttpError('Not a project member', 403);
    return membership;
  },
};
