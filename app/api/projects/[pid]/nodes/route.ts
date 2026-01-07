import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { nodeController } from '@/modules/projects/nodes/nodes.controller';
import connectDb from '@/lib/db/connection';

export async function GET(req: NextRequest, context: { params: Promise<{ pid: string }> }) {
  try {
    await connectDb();
    const { pid } = await context.params;
    const res = await nodeController.getProjectTree(pid);

    return NextResponse.json(res);
  } catch (err) {
    return handleError(err);
  }
}
