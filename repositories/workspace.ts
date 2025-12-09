import Workspace from '@/models/workspace';
import { IWorkspace } from '@/types';
import { workspaceMemberRepository } from './workspaceMember';
import { User } from 'next-auth';

export const workspaceRepository = {
  findWorkspaceId: (id: string) => Workspace.findById(id).lean<IWorkspace | null>().exec(),

  create: async (data: IWorkspace, user: User) => {
    const workspace = await new Workspace(data).save();
    await workspaceMemberRepository.create({
      role: 'owner',
      email: user.email,
      userId: user._id!.toString(),
      status: 'accepted',
      workspaceId: workspace._id,
    });
    return workspace;
  },
};
