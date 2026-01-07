import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { projectController } from '@/modules/projects/project.controller';
import connectDb from '@/lib/db/connection';

export async function GET(_req: NextRequest, context: { params: Promise<{ wid: string }> }) {
  try {
    await connectDb();
    const { wid } = await context.params;
    const res = await projectController.getProjects(wid);

    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
