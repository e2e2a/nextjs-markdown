import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { invitationController } from '@/modules/workspaces/invitations/invitation.controller';
/**
 * This is only for intent: "cancel"
 * @param req
 * @param context
 * @returns
 */
export async function DELETE(req: NextRequest, context: { params: Promise<{ iId: string }> }) {
  try {
    const { iId } = await context.params;
    const res = await invitationController.delete(iId);

    return NextResponse.json(res ?? null);
  } catch (err) {
    return handleError(err);
  }
}
