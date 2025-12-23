import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { invitationServices } from '@/modules/workspaces/invitations/invitation.service';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { IWorkspaceMemberCreateDTO } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    await invitationServices.create(
      session.user,
      body as { workspaceId: string; projectId: string; members: IWorkspaceMemberCreateDTO[] }
    );

    return NextResponse.json({ success: true, userId: session.user._id });
  } catch (err) {
    return handleError(err);
  }
}
