import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/handleError';
import { projectService } from '@/services/project';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    await connectDb();

    const projectToUpdate = await projectService.updateProjectById(id, {
      ...(body.title ? { title: body.title } : {}),
      ...(body.archived ? { archived: body.archived } : {}),
    });
    console.log('projectToUpdate', projectToUpdate);
    if (!projectToUpdate)
      return NextResponse.json(
        { success: false, message: 'No project to be updated.' },
        { status: 404 }
      );

    return NextResponse.json(
      {
        success: true,
        message: 'updated successfully',
        data: { _id: projectToUpdate._id, userId: projectToUpdate.userId },
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
