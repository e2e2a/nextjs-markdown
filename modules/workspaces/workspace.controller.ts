import { ensureAuthenticated } from '@/lib/auth-utils';
import { workspaceService } from './workspace.service';
import { NextRequest } from 'next/server';
import { MembersSchema } from '@/lib/validators/workspaceMember';
import { HttpError } from '@/utils/errors';

export const workspaceController = {
  create: async (req: NextRequest) => {
    const session = await ensureAuthenticated();
    const body = await req.json();

    const resParse = MembersSchema.safeParse(body.members);
    if (!resParse.success) throw new HttpError('BAD_INPUT', 'Invalid member fields.');

    await workspaceService.initializeWorkspace(
      session.user,
      { ownerUserId: session.user._id, title: body.title },
      resParse.data
    );

    return null;
  },

  getUserWorkspaces: async () => {
    const session = await ensureAuthenticated();
    const workspaces = await workspaceService.getUserWorkspaces({ email: session.user.email });
    return workspaces;
  },
};
