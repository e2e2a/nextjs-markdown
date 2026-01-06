import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { projectController } from '@/modules/projects/project.controller';

export async function POST(req: NextRequest) {
  try {
    const res = await projectController.create(req);

    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
