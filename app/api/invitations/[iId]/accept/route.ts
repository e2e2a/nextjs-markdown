import { handleError } from '@/lib/handleError';
import { invitationController } from '@/modules/workspaces/invitations/invitation.controller';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ iId: string }> }) {
  try {
    const { iId } = await context.params;
    const res = await invitationController.acceptInvitationForUser(iId);

    return NextResponse.json(res ?? null);
  } catch (err) {
    return handleError(err);
  }
}
