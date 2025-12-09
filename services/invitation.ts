import { HttpError } from '@/lib/error';
import { workspaceMemberRepository } from '@/repositories/workspaceMember';
import mongoose from 'mongoose';
export const invitationServices = {
  getUserInvitations: async (data: { email: string }) => {
    const workspaces = await workspaceMemberRepository.findByEmailAndStatus(
      { email: data.email, status: 'pending' },
      { workspaceId: true, invitedBy: true }
    );
    return workspaces;
  },

  accept: async (data: { userId: string; email: string; workspaceId: string }) => {
    if (!mongoose.Types.ObjectId.isValid(data.workspaceId))
      throw new HttpError('Invalid workspace ID.', 400);

    const { userId, ...remainingData } = data;
    const res = await workspaceMemberRepository.updateByWorspaceIdAndEmail(remainingData, {
      status: 'accepted',
      userId,
    });
    if (!res) throw new HttpError('No workspace member to be updated.', 404);
    return;
  },

  decline: async (data: { workspaceId: string; email: string }) => {
    if (!mongoose.Types.ObjectId.isValid(data.workspaceId))
      throw new HttpError('Invalid workspace ID.', 400);
    console.log('run');
    const res = await workspaceMemberRepository.deleteByWorkspaceIdAndEmail(data);
    if (!res) throw new HttpError('No workspace member to be deleted.', 404);
  },
};
