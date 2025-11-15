import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { projectService } from '@/services/project';
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
    let archived = false;
    if (body.archived) {
      body.archived.archivedBy = session.user._id;
      archived = true;
    }

    const projectToUpdate = await projectService.updateProjectById(id, {
      ...(body.title ? { title: body.title } : {}),
      ...(body.archived ? { archived: body.archived } : {}),
    });

    if (!projectToUpdate)
      return NextResponse.json(
        { success: false, message: 'No project to be updated.' },
        { status: 404 }
      );

    return NextResponse.json(
      {
        success: true,
        message: 'updated successfully',
        data: { _id: projectToUpdate._id, userId: projectToUpdate.userId, archived },
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
