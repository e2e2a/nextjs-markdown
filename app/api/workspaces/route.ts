import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { workspaceService } from '@/services/workspace';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    const workspace = await workspaceService.create(
      session.user,
      { ownerUserId: session.user._id, title: body.title },
      body.members
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Created successfully',
        workspaceId: workspace._id,
        userId: session.user._id,
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
