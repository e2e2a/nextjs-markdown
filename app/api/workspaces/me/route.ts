import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { workspaceService } from '@/services/workspace';

export async function GET() {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    const workspaces = await workspaceService.getUserWorkspaces(session.user.email);
    return NextResponse.json(workspaces, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
