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
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    await connectDb();

    let projects;
    switch (true) {
      case !!userId:
        projects = await projectService.findProjectsByUserId(userId!);
        break;
      case !!id:
        projects = await projectService.findProject(id!);
        break;
      default:
        break;
    }

    return NextResponse.json(projects);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);
    body.userId = session.user._id;

    const project = await projectService.createProject(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Project created successfully',
        data: { userId: project.userId, project: project },
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
