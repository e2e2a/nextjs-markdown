import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/handleError';
import { IProject } from '@/models/project';
import { projectService } from '@/services/project';
import { NextRequest, NextResponse } from 'next/server';

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
        console.log('projectaa', projects);
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
