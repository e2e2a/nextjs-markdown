import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { nodeService } from '@/services/node';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    if (body.archived) body.archived.archivedBy = session.user._id;

    const nodeToUpdate = await nodeService.updateNodeById(id, {
      ...(body.title ? { title: body.title } : {}),
      ...(body.content ? { content: body.content } : {}),
      ...(body.archived ? { archived: body.archived } : {}),
      type: body.type,
      projectId: body.projectId,
    });

    if (!nodeToUpdate)
      return NextResponse.json(
        { success: false, message: 'No node to be updated' },
        { status: 404 }
      );

    return NextResponse.json(
      {
        success: true,
        message: 'updated successfully',
        data: { projectId: nodeToUpdate.projectId, userId: nodeToUpdate.userId },
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
