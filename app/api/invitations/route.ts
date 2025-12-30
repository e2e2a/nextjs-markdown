import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { invitationController } from '@/modules/workspaces/invitations/invitation.controller';
import { IWorkspaceMemberCreateDTO } from '@/types';

export async function GET() {
  try {
    const res = await invitationController.getMyInvitations();
    return NextResponse.json(res ?? null, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await invitationController.create(
      body as { workspaceId: string; projectId: string; members: IWorkspaceMemberCreateDTO[] }
    );

    return NextResponse.json(res ?? null, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
