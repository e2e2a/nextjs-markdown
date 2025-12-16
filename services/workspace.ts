import { HttpError } from '@/lib/error';
import { workspaceRepository } from '@/repositories/workspace';
import { IWorkspace, IWorkspaceMemberCreateDTO } from '@/types';
import { workspaceMemberServices } from './workspaceMember';
import { User } from 'next-auth';
import { workspaceMemberRepository } from '@/repositories/workspaceMember';
import mongoose from 'mongoose';

export const workspaceService = {
  create: async (user: User, workspace: IWorkspace, members: IWorkspaceMemberCreateDTO[]) => {
    const newWorkspace = await workspaceRepository.create(workspace, user);
    if (!newWorkspace) throw new HttpError('Semething went wrong.', 500);

    if (members.length > 0) {
      const membersDataToCreate = members.map(member => ({
        ...member,
        invitedBy: user._id!.toString(),
        workspaceId: newWorkspace._id!.toString(),
      }));
      const newMembers = await workspaceMemberServices.create(membersDataToCreate);
      if (!newMembers) throw new HttpError('Something went wrong.', 500);
    }

    return newWorkspace;
  },

  getUserWorkspaces: async (email: string) => {
    const workspaces = await workspaceMemberRepository.findByEmailAndStatus(
      { email, status: 'accepted' },
      { workspaceId: true }
    );
    return workspaces;
  },

  leave: async (data: { workspaceId: string; userId: string }) => {
    if (!mongoose.Types.ObjectId.isValid(data.workspaceId))
      throw new HttpError('Invalid workspace ID.', 400);

    const res = await workspaceMemberRepository.deleteByWorkspaceIdAndUserId(data);
    if (!res) throw new HttpError('No workspace member to be deleted.', 404);
  },
};
