import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { invitationServices } from '@/modules/workspaces/invitations/invitation.service';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ invtationId: string }> }
) {
  try {
    const { invtationId } = await context.params;
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    await invitationServices.accept({
      _id: invtationId,
      email: session.user.email,
    });

    return NextResponse.json({ success: true, userId: session.user._id });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ invtationId: string }> }
) {
  try {
    const { invtationId } = await context.params;
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    await invitationServices.decline({
      _id: invtationId,
      email: session.user.email,
    });

    return NextResponse.json({ success: true, userId: session.user._id });
  } catch (err) {
    return handleError(err);
  }
}
