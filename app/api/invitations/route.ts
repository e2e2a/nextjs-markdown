import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { invitationController } from '@/modules/workspaces/invitations/invitation.controller';
import { IWorkspaceMemberCreateDTO } from '@/types';
import connectDb from '@/lib/db/connection';

export async function GET() {
  try {
    await connectDb();
    const res = await invitationController.getMyInvitations();
    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const res = await invitationController.create(
      body as { workspaceId: string; projectId: string; members: IWorkspaceMemberCreateDTO[] }
    );

    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
