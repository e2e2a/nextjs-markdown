import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { userService } from '@/services/user';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);
    const onboard = await userService.onboard(body, session?.user._id);
    if (!onboard) throw new HttpError('Something went wrong.', 500);

    return NextResponse.json(
      {
        success: true,
        message: 'Verification Completed.',
        token: body?.token,
        userId: session?.user._id,
        workspaceId: onboard.workspaceId,
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
