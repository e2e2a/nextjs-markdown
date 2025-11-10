import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/handleError';
import { nodeService } from '@/services/node';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    await connectDb();

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
