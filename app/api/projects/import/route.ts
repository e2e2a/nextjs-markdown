import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/server/handleError';
import { projectController } from '@/modules/projects/project.controller';

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const res = await projectController.import(req);

    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
