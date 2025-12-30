import { workspaceRepository } from '@/modules/workspaces/workspace.repository';
import { IWorkspace, IWorkspaceMemberCreateDTO } from '@/types';
import { workspaceMemberService } from './members/member.service';
import { User } from 'next-auth';
import { workspaceMemberRepository } from '@/modules/workspaces/members/member.repository';
import { ensureAuthenticated } from '@/lib/auth-utils';

export const workspaceService = {
  initializeWorkspace: async (
    user: User,
    workspaceDTO: IWorkspace,
    members: IWorkspaceMemberCreateDTO[]
  ) => {
    const workspace = await workspaceRepository.store(workspaceDTO);
    await workspaceMemberService.initializeOwnership({
      email: user.email,
      workspaceId: workspace._id,
    });

    if (members.length > 0) {
      const membersDataToCreate = members.map(member => ({
        ...member,
        invitedBy: user._id!.toString(),
        workspaceId: workspace._id!.toString(),
      }));
      await workspaceMemberService.store(membersDataToCreate);
    }

    return { workspace };
  },

  getUserWorkspaces: async () => {
    const session = await ensureAuthenticated();
    const workspaces = await workspaceMemberRepository.findByEmailAndStatus(
      { email: session.user.email, status: 'accepted' },
      { workspaceId: true }
    );
    return { workspaces };
  },
};
