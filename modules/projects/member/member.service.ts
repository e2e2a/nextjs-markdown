import { HttpError } from '@/utils/server/errors';
import { projectMemberRepository } from '@/modules/projects/member/member.repository';
import { UnitOfWork } from '@/common/UnitOfWork';

export const projectMemberService = {
  store: async (
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
      workspaceId: string;
      projectId: string;
    }[]
  ) => {
    return await UnitOfWork.run(async () => {
      // Project members
      const existingP = await projectMemberService.checkProjectMemberExistence(members);
      let nonExistingP = members;
      if (existingP.length > 0) nonExistingP = members.filter(m => !existingP.includes(m.email));
      if (nonExistingP.length > 0) await projectMemberRepository.createMany(members);

      return true;
    });
  },

  move: async (oldwid: string, newwid: string, projectId: string) => {
    return await UnitOfWork.run(async () => {
      const dataToUpdate = {
        role: 'viewer' as const,
        workspaceId: newwid,
      };
      // @Note: reason to update because project member cannot be exist without the project.
      const members = await projectMemberRepository.findMany({ projectId, workspaceId: oldwid });
      await projectMemberRepository.updateMany({ projectId, workspaceId: oldwid }, dataToUpdate);
      return members;
    });
  },

  checkProjectMemberExistence: async (
    members: {
      email: string;
      workspaceId: string;
      projectId: string;
    }[]
  ) => {
    const emails = members.map(m => m.email);
    return await projectMemberRepository.findExistingEmails(members[0].workspaceId, members[0].projectId, emails);
  },

  getMembership: async (data: { projectId: string; email: string }) => {
    const membership = await projectMemberRepository.findOne(data);
    if (!membership) throw new HttpError('FORBIDDEN', 'Not a project member');
    return membership;
  },

  addOwner: (data: { projectId: string; workspaceId: string; email: string }) => projectMemberRepository.create({ ...data, role: 'owner' }),
};
