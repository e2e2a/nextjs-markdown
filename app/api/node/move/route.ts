import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { nodeController } from '@/modules/projects/nodes/nodes.controller';

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const body = await request.json();
    const res = await nodeController.move(body);

    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
