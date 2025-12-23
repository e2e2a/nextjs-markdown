import { HttpError } from '@/lib/error';
import { workspaceRepository } from '@/modules/workspaces/workspace.repository';
import { IWorkspace, IWorkspaceMemberCreateDTO } from '@/types';
import { workspaceMemberServices } from './members/member.service';
import { User } from 'next-auth';
import { workspaceMemberRepository } from '@/modules/workspaces/members/member.repository';
import mongoose from 'mongoose';
import { MembersSchema } from '@/lib/validators/workspaceMember';

export const workspaceService = {
  create: async (user: User, workspace: IWorkspace, members: IWorkspaceMemberCreateDTO[]) => {
    const res = MembersSchema.safeParse(members);
    if (!res.success) throw new HttpError('Invalid member fields.', 400);

    const newWorkspace = await workspaceRepository.create(workspace, user);
    if (!newWorkspace) throw new HttpError('Semething went wrong.', 500);

    if (res.data.length > 0) {
      const membersDataToCreate = res.data.map(member => ({
        ...member,
        invitedBy: user._id!.toString(),
        workspaceId: newWorkspace._id!.toString(),
      }));
      await workspaceMemberServices.create(membersDataToCreate);
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
