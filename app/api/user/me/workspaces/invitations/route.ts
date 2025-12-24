import { handleError } from '@/lib/handleError';
import { NextResponse } from 'next/server';
import { invitaitonController } from '@/modules/workspaces/invitations/invitation.controller';

export async function GET() {
  try {
    const invitations = await invitaitonController.getMyInvitations();
    return NextResponse.json(invitations);
  } catch (err) {
    return handleError(err);
  }
}
