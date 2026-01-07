import connectDb from '@/lib/db/connection';
import { HttpError } from '@/utils/errors';
import { handleError } from '@/lib/handleError';
import { projectService } from '@/modules/projects/project.service';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { projectController } from '@/modules/projects/project.controller';

export async function GET(req: NextRequest, context: { params: Promise<{ pid: string }> }) {
  try {
    await connectDb();
    const { pid } = await context.params;
    const res = await projectController.getProject(pid);
    return NextResponse.json(res);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ pid: string }> }) {
  try {
    await connectDb();
    const { pid } = await context.params;
    const res = await projectController.update(req, pid);
    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ pid: string }> }) {
  try {
    const { pid } = await context.params;
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    const deletedP = await projectService.deleteProject(pid, session.user);
    return NextResponse.json({ success: true, workspaceId: deletedP.workspaceId }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
