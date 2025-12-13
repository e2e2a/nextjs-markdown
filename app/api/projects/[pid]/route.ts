import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { projectService } from '@/services/project';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

// export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await context.params;
//     await connectDb();
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) throw new HttpError('Unauthorized', 401);

//     const project = await projectService.findProject(session, id!);
//     if (!project) throw new HttpError('No Project Found.', 404);

//     return NextResponse.json(project);
//   } catch (err) {
//     return handleError(err);
//   }
// }

export async function PATCH(request: NextRequest, context: { params: Promise<{ pid: string }> }) {
  try {
    const { pid } = await context.params;
    const body = await request.json();
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    const updatedP = await projectService.updateProjectTitle(pid, body.title, session.user);
    return NextResponse.json({ success: true, workspaceId: updatedP.workspaceId }, { status: 201 });
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
