import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/handleError';
import { projectService } from '@/services/project';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { HttpError } from '@/lib/error';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    let projects;
    switch (true) {
      case !!userId:
        projects = await projectService.findProjectsByUserId(userId!);
        break;
      default:
        projects = [];
        break;
    }

    return NextResponse.json(projects);
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

    await projectService.create(session.user, {
      members: body.members,
      workspaceId: id,
      title: body.title,
    });

    return NextResponse.json({ success: true, userId: session.user._id });
  } catch (err) {
    return handleError(err);
  }
}
