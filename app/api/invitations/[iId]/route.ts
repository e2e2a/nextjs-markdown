import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { invitationController } from '@/modules/workspaces/invitations/invitation.controller';
import connectDb from '@/lib/db/connection';
/**
 * This is only for intent: "cancel"
 * @param req
 * @param context
 * @returns
 */
export async function DELETE(req: NextRequest, context: { params: Promise<{ iid: string }> }) {
  try {
    await connectDb();
    const { iid } = await context.params;
    const res = await invitationController.delete(iid);

    return NextResponse.json(res ?? null);
  } catch (err) {
    return handleError(err);
  }
}
