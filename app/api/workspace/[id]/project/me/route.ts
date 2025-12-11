import connectDb from '@/lib/db/connection';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { workspaceService } from '@/services/workspace';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    const member = await workspaceService.getUserWorkspaceProjects(id, session.user.email);

    return NextResponse.json({ success: true, member });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    await workspaceService.createProject(
      {
        members: body.members,
        workspaceId: id,
        title: body.title,
      },
      session.user
    );

    return NextResponse.json({ success: true, userId: session.user._id });
  } catch (err) {
    return handleError(err);
  }
}
