import connectDb from '@/lib/db/connection';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { HttpError } from '@/utils/errors';
import { handleError } from '@/lib/handleError';
import { workspaceService } from '@/modules/workspaces/workspace.service';
import { workspaceMemberServices } from '@/modules/workspaces/members/member.service';

export async function GET(req: NextRequest, context: { params: Promise<{ wId: string }> }) {
  try {
    await connectDb();
    const { wId } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    const workspaces = await workspaceMemberServices.getMembership({
      workspaceId: wId,
      email: session.user.email,
    });

    return NextResponse.json(workspaces, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    await workspaceService.leave({
      workspaceId: id,
      userId: session.user._id.toString(),
    });

    return NextResponse.json({ success: true, userId: session.user._id });
  } catch (err) {
    return handleError(err);
  }
}
