import connectDb from '@/lib/db/connection';
import { HttpError } from '@/utils/errors';
import { handleError } from '@/lib/handleError';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { trashService } from '@/services/trash';

export async function GET() {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);
    const trash = await trashService.findArchived(session.user._id as string);

    return NextResponse.json(trash);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);
    const retrieve = await trashService.retrieve(session.user._id as string, body);
    if (!retrieve) throw new HttpError('No item to retrieve.', 404);

    return NextResponse.json(
      {
        success: true,
        message: 'Restore successfully',
        data: {
          ...(body.type === 'project'
            ? { projectId: retrieve._id }
            : { projectId: body?.projectId || '' }),
          userId: session.user._id,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);
    await trashService.deletePermanently(session.user._id as string, body);

    console.log('body', body);

    return NextResponse.json(
      {
        success: true,
        message: 'Deleted successfully',
        userId: session.user._id,
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
