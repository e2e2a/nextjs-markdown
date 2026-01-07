import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { projectController } from '@/modules/projects/project.controller';
import connectDb from '@/lib/db/connection';

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const res = await projectController.create(req);

    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
