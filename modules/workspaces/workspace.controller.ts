import connectDb from '@/lib/db/connection';
import { ensureAuthenticated } from '@/lib/auth-utils';
import { workspaceService } from './workspace.service';
import { NextRequest, NextResponse } from 'next/server';
import { MembersSchema } from '@/lib/validators/workspaceMember';
import { HttpError } from '@/utils/errors';

export const workspaceController = {
  create: async (req: NextRequest) => {
    await connectDb();
    const session = await ensureAuthenticated();
    const body = await req.json();

    const res = MembersSchema.safeParse(body.members);
    if (!res.success) throw new HttpError('BAD_INPUT', 'Invalid member fields.');

    const workspace = await workspaceService.initializeWorkspace(
      session.user,
      { ownerUserId: session.user._id, title: body.title },
      res.data
    );

    return NextResponse.json(
      { success: true, workspaceId: workspace._id, userId: session.user._id },
      { status: 201 }
    );
  },
};
