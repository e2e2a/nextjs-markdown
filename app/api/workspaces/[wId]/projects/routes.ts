import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { projectController } from '@/modules/projects/project.controller';

export async function GET(req: NextRequest, context: { params: Promise<{ wid: string }> }) {
  try {
    const { wid } = await context.params;
    const res = await projectController.getProjects(wid);

    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
