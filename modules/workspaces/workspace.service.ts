import { HttpError } from '@/utils/errors';
import { workspaceRepository } from '@/modules/workspaces/workspace.repository';
import { IWorkspace, IWorkspaceMemberCreateDTO } from '@/types';
import { workspaceMemberServices } from './members/member.service';
import { User } from 'next-auth';
import { workspaceMemberRepository } from '@/modules/workspaces/members/member.repository';
import mongoose from 'mongoose';

export const workspaceService = {
  initializeWorkspace: async (
    user: User,
    workspace: IWorkspace,
    members: IWorkspaceMemberCreateDTO[]
  ) => {
    const newWorkspace = await workspaceRepository.store(workspace);

    if (members.length > 0) {
      const membersDataToCreate = members.map(member => ({
        ...member,
        invitedBy: user._id!.toString(),
        workspaceId: newWorkspace._id!.toString(),
      }));
      await workspaceMemberServices.store(membersDataToCreate);
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
      throw new HttpError('BAD_INPUT', 'Invalid workspace ID.');

    const res = await workspaceMemberRepository.deleteByWorkspaceIdAndUserId(data);
    if (!res) throw new HttpError('NOT_FOUND', 'No workspace member to be deleted.');
  },
};
