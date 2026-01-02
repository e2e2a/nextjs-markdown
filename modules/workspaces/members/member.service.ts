import { HttpError } from '@/utils/errors';
import { workspaceMemberRepository } from '@/modules/workspaces/members/member.repository';
import { ensureWorkspaceMember } from '../workspace.context';

export const workspaceMemberService = {
  store: async (
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
      invitedBy: string;
      workspaceId: string;
    }[]
  ) => {
    const existing = await workspaceMemberService.checkWorkspaceMemberExistence(members);

    let nonExisting = members;
    if (existing.length > 0) nonExisting = members.filter(e => !existing.includes(e));
    if (nonExisting.length > 0) await workspaceMemberRepository.createMany(nonExisting);

    return true;
  },

  initializeOwnership: async (data: { email: string; workspaceId: string }) => {
    return await workspaceMemberRepository.create({ ...data, role: 'owner', status: 'accepted' });
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

  getMemberships: (data: { workspaceId: string; email: string }) =>
    workspaceMemberRepository.findMembers(data),

  leave: async (data: { workspaceId: string; email: string }) => {
    const context = await ensureWorkspaceMember(data.workspaceId, data.email);
    if (!context.canLeave)
      throw new HttpError('FORBIDDEN', 'Cannot leave the workspace while you are the only owner');
    /**
     * @todo
     * 1. Notify admins user leaving in the workspace
     *
     */
    const res = await workspaceMemberRepository.deleteByWorkspaceIdAndEmail(data);
    if (!res) throw new HttpError('NOT_FOUND', 'No workspace member to be deleted');
    return res;
  },

  update: async (mid: string, data: { workspaceId: string; email: string; role: string }) => {
    const context = await ensureWorkspaceMember(data.workspaceId, data.email);
    if (!context.permissions.canEditMember) throw new HttpError('FORBIDDEN');
    /**
     * @todo
     * 1. Notify admins user updating member roles
     *
     */
    const res = await workspaceMemberRepository.updateById(mid, { role: data.role });
    if (!res) throw new HttpError('NOT_FOUND', 'No workspace member to be deleted');
    return res;
  },

  delete: async (mid: string, data: { workspaceId: string; email: string }) => {
    const context = await ensureWorkspaceMember(data.workspaceId, data.email);
    if (!context.permissions.canDeleteMember) throw new HttpError('FORBIDDEN');

    const res = await workspaceMemberRepository.findById(mid);
    if (!res) throw new HttpError('NOT_FOUND', 'No workspace member to be deleted');
    if (res.role === 'owner' && context.ownerCount <= 1)
      throw new HttpError('FORBIDDEN', 'Ownership of workspace should remain atleast 1');
    /**
     * @todo
     * 1. Notify admins user deleting member
     *
     */
    await workspaceMemberRepository.deleteById(mid);
    return res;
  },
};
