import { HttpError } from '@/utils/errors';
import { projectMemberRepository } from '@/modules/projects/member/member.repository';
import { workspaceMemberService } from '../../workspaces/members/member.service';
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
      const existingW = await workspaceMemberService.checkWorkspaceMemberExistence(members);
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
    if (!membership) throw new HttpError('FORBIDDEN', 'Not a project member');
    return membership;
  },

  addOwner: (data: { projectId: string; workspaceId: string; email: string }) =>
    projectMemberRepository.create({ ...data, role: 'owner' }),
};
