import connectDb from '@/lib/db/connection';
import { HttpError } from '@/utils/errors';
import { handleError } from '@/lib/handleError';
import { projectService } from '@/modules/projects/project.service';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const searchParams = req.nextUrl.searchParams;
    const wid = searchParams.get('wid');
    if (!wid) throw new HttpError('Workspace ID is required', 400);
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    const project = await projectService.getMyWorkspaceProjects(wid, session.user.email);
    if (!project) throw new HttpError('No Project Found.', 404);
    console.log('project', project);
    return NextResponse.json(project, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
