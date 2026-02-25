import { ensureAuthenticated } from '@/lib/server/auth-utils';
import { projectMemberService } from './member.service';

export const projectMemberController = {
  // getMyMembership: async (workspaceId: string) => {
  //   const session = await ensureAuthenticated();
  //   // const context = await ensureWorkspaceMember(workspaceId, session.user.email);

  //   return { ...context };
  // },

  getWorkspaceMembers: async (projectId: string) => {
    const session = await ensureAuthenticated();
    const members = await projectMemberService.getMemberships({ projectId, email: session.user.email });
    return { members };
  },
};
