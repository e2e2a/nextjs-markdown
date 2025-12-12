import connectDb from '@/lib/db/connection';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { workspaceService } from '@/services/workspace';

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    await workspaceService.leave({
      workspaceId: id,
      userId: session.user._id.toString(),
    });

    return NextResponse.json({ success: true, userId: session.user._id });
  } catch (err) {
    return handleError(err);
  }
}
