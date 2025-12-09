import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { invitationServices } from '@/services/invitation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    const workspaces = await invitationServices.getUserInvitations({ email: session.user.email });
    return NextResponse.json(workspaces);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { workspaceId } = await req.json();
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    await invitationServices.accept({
      workspaceId,
      userId: session.user._id.toString(),
      email: session.user.email,
    });

    return NextResponse.json({ success: true, userId: session.user._id });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { workspaceId } = await req.json();
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    await invitationServices.decline({
      workspaceId,
      email: session.user.email,
    });

    return NextResponse.json({ success: true, userId: session.user._id });
  } catch (err) {
    return handleError(err);
  }
}
