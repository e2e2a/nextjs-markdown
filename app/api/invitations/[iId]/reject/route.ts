import { handleError } from '@/lib/handleError';
import { invitationController } from '@/modules/workspaces/invitations/invitation.controller';
import { NextRequest, NextResponse } from 'next/server';

/**
 * if this action going to be a soft delete
 * we can have a resend feuture in invitation
 * @param req
 * @param context
 * @returns
 */
export async function POST(req: NextRequest, context: { params: Promise<{ iId: string }> }) {
  try {
    const { iId } = await context.params;
    const res = await invitationController.rejectInvitationForUser(iId);

    return NextResponse.json({ ...res });
  } catch (err) {
    return handleError(err);
  }
}
