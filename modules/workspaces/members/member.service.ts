import { HttpError } from '@/lib/error';
import { workspaceMemberRepository } from '@/modules/workspaces/members/member.repository';
import mongoose from 'mongoose';

export const workspaceMemberServices = {
  create: async (
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
      invitedBy: string;
      workspaceId: string;
    }[]
  ) => {
    const existing = await workspaceMemberServices.checkWorkspaceMemberExistence(members);

    let nonExisting = members;
    if (existing.length > 0) nonExisting = members.filter(e => !existing.includes(e));
    if (nonExisting.length > 0) await workspaceMemberRepository.createMany(nonExisting);

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

  getMembership: async (data: { workspaceId: string; email: string }) => {
    if (!mongoose.Types.ObjectId.isValid(data.workspaceId))
      throw new HttpError('Invalid workspace ID.', 400);
    const membership = await workspaceMemberRepository.findOne(data);
    if (!membership) throw new HttpError('Not a workspace member', 403);
    return membership;
  },

  getMemberships: async (data: { workspaceId: string; email: string }) => {
    await workspaceMemberServices.getMembership(data);
    const workspaces = await workspaceMemberRepository.findMembers(data);
    return workspaces;
  },
};
