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

  accept: async (data: { email: string; _id: string }) => {
    if (!mongoose.Types.ObjectId.isValid(data._id))
      throw new HttpError('Invalid workspace ID.', 400);

    const res = await workspaceMemberRepository.updateByIdAndEmail(data, {
      status: 'accepted',
    });
    if (!res) throw new HttpError('No workspace member to be updated.', 404);
    return;
  },

  decline: async (data: { _id: string; email: string }) => {
    if (!mongoose.Types.ObjectId.isValid(data._id))
      throw new HttpError('Invalid workspace ID.', 400);
    const res = await workspaceMemberRepository.deleteByIdAndEmail(data);
    if (!res) throw new HttpError('No workspace member to be deleted.', 404);
  },
};
