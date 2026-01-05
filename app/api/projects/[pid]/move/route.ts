import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { projectController } from '@/modules/projects/project.controller';

export async function POST(req: NextRequest, context: { params: Promise<{ pid: string }> }) {
  try {
    const { pid } = await context.params;
    const res = await projectController.move(req, pid);

    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
