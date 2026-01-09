import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/handleError';
import { nodeController } from '@/modules/projects/nodes/nodes.controller';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    await connectDb();
    const res = await nodeController.update(id, body);

    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
