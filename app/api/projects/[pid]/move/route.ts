import { handleError } from '@/lib/server/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { projectController } from '@/modules/projects/project.controller';
import connectDb from '@/lib/db/connection';

export async function POST(req: NextRequest, context: { params: Promise<{ pid: string }> }) {
  try {
    await connectDb();
    const { pid } = await context.params;
    const res = await projectController.move(req, pid);

    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
