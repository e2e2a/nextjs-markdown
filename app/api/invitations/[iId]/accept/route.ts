import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/handleError';
import { invitationController } from '@/modules/workspaces/invitations/invitation.controller';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ iid: string }> }) {
  try {
    await connectDb();
    const { iid } = await context.params;
    const res = await invitationController.acceptInvitationForUser(iid);

    return NextResponse.json(res ?? null);
  } catch (err) {
    return handleError(err);
  }
}
