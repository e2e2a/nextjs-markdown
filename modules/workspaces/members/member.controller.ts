import { ensureAuthenticated } from '@/lib/auth-utils';
import { workspaceMemberService } from './member.service';
import { HttpError } from '@/utils/errors';
import { isValidMemberRole } from '@/utils/validators/workspace-member-roles';
import { ensureWorkspaceMember } from '../workspace.context';

export const workspaceMemberController = {
  leave: async (workspaceId: string) => {
    const session = await ensureAuthenticated();

    await workspaceMemberService.leave({ workspaceId, email: session.user.email });
    return null;
  },

  update: async (mid: string, workspaceId: string, body: { role: string }) => {
    const { role } = body;
    const session = await ensureAuthenticated();

    if (!role || !isValidMemberRole(role)) throw new HttpError('BAD_INPUT', 'Invalid member role');

    await workspaceMemberService.update(mid, { workspaceId, email: session.user.email, role });
    return null;
  },

  delete: async (mid: string, workspaceId: string) => {
    const session = await ensureAuthenticated();

    await workspaceMemberService.delete(mid, { workspaceId, email: session.user.email });
    return null;
  },

  getMyMembership: async (workspaceId: string) => {
    const session = await ensureAuthenticated();
    const context = await ensureWorkspaceMember(workspaceId, session.user.email);

    return { ...context };
  },

  getWorkspaceMembers: async (workspaceId: string) => {
    const session = await ensureAuthenticated();
    await ensureWorkspaceMember(workspaceId, session.user.email);

    const members = await workspaceMemberService.getMemberships({
      workspaceId,
      email: session.user.email,
    });

    return { members };
  },
};
