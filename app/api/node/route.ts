import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/handleError';
import { nodeService } from '@/services/node';
import { projectService } from '@/services/project';
import { ProjectPushNodeDTO } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

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

    const node = await nodeService.createNode(body);
    if (node.error)
      return NextResponse.json(
        {
          success: false,
          message: node.message,
        },
        { status: node.status }
      );

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
