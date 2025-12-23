import Workspace from '@/modules/workspaces/workspace.model';
import { IWorkspace } from '@/types';
import { workspaceMemberRepository } from './members/member.repository';
import { User } from 'next-auth';

export const workspaceRepository = {
  findWorkspaceId: (id: string) => Workspace.findById(id).lean<IWorkspace | null>().exec(),

  create: async (data: IWorkspace, user: User) => {
    const workspace = await new Workspace(data).save();
    await workspaceMemberRepository.create({
      role: 'owner',
      email: user.email,
      status: 'accepted',
      workspaceId: workspace._id,
    });
    return workspace;
  },
};
