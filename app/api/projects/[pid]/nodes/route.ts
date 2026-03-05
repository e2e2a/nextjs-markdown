import { handleError } from '@/lib/server/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { nodeController } from '@/modules/projects/nodes/nodes.controller';
import connectDb from '@/lib/db/connection';

export async function GET(req: NextRequest, context: { params: Promise<{ pid: string }> }) {
  try {
    await connectDb();
    const { pid } = await context.params;

    // Simple extraction of the exclude param (e.g., ?exclude=content,metadata)
    const { searchParams } = new URL(req.url);
    const exclude = searchParams.get('exclude');

    const res = await nodeController.getProjectTree(pid, exclude);

    return NextResponse.json(res);
  } catch (err) {
    return handleError(err);
  }
}
