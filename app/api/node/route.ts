import connectDb from '@/lib/db/connection';
import { HttpError } from '@/utils/errors';
import { handleError } from '@/lib/handleError';
import { nodeService } from '@/modules/projects/nodes/node.service';
import { projectService } from '@/modules/projects/project.service';
import { ProjectPushNodeDTO } from '@/types';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    await connectDb();

    if (projectId) {
      const project = await nodeService.findNodeByProjectId(projectId);
      return NextResponse.json(project);
    }

    return NextResponse.json([]);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);
    body.userId = session.user._id;
    const node = await nodeService.createNode(body);

    await projectService.pushNode(node.projectId, {
      ...body,
      nodes: [node._id],
    } as ProjectPushNodeDTO);

    const projects = await projectService.findProjectsByUserId(body.userId!);

    return NextResponse.json(
      {
        success: true,
        message: 'Created successfully',
        data: { projectId: body.projectId, userId: body.userId, projects: projects },
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
